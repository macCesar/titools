#!/usr/bin/env node

/**
 * Insert a table of contents into long reference files.
 *
 * Skill references are loaded on demand, so a 750-line file with no index costs
 * the reading agent the whole file to reach one section. The skill-creator
 * guidance puts the threshold at 300 lines; this script finds those files and
 * prepends a linked index of their headings.
 *
 * Maintenance tool — not shipped to users. It is deliberately absent from
 * `files` in package.json.
 *
 * Usage:
 *   node scripts/generate-toc.mjs                 # dry run over skills/ and .claude/skills/
 *   node scripts/generate-toc.mjs --write         # apply
 *   node scripts/generate-toc.mjs --min-lines 500 # only the biggest files
 *   node scripts/generate-toc.mjs --path skills/ti-api/references/api-core.md
 *   node scripts/generate-toc.mjs --strip --write # remove every generated TOC
 *
 * Re-running is safe: a generated block is delimited by HTML comments and gets
 * replaced rather than duplicated.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const START = '<!-- TOC-START -->';
const END = '<!-- TOC-END -->';

// Roots scanned when no explicit --path is given. `.claude/skills/` holds the
// maintainer-only auditor, which has the same problem and is easy to forget.
const ROOTS = ['skills', '.claude/skills'];

function parseArgs(argv) {
  const opts = { write: false, minLines: 300, paths: [], strip: false, maxEntries: 60 };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--write') opts.write = true;
    else if (arg === '--strip') opts.strip = true;
    else if (arg === '--min-lines') opts.minLines = Number(argv[++i]);
    else if (arg === '--max-entries') opts.maxEntries = Number(argv[++i]);
    else if (arg === '--path') opts.paths.push(argv[++i]);
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return opts;
}

/** Recursively collect every `references/*.md` under a root. */
async function findReferences(root) {
  const found = [];
  if (!existsSync(root)) return found;

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith('.md') && dir.endsWith('references')) found.push(full);
    }
  }

  await walk(root);
  return found.sort();
}

/**
 * GitHub's anchor rules: lowercase, strip anything that is not a word character,
 * space or hyphen, then spaces to hyphens. Repeats get a numeric suffix, which is
 * what makes two "Related Types" sections in the same file link correctly.
 */
function slugify(text, seen) {
  const base = text
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

/**
 * Check that fenced code blocks open and close cleanly.
 *
 * This matters more than it sounds. Headings inside a code block are content,
 * not structure — `audit-workflow.md` documents a report template whose `##`
 * lines must never reach an index. So the heading scan has to trust the fences.
 * When the fences are broken, that trust is misplaced: a block that never closes
 * swallows every heading after it, and the result is an index that looks fine and
 * silently omits half the file.
 *
 * Rather than guess, refuse. A file flagged here needs its markdown fixed first.
 *
 * A fence carrying a language tag (```js) is an opening; a bare ``` closes. Two
 * openings in a row therefore mean the first was never closed.
 */
function analyzeFences(lines) {
  let inFence = false;
  let openedAt = 0;

  for (const [i, line] of lines.entries()) {
    const fence = line.match(/^\s*(?:```+|~~~+)(.*)$/);
    if (!fence) continue;
    const hasLanguage = fence[1].trim().length > 0;

    if (!inFence) {
      inFence = true;
      openedAt = i + 1;
    } else if (hasLanguage) {
      return { ok: false, reason: `code block opened at line ${openedAt} never closes (line ${i + 1} opens another)` };
    } else {
      inFence = false;
    }
  }

  if (inFence) {
    return { ok: false, reason: `code block opened at line ${openedAt} is never closed` };
  }
  return { ok: true };
}

/** Collect headings, skipping anything inside a fenced code block. */
function extractHeadings(lines) {
  const headings = [];
  let inFence = false;

  for (const line of lines) {
    if (/^\s*(?:```+|~~~+)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^(#{1,4})\s+(.*\S)\s*$/);
    if (match) headings.push({ level: match[1].length, text: match[2] });
  }

  return headings;
}

/**
 * Choose which heading levels to list.
 *
 * Level 2 is the useful granularity in most of these files. But some are built
 * as one long section with level-3 subsections, and a two-entry index helps
 * nobody — so when there are few level-2 headings, go one level deeper. The
 * entry cap keeps a 62-heading API dump from producing an index nobody scans.
 */
function pickLevels(headings, maxEntries) {
  const level2 = headings.filter((h) => h.level === 2);
  const level23 = headings.filter((h) => h.level === 2 || h.level === 3);

  if (level2.length >= 6) return level2;
  if (level23.length > 0 && level23.length <= maxEntries) return level23;
  return level2;
}

function buildToc(headings, selected) {
  // Slugs must be computed over *all* headings in document order: GitHub's
  // duplicate counter sees every heading, not just the ones we list.
  const seen = new Map();
  const slugs = new Map();
  for (const h of headings) slugs.set(h, slugify(h.text, seen));

  const minLevel = Math.min(...selected.map((h) => h.level));
  const lines = selected.map((h) => {
    const indent = '  '.repeat(h.level - minLevel);
    return `${indent}- [${h.text}](#${slugs.get(h)})`;
  });

  return [START, '## Contents', '', ...lines, '', END].join('\n');
}

function stripToc(content) {
  const startIdx = content.indexOf(START);
  const endIdx = content.indexOf(END);
  if (startIdx === -1 || endIdx === -1) return { content, had: false };

  const before = content.slice(0, startIdx).replace(/\n+$/, '\n');
  const after = content.slice(endIdx + END.length).replace(/^\n+/, '');
  return { content: `${before}\n${after}`, had: true };
}

/**
 * Place the index after the H1 and any prose that follows it, but before the
 * first real section — the intro line usually says what the file is for, and
 * pushing it below a wall of links buries it.
 */
function insertToc(content, toc) {
  const lines = content.split('\n');
  const firstSection = lines.findIndex((line, i) => i > 0 && /^##\s/.test(line));
  const anchor = firstSection === -1 ? lines.length : firstSection;

  const head = lines.slice(0, anchor).join('\n').replace(/\n+$/, '');
  const tail = lines.slice(anchor).join('\n');
  return `${head}\n\n${toc}\n\n${tail}`;
}

function processFile(file, opts) {
  const original = readFileSync(file, 'utf8');
  const stripped = stripToc(original);

  if (opts.strip) {
    return {
      file,
      action: stripped.had ? 'stripped' : 'no-toc',
      content: stripped.content,
      changed: stripped.had,
    };
  }

  const lines = stripped.content.split('\n');
  if (lines.length < opts.minLines) {
    return { file, action: `skipped (${lines.length} lines)`, changed: false };
  }

  const fences = analyzeFences(lines);
  if (!fences.ok) {
    return { file, action: fences.reason, changed: false, broken: true };
  }

  const headings = extractHeadings(lines);
  const selected = pickLevels(headings, opts.maxEntries);

  if (selected.length < 2) {
    return { file, action: `skipped (${selected.length} usable headings)`, changed: false };
  }

  const updated = insertToc(stripped.content, buildToc(headings, selected));
  return {
    file,
    action: `${stripped.had ? 'refreshed' : 'added'} ${selected.length} entries`,
    content: updated,
    changed: updated !== original,
  };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    console.log(readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0]);
    return;
  }

  let files = opts.paths;
  if (files.length === 0) {
    for (const root of ROOTS) files.push(...(await findReferences(root)));
  }

  const results = files.map((file) => processFile(file, opts));
  const changed = results.filter((r) => r.changed);
  const broken = results.filter((r) => r.broken);

  for (const result of results) {
    if (!result.changed) continue;
    console.log(`  ${relative(process.cwd(), result.file)} — ${result.action}`);
    if (opts.write) writeFileSync(result.file, result.content);
  }

  const skipped = results.length - changed.length - broken.length;
  console.log('');
  console.log(`  ${changed.length} file${changed.length === 1 ? '' : 's'} ${opts.write ? 'updated' : 'would change'}, ${skipped} untouched`);

  if (broken.length > 0) {
    console.log('');
    console.log(`  ${broken.length} file${broken.length === 1 ? '' : 's'} skipped — malformed code fences, fix the markdown first:`);
    for (const result of broken) {
      console.log(`    ${relative(process.cwd(), result.file)} — ${result.action}`);
    }
    console.log('');
    console.log('  These are not TOC problems. An unclosed fence renders the rest of the');
    console.log('  file as code, and would silently truncate any index generated from it.');
  }

  if (!opts.write && changed.length > 0) {
    console.log('  Dry run — re-run with --write to apply.');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
