/**
 * Tests for lib/cleanup.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  SKILLS,
  LEGACY_SKILLS,
  AGENTS,
  LEGACY_AGENTS,
  getAgentsSkillsDir,
  getClaudeAgentsDir,
} from '../lib/config.js';
import {
  removeSkills,
  removeAgents,
  removeSkillSymlinks,
  removeLegacySkillSymlinks,
  cleanupLegacyArtifacts,
} from '../lib/cleanup.js';

async function setupTempDir() {
  return mkdtemp(join(tmpdir(), 'titools-cleanup-'));
}

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function createSkillDir(root, name) {
  await ensureDir(join(root, name));
}

async function createAgentFile(dir, name) {
  await ensureDir(dir);
  await writeFile(join(dir, `${name}.md`), '# test\n', 'utf8');
}

describe('cleanup', () => {
  it('removeSkills legacyOnly removes only legacy skills', async () => {
    const baseDir = await setupTempDir();
    const skillsDir = getAgentsSkillsDir(baseDir);
    const currentSkill = SKILLS[0];
    const legacySkill = LEGACY_SKILLS[0];

    await createSkillDir(skillsDir, currentSkill);
    await createSkillDir(skillsDir, legacySkill);
    await createSkillDir(skillsDir, 'keep-skill');

    const result = removeSkills(baseDir, { legacyOnly: true });
    assert.ok(result.removed.includes(legacySkill));
    assert.ok(!existsSync(join(skillsDir, legacySkill)));
    assert.ok(existsSync(join(skillsDir, currentSkill)));
    assert.ok(existsSync(join(skillsDir, 'keep-skill')));
  });

  it('removeAgents legacyOnly removes only legacy agents', async () => {
    const baseDir = await setupTempDir();
    const agentsDir = getClaudeAgentsDir(baseDir);
    const currentAgent = AGENTS[0];
    const legacyAgent = LEGACY_AGENTS[0];

    await createAgentFile(agentsDir, currentAgent);
    await createAgentFile(agentsDir, legacyAgent);
    await createAgentFile(agentsDir, 'keep-agent');

    const result = removeAgents(baseDir, { legacyOnly: true });
    assert.ok(result.removed.includes(legacyAgent));
    assert.ok(!existsSync(join(agentsDir, `${legacyAgent}.md`)));
    assert.ok(existsSync(join(agentsDir, `${currentAgent}.md`)));
    assert.ok(existsSync(join(agentsDir, 'keep-agent.md')));
  });

  it('removeSkillSymlinks can remove legacy-only or all listed skills', async () => {
    const baseDir = await setupTempDir();
    const platformSkillsDir = join(baseDir, '.claude', 'skills');
    const currentSkill = SKILLS[0];
    const legacySkill = LEGACY_SKILLS[0];

    await createSkillDir(platformSkillsDir, currentSkill);
    await createSkillDir(platformSkillsDir, legacySkill);
    await createSkillDir(platformSkillsDir, 'keep-skill');

    removeLegacySkillSymlinks(platformSkillsDir);
    assert.ok(!existsSync(join(platformSkillsDir, legacySkill)));
    assert.ok(existsSync(join(platformSkillsDir, currentSkill)));
    assert.ok(existsSync(join(platformSkillsDir, 'keep-skill')));

    removeSkillSymlinks(platformSkillsDir);
    assert.ok(!existsSync(join(platformSkillsDir, currentSkill)));
    assert.ok(existsSync(join(platformSkillsDir, 'keep-skill')));
  });

  it('cleanupLegacyArtifacts removes legacy skills/agents in local and global paths', async () => {
    const originalHome = process.env.HOME;
    const originalUserProfile = process.env.USERPROFILE;

    const baseDir = await setupTempDir();
    const tempHome = await setupTempDir();
    try {
      process.env.HOME = tempHome;
      process.env.USERPROFILE = tempHome;

      const legacySkill = LEGACY_SKILLS[0];
      const legacyAgent = LEGACY_AGENTS[0];

      const localSkillsDir = getAgentsSkillsDir(baseDir);
      const localAgentsDir = getClaudeAgentsDir(baseDir);
      const localPlatformSkills = join(baseDir, '.claude', 'skills');
      const localPlatformConfig = join(baseDir, '.claude');

      await createSkillDir(localSkillsDir, legacySkill);
      await createAgentFile(localAgentsDir, legacyAgent);
      await createSkillDir(localPlatformSkills, legacySkill);
      await ensureDir(localPlatformConfig);

      const globalSkillsDir = getAgentsSkillsDir();
      const globalAgentsDir = getClaudeAgentsDir();
      const globalPlatformSkills = join(tempHome, '.claude', 'skills');
      const globalPlatformConfig = join(tempHome, '.claude');

      await createSkillDir(globalSkillsDir, legacySkill);
      await createAgentFile(globalAgentsDir, legacyAgent);
      await createSkillDir(globalPlatformSkills, legacySkill);
      await ensureDir(globalPlatformConfig);

      cleanupLegacyArtifacts(baseDir);

      assert.ok(!existsSync(join(localSkillsDir, legacySkill)));
      assert.ok(!existsSync(join(localAgentsDir, `${legacyAgent}.md`)));
      assert.ok(!existsSync(join(localPlatformSkills, legacySkill)));

      assert.ok(!existsSync(join(globalSkillsDir, legacySkill)));
      assert.ok(!existsSync(join(globalAgentsDir, `${legacyAgent}.md`)));
      assert.ok(!existsSync(join(globalPlatformSkills, legacySkill)));
    } finally {
      process.env.HOME = originalHome;
      process.env.USERPROFILE = originalUserProfile;
    }
  });
});
