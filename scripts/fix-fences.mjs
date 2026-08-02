#!/usr/bin/env node

/**
 * Repair unclosed code fences in reference files.
 *
 * The doc-mirror references were converted from upstream Titanium documentation,
 * and the conversion left fences that open and never close. The damage is
 * invisible in a plain-text read and severe when rendered: in `api-services.md`
 * an unclosed ```xml on line 17 turns the remaining 684 lines into one code
 * block. It also breaks any tool that trusts fences to tell content from
 * structure — which is why `generate-toc.mjs` refuses to index these files.
 *
 * Two shapes show up, and they need opposite fixes:
 *
 *   Orphan   ```xml followed by nothing before the next heading or table. The
 *            example never survived the conversion, so the fence has nothing to
 *            wrap — delete it.
 *
 *   Unclosed ```js followed by real code that runs into the next section. The
 *            code is fine, the terminator is missing — insert one after the last
 *            line of code.
 *
 * Maintenance tool, not shipped. Dry run by default; always read the diff.
 *
 * Usage:
 *   node scripts/fix-fences.mjs            # report what it would do
 *   node scripts/fix-fences.mjs --write    # apply
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { existsSync } from 'node:fs';

const ROOTS = ['skills', '.claude/skills'];

/**
 * A line that clearly belongs to prose again, not to a code sample.
 *
 * The last pattern is specific to these converted files: an italic aside on its
 * own line — `*(See full overview in titanium-docs)*` appears 44 times — marks
 * where the converter cut a sample short. Without it the aside gets swallowed
 * into the code block being repaired.
 */
function isStructural(line) {
  return (
    /^#{1,6}\s/.test(line) ||
    /^\|/.test(line) ||
    /^---\s*$/.test(line) ||
    /^>\s/.test(line) ||
    /^\*\(.*\)\*\s*$/.test(line)
  );
}

/**
 * Find every fence that opens and never closes.
 *
 * A fence carrying a language tag opens; a bare one closes. Two openings in a
 * row mean the first was abandoned — that is the signal, and it is why simply
 * counting fences misses half these files (an even count can be two openings).
 */
function findUnclosed(lines) {
  const unclosed = [];
  let openAt = -1;

  lines.forEach((line, i) => {
    const match = line.match(/^\s*(?:```+|~~~+)(.*)$/);
    if (!match) return;
    const hasLanguage = match[1].trim().length > 0;

    if (openAt === -1) {
      openAt = i;
    } else if (hasLanguage) {
      unclosed.push(openAt);
      openAt = i;
    } else {
      openAt = -1;
    }
  });

  if (openAt !== -1) unclosed.push(openAt);
  return unclosed;
}

/**
 * Where the code under `openIdx` stops.
 * Returns null when nothing but blank lines follows — the orphan case.
 *
 * Structural markers catch most boundaries, but not all: these files often close
 * a sample with an italic aside like `*(See full overview in titanium-docs)*`,
 * which is prose and starts with none of them. A blank gap is the reliable
 * signal — code samples here are contiguous, and two blank lines in a row mean
 * the sample ended and the page moved on.
 */
function findCodeEnd(lines, openIdx) {
  let lastCode = -1;
  let blankRun = 0;

  for (let i = openIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(?:```+|~~~+)/.test(line)) break;
    if (isStructural(line)) break;

    if (line.trim() === '') {
      blankRun++;
      if (blankRun >= 2 && lastCode !== -1) break;
      continue;
    }

    blankRun = 0;
    lastCode = i;
  }

  return lastCode === -1 ? null : lastCode;
}

function repairFile(file) {
  const original = readFileSync(file, 'utf8');
  const lines = original.split('\n');
  const unclosed = findUnclosed(lines);
  if (unclosed.length === 0) return null;

  const actions = [];
  // Back to front: every edit shifts the line numbers after it.
  for (const openIdx of [...unclosed].reverse()) {
    const codeEnd = findCodeEnd(lines, openIdx);

    if (codeEnd === null) {
      actions.unshift({ line: openIdx + 1, kind: 'orphan', text: lines[openIdx].trim() });
      lines.splice(openIdx, 1);
    } else {
      actions.unshift({ line: openIdx + 1, kind: 'closed', text: lines[openIdx].trim(), at: codeEnd + 2 });
      lines.splice(codeEnd + 1, 0, '```');
    }
  }

  return { file, actions, content: lines.join('\n'), changed: lines.join('\n') !== original };
}

async function findMarkdown(root) {
  const found = [];
  if (!existsSync(root)) return found;

  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith('.md')) found.push(full);
    }
  }

  await walk(root);
  return found.sort();
}

async function main() {
  const write = process.argv.includes('--write');

  const files = [];
  for (const root of ROOTS) files.push(...(await findMarkdown(root)));

  const results = files.map(repairFile).filter((r) => r && r.changed);
  let orphans = 0;
  let closed = 0;

  for (const result of results) {
    console.log(`  ${relative(process.cwd(), result.file)}`);
    for (const action of result.actions) {
      if (action.kind === 'orphan') {
        orphans++;
        console.log(`      L${action.line}  removed empty fence  ${action.text}`);
      } else {
        closed++;
        console.log(`      L${action.line}  ${action.text} → closing fence added at L${action.at}`);
      }
    }
    if (write) writeFileSync(result.file, result.content);
  }

  console.log('');
  console.log(`  ${results.length} file${results.length === 1 ? '' : 's'}, ${orphans} empty fence${orphans === 1 ? '' : 's'} removed, ${closed} block${closed === 1 ? '' : 's'} closed`);
  if (!write && results.length > 0) console.log('  Dry run — re-run with --write to apply.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
