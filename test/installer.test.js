/**
 * Skill installation behavior.
 *
 * A maintainer running the CLI through `npm link` must see edits from the
 * checkout immediately. Published npm installs still receive independent
 * copies under ~/.agents/skills so they do not depend on package internals.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { installSkill } from '../lib/installer.js';

function makeFixture({ checkout }) {
  const root = mkdtempSync(path.join(tmpdir(), 'titools-installer-'));
  const repoDir = path.join(root, 'package');
  const homeDir = path.join(root, 'home');
  const skillDir = path.join(repoDir, 'skills', 'example-skill');

  mkdirSync(skillDir, { recursive: true });
  mkdirSync(homeDir, { recursive: true });
  writeFileSync(path.join(skillDir, 'SKILL.md'), '# original\n');

  if (checkout) {
    mkdirSync(path.join(repoDir, '.git'));
  }

  return { root, repoDir, homeDir, skillDir };
}

describe('installSkill', () => {
  test('symlinks from a development checkout so edits are visible immediately', async () => {
    const fixture = makeFixture({ checkout: true });
    const destination = path.join(fixture.homeDir, '.agents', 'skills', 'example-skill');

    try {
      assert.equal(await installSkill(fixture.repoDir, 'example-skill', fixture.homeDir), true);
      assert.equal(lstatSync(destination).isSymbolicLink(), true);
      assert.equal(realpathSync(destination), realpathSync(fixture.skillDir));

      writeFileSync(path.join(fixture.skillDir, 'SKILL.md'), '# edited\n');
      assert.equal(readFileSync(path.join(destination, 'SKILL.md'), 'utf8'), '# edited\n');
    } finally {
      rmSync(fixture.root, { recursive: true, force: true });
    }
  });

  test('copies from a normal npm package', async () => {
    const fixture = makeFixture({ checkout: false });
    const destination = path.join(fixture.homeDir, '.agents', 'skills', 'example-skill');

    try {
      assert.equal(await installSkill(fixture.repoDir, 'example-skill', fixture.homeDir), true);
      assert.equal(lstatSync(destination).isSymbolicLink(), false);

      writeFileSync(path.join(fixture.skillDir, 'SKILL.md'), '# edited\n');
      assert.equal(readFileSync(path.join(destination, 'SKILL.md'), 'utf8'), '# original\n');
    } finally {
      rmSync(fixture.root, { recursive: true, force: true });
    }
  });
});
