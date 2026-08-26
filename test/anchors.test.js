/**
 * In-file anchor tests.
 *
 * Every `](#something)` link in a skill has to resolve to a heading in the same
 * file, and nothing renders an error when it does not — a dead anchor silently
 * scrolls nowhere, and the agent reading the file follows it into a blank.
 *
 * They drifted for real. `scripts/generate-toc.mjs` built its slugs by collapsing
 * runs of whitespace (`\s+`), while GitHub turns every space into its own hyphen.
 * Any heading with punctuation between words — "Top-down / Zelda",
 * "Point & click adventure", "Phase 0: Pre-flight + classify" — lost a hyphen and
 * every generated link to it went dead, across four skills, invisibly.
 *
 * The rules are `slugify` in that script, imported here rather than reimplemented:
 * a second copy of the function is how the first drift happened, and a test that
 * carries its own copy of the logic proves only that the copy agrees with itself.
 * (`slugify` was in turn checked against `github-slugger`, the library GitHub
 * uses, over all 4263 headings in this repo — see the comment on it.)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { slugify } from '../scripts/generate-toc.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ROOTS = ['skills', '.claude/skills'];

/** Every markdown file under the skill roots, whatever the nesting. */
function markdownFiles() {
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md')) found.push(full);
    }
  };
  for (const root of ROOTS) {
    const full = join(ROOT, root);
    if (existsSync(full)) walk(full);
  }
  return found.sort();
}

/**
 * Headings outside fenced code blocks, slugged in document order so the
 * duplicate counter lands on the same suffixes GitHub would use.
 */
function anchorsIn(content) {
  const seen = new Map();
  const anchors = new Set();
  let inFence = false;

  for (const line of content.split('\n')) {
    if (/^\s*(?:```+|~~~+)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^#{1,6}\s+(.*\S)\s*$/);
    if (match) anchors.add(slugify(match[1], seen));
  }
  return anchors;
}

/** Same-file links only: `](#slug)`. A link into another file is not ours to check. */
function localLinks(content) {
  const links = [];
  let inFence = false;

  for (const [i, line] of content.split('\n').entries()) {
    if (/^\s*(?:```+|~~~+)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    for (const match of line.matchAll(/\]\(#([^)\s]+)\)/g)) {
      links.push({ slug: match[1], line: i + 1 });
    }
  }
  return links;
}

describe('in-file anchors', () => {
  const files = markdownFiles();

  it('finds markdown to check', () => {
    assert.ok(files.length > 0, 'no markdown found under skills/ — the walker is broken, not the docs');
  });

  for (const file of files) {
    const relative = file.slice(ROOT.length);

    it(`${relative} has no dead anchor links`, () => {
      const content = readFileSync(file, 'utf8');
      const anchors = anchorsIn(content);
      const dead = localLinks(content).filter((link) => !anchors.has(link.slug));

      assert.deepEqual(
        dead.map((link) => `line ${link.line}: #${link.slug}`),
        [],
        `${relative} links to anchors that no heading produces`
      );
    });
  }
});
