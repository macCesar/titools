/**
 * File installation utilities
 * Installs skills and agents to their respective directories
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
} from 'fs';
import { join } from 'path';
import { remove, copy } from 'fs-extra';
import os from 'os';
import {
  SKILLS,
  AGENTS,
  LEGACY_AGENTS,
  LEGACY_SKILLS,
  getAgentsSkillsDir,
  getClaudeAgentsDir,
} from './config.js';

/**
 * Recursively copy a directory
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 * @returns {Promise<void>}
 */
export async function copyDirectory(src, dest) {
  // Create destination if it doesn't exist
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  // Use fs-extra copy for recursive directory copy
  await copy(src, dest, { overwrite: true });
}

/**
 * Remove existing file or directory
 * @param {string} target - Path to remove
 * @returns {Promise<void>}
 */
export async function removeExisting(target) {
  if (existsSync(target)) {
    await remove(target);
  }
}

/**
 * Install a single skill to the agents skills directory
 * @param {string} repoDir - Repository directory
 * @param {string} skillName - Name of the skill
 * @param {string} baseDir - Base directory for installation
 * @returns {Promise<boolean>} True if installed successfully
 */
export async function installSkill(repoDir, skillName, baseDir = os.homedir()) {
  const skillsDir = getAgentsSkillsDir(baseDir);
  const skillSrc = join(repoDir, 'skills', skillName);
  const skillDest = join(skillsDir, skillName);

  // Create skills directory if needed
  if (!existsSync(skillsDir)) {
    mkdirSync(skillsDir, { recursive: true });
  }

  // Check if source exists
  if (!existsSync(skillSrc)) {
    return false;
  }

  // Remove existing if present
  if (existsSync(skillDest)) {
    await remove(skillDest);
  }

  // Copy skill directory
  await copyDirectory(skillSrc, skillDest);
  return true;
}

/**
 * Install all skills to the agents skills directory
 * @param {string} repoDir - Repository directory
 * @param {string} baseDir - Base directory for installation
 * @returns {Promise<Object>} Results object with success/failure counts
 */
export async function installSkills(repoDir, baseDir = os.homedir()) {
  const results = {
    installed: [],
    failed: [],
    removed: [],
  };

  const skillsDir = getAgentsSkillsDir(baseDir);
  if (existsSync(skillsDir)) {
    for (const legacy of LEGACY_SKILLS) {
      const legacyPath = join(skillsDir, legacy);
      if (existsSync(legacyPath)) {
        await remove(legacyPath);
        results.removed.push(legacy);
      }
    }
  }

  if (baseDir && baseDir !== os.homedir()) {
    const globalSkillsDir = getAgentsSkillsDir(os.homedir());
    if (existsSync(globalSkillsDir)) {
      for (const legacy of LEGACY_SKILLS) {
        const legacyPath = join(globalSkillsDir, legacy);
        if (existsSync(legacyPath)) {
          await remove(legacyPath);
          results.removed.push(legacy);
        }
      }
    }
  }

  for (const skill of SKILLS) {
    if (await installSkill(repoDir, skill, baseDir)) {
      results.installed.push(skill);
    } else {
      results.failed.push(skill);
    }
  }

  return results;
}

/**
 * Install a single agent to Claude agents directory
 * @param {string} repoDir - Repository directory
 * @param {string} agentName - Name of the agent (without .md)
 * @param {string} baseDir - Base directory for installation
 * @returns {Promise<boolean>} True if installed successfully
 */
export async function installAgent(repoDir, agentName, baseDir = os.homedir()) {
  const agentsDir = getClaudeAgentsDir(baseDir);
  const agentSrc = join(repoDir, 'agents', `${agentName}.md`);
  const agentDest = join(agentsDir, `${agentName}.md`);

  // Create agents directory if needed
  if (!existsSync(agentsDir)) {
    mkdirSync(agentsDir, { recursive: true });
  }

  // Check if source exists
  if (!existsSync(agentSrc)) {
    return false;
  }

  // Remove existing if present
  if (existsSync(agentDest)) {
    await remove(agentDest);
  }

  // Copy agent file
  copyFileSync(agentSrc, agentDest);
  return true;
}

async function removeLegacyAgents(agentsDir, results) {
  for (const agent of LEGACY_AGENTS) {
    const agentPath = join(agentsDir, `${agent}.md`);
    if (existsSync(agentPath)) {
      try {
        await removeExisting(agentPath);
        results.removed.push(agent);
      } catch (error) {
        results.failed.push(agent);
      }
    }
  }
}

/**
 * Install all agents to Claude agents directory
 * @param {string} repoDir - Repository directory
 * @param {string} baseDir - Base directory for installation
 * @returns {Promise<Object>} Results object with success/failure counts
 */
export async function installAgents(repoDir, baseDir = os.homedir()) {
  const results = {
    installed: [],
    failed: [],
    removed: [],
  };

  const agentsDir = getClaudeAgentsDir(baseDir);
  if (existsSync(agentsDir)) {
    await removeLegacyAgents(agentsDir, results);
  }

  if (baseDir && baseDir !== os.homedir()) {
    const globalAgentsDir = getClaudeAgentsDir(os.homedir());
    if (existsSync(globalAgentsDir)) {
      await removeLegacyAgents(globalAgentsDir, results);
    }
  }

  for (const agent of AGENTS) {
    if (await installAgent(repoDir, agent, baseDir)) {
      results.installed.push(agent);
    } else {
      results.failed.push(agent);
    }
  }

  return results;
}

/**
 * Get the local repository directory if running from source
 * @returns {string|null} Local repo directory or null
 */
export function getLocalRepoDir() {
  const scriptDir = new URL('..', import.meta.url).pathname;
  const skillsDir = join(scriptDir, 'skills');

  if (existsSync(skillsDir)) {
    return scriptDir;
  }

  return null;
}

export default {
  copyDirectory,
  removeExisting,
  installSkill,
  installSkills,
  installAgent,
  installAgents,
  getLocalRepoDir,
};
