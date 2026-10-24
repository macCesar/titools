/** Shared cleanup behavior: selections and obsolete mirrors never remove foreign skills. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { SKILLS, getAgentsSkillsDir } from '../lib/config.js';
import {
  removeUnselectedSkills,
  removeCodexRedundantSymlinks,
  removeGeminiRedundantSymlinks,
} from '../lib/cleanup.js';

const FOREIGN = 'foreign-skill';

test('selection cleanup preserves selected and foreign skills', async () => {
  const base = await mkdtemp(join(tmpdir(), 'cli-selection-'));
  try {
    const dir = getAgentsSkillsDir(base);
    for (const skill of [SKILLS[0], SKILLS[1], FOREIGN]) {
      await mkdir(join(dir, skill), { recursive: true });
    }
    removeUnselectedSkills(base, [SKILLS[0]]);
    assert.ok(existsSync(join(dir, SKILLS[0])));
    assert.equal(existsSync(join(dir, SKILLS[1])), false);
    assert.ok(existsSync(join(dir, FOREIGN)));
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test('obsolete Codex and Gemini mirrors are removed without touching foreign skills', async () => {
  const base = await mkdtemp(join(tmpdir(), 'cli-mirrors-'));
  try {
    for (const platform of ['.codex', '.gemini']) {
      const dir = join(base, platform, 'skills');
      for (const skill of [SKILLS[0], FOREIGN]) {
        await mkdir(join(dir, skill), { recursive: true });
      }
    }
    removeCodexRedundantSymlinks(base);
    removeGeminiRedundantSymlinks(base);
    for (const platform of ['.codex', '.gemini']) {
      const dir = join(base, platform, 'skills');
      assert.equal(existsSync(join(dir, SKILLS[0])), false);
      assert.ok(existsSync(join(dir, FOREIGN)));
    }
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});
