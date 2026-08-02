/**
 * Cleanup helpers for skills, agents, and symlinks
 */

import {
  SKILLS,
  LEGACY_SKILLS,
  AGENTS,
  LEGACY_AGENTS,
  COMMANDS,
  LEGACY_COMMANDS,
  getAgentsSkillsDir,
  getClaudeAgentsDir,
  getClaudeCommandsDir,
  getCodexSkillsDir,
  getGeminiSkillsDir,
} from './config.js';
import { detectPlatforms } from './platform.js';
import { existsSync, lstatSync, rmSync } from 'fs';
import { join } from 'path';

export function getSkillList({ includeLegacy = true, legacyOnly = false } = {}) {
  if (legacyOnly) return [...LEGACY_SKILLS];
  return includeLegacy ? [...SKILLS, ...LEGACY_SKILLS] : [...SKILLS];
}

export function getAgentList({ includeLegacy = true, legacyOnly = false } = {}) {
  if (legacyOnly) return [...LEGACY_AGENTS];
  return includeLegacy ? [...AGENTS, ...LEGACY_AGENTS] : [...AGENTS];
}

export function getCommandList({ includeLegacy = true, legacyOnly = false } = {}) {
  if (legacyOnly) return [...LEGACY_COMMANDS];
  return includeLegacy ? [...COMMANDS, ...LEGACY_COMMANDS] : [...COMMANDS];
}

function removeEntriesAtDir(dir, names, { suffix = '', recursive = true } = {}) {
  const results = { removed: [], failed: [] };
  if (!dir || !existsSync(dir)) return results;

  for (const name of names) {
    const target = join(dir, suffix ? `${name}${suffix}` : name);
    try {
      lstatSync(target);
      rmSync(target, { recursive, force: true });
      results.removed.push(name);
    } catch (error) {
      if (error.code && error.code !== 'ENOENT') {
        results.failed.push(name);
      }
    }
  }

  return results;
}

export function removeSkillSymlinks(platformSkillsDir, options = {}) {
  const skillList = getSkillList(options);
  return removeEntriesAtDir(platformSkillsDir, skillList, { recursive: true });
}

export function removeLegacySkillSymlinks(platformSkillsDir) {
  return removeSkillSymlinks(platformSkillsDir, { legacyOnly: true });
}

// When the user de-selects some skills during an install, anything previously
// installed for those skills (in ~/.agents/skills/ and as platform symlinks)
// must be cleaned up so the on-disk state matches the user's selection.
export function removeUnselectedSkills(baseDir, selectedSkills) {
  const skillsDir = getAgentsSkillsDir(baseDir);
  const unselected = SKILLS.filter((s) => !selectedSkills.includes(s));
  return removeEntriesAtDir(skillsDir, unselected, { recursive: true });
}

export function removeUnselectedSymlinks(platformSkillsDir, selectedSkills) {
  const unselected = SKILLS.filter((s) => !selectedSkills.includes(s));
  return removeEntriesAtDir(platformSkillsDir, unselected, { recursive: true });
}

// Codex reads skills from the canonical ~/.agents/skills/, so any TiTools-managed
// symlinks at ~/.codex/skills/ from earlier versions are redundant and should be
// cleaned up. Targets both active and legacy skill names.
export function removeCodexRedundantSymlinks(baseDir) {
  const codexSkillsDir = getCodexSkillsDir(baseDir);
  return removeSkillSymlinks(codexSkillsDir);
}

// Gemini CLI also auto-discovers skills from ~/.agents/skills/ per the
// agentskills.io standard. Symlinks at ~/.gemini/skills/ from v3.x and
// earlier produce "Skill conflict detected" warnings on Gemini startup
// because the same skill is found in both locations.
export function removeGeminiRedundantSymlinks(baseDir) {
  const geminiSkillsDir = getGeminiSkillsDir(baseDir);
  return removeSkillSymlinks(geminiSkillsDir);
}

export function removeSkills(baseDir, options = {}) {
  const skillsDir = getAgentsSkillsDir(baseDir);
  const skillList = getSkillList(options);
  return removeEntriesAtDir(skillsDir, skillList, { recursive: true });
}

export function removeAgents(baseDir, options = {}) {
  const agentsDir = getClaudeAgentsDir(baseDir);
  const agentList = getAgentList(options);
  return removeEntriesAtDir(agentsDir, agentList, { suffix: '.md', recursive: false });
}

export function removeCommands(baseDir, options = {}) {
  const commandsDir = getClaudeCommandsDir(baseDir);
  const commandList = getCommandList(options);
  return removeEntriesAtDir(commandsDir, commandList, { suffix: '.md', recursive: false });
}

export function cleanupLegacyArtifacts(baseDir) {
  removeSkills(baseDir, { legacyOnly: true });
  removeAgents(baseDir, { legacyOnly: true });
  removeCommands(baseDir, { legacyOnly: true });

  const platforms = detectPlatforms(baseDir);
  for (const platform of platforms) {
    removeLegacySkillSymlinks(platform.skillsDir);
  }

  removeCodexRedundantSymlinks(baseDir);
  removeGeminiRedundantSymlinks(baseDir);

  if (baseDir) {
    removeSkills(undefined, { legacyOnly: true });
    removeAgents(undefined, { legacyOnly: true });
    removeCommands(undefined, { legacyOnly: true });
    const globalPlatforms = detectPlatforms();
    for (const platform of globalPlatforms) {
      removeLegacySkillSymlinks(platform.skillsDir);
    }
    removeCodexRedundantSymlinks(undefined);
    removeGeminiRedundantSymlinks(undefined);
  }
}

export default {
  getSkillList,
  getAgentList,
  getCommandList,
  removeSkillSymlinks,
  removeLegacySkillSymlinks,
  removeCodexRedundantSymlinks,
  removeGeminiRedundantSymlinks,
  removeUnselectedSkills,
  removeUnselectedSymlinks,
  removeSkills,
  removeAgents,
  removeCommands,
  cleanupLegacyArtifacts,
};
