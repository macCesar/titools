/**
 * Slash command integrity.
 *
 * The three commands lived in `.claude/commands/` until 4.2.0 — a gitignored
 * path, so they reached neither npm users nor marketplace users while the README
 * documented them. These tests pin the three things that has to stay true for
 * them to actually ship: the files exist where the installer looks, `COMMANDS`
 * matches what is on disk, and `commands/` is in the npm `files` allowlist.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { COMMANDS } from '../lib/config.js';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMMANDS_DIR = path.join(REPO_ROOT, 'commands');

describe('commands/ directory', () => {
  test('every name in COMMANDS has a file', () => {
    for (const cmd of COMMANDS) {
      assert.ok(
        existsSync(path.join(COMMANDS_DIR, `${cmd}.md`)),
        `commands/${cmd}.md is missing — installCommands would report it as failed`,
      );
    }
  });

  test('no orphan files: every .md on disk is listed in COMMANDS', () => {
    const onDisk = readdirSync(COMMANDS_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace(/\.md$/, ''));
    assert.deepEqual(
      onDisk.sort(),
      [...COMMANDS].sort(),
      'a command file that is not in COMMANDS never gets installed',
    );
  });

  test('each command has valid frontmatter with name and description', () => {
    for (const cmd of COMMANDS) {
      const body = readFileSync(path.join(COMMANDS_DIR, `${cmd}.md`), 'utf8');
      assert.ok(body.startsWith('---\n'), `${cmd}.md must open with YAML frontmatter`);

      const end = body.indexOf('\n---', 4);
      assert.ok(end > 0, `${cmd}.md frontmatter is not closed`);

      const frontmatter = body.slice(4, end);
      assert.match(frontmatter, /^name:\s*\S+/m, `${cmd}.md needs a name field`);
      assert.match(frontmatter, /^description:\s*\S+/m, `${cmd}.md needs a description field`);

      const declared = frontmatter.match(/^name:\s*(\S+)/m)[1];
      assert.equal(declared, cmd, `${cmd}.md declares name: ${declared} — must match the filename`);
    }
  });
});

describe('npm packaging', () => {
  test('commands/ is in the files allowlist', () => {
    const pkg = JSON.parse(readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
    assert.ok(
      pkg.files.includes('commands/'),
      'without commands/ in files, npm publishes a package whose installer finds no commands',
    );
  });
});
