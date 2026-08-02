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
  COMMANDS,
  getAgentsSkillsDir,
  getClaudeAgentsDir,
  getClaudeCommandsDir,
} from './config.js';
import { removeSkills, removeAgents, removeCommands } from './cleanup.js';

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
 * Install skills to the agents skills directory
 * @param {string} repoDir - Repository directory
 * @param {string} baseDir - Base directory for installation
 * @param {string[]} [skillsToInstall] - Subset of skills to install (defaults to all SKILLS)
 * @returns {Promise<Object>} Results object with success/failure counts
 */
export async function installSkills(repoDir, baseDir = os.homedir(), skillsToInstall) {
  const list = skillsToInstall || SKILLS;
  const results = {
    installed: [],
    failed: [],
    removed: [],
  };

  const legacyLocal = removeSkills(baseDir, { legacyOnly: true });
  results.removed.push(...legacyLocal.removed);
  results.failed.push(...legacyLocal.failed);

  if (baseDir && baseDir !== os.homedir()) {
    const legacyGlobal = removeSkills(undefined, { legacyOnly: true });
    results.removed.push(...legacyGlobal.removed);
    results.failed.push(...legacyGlobal.failed);
  }

  for (const skill of list) {
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

  const legacyLocal = removeAgents(baseDir, { legacyOnly: true });
  results.removed.push(...legacyLocal.removed);
  results.failed.push(...legacyLocal.failed);

  if (baseDir && baseDir !== os.homedir()) {
    const legacyGlobal = removeAgents(undefined, { legacyOnly: true });
    results.removed.push(...legacyGlobal.removed);
    results.failed.push(...legacyGlobal.failed);
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
 * Install a single slash command to the Claude commands directory
 * @param {string} repoDir - Repository directory
 * @param {string} commandName - Name of the command (without .md)
 * @param {string} baseDir - Base directory for installation
 * @returns {Promise<boolean>} True if installed successfully
 */
export async function installCommand(repoDir, commandName, baseDir = os.homedir()) {
  const commandsDir = getClaudeCommandsDir(baseDir);
  const src = join(repoDir, 'commands', `${commandName}.md`);
  const dest = join(commandsDir, `${commandName}.md`);

  if (!existsSync(commandsDir)) {
    mkdirSync(commandsDir, { recursive: true });
  }

  if (!existsSync(src)) {
    return false;
  }

  if (existsSync(dest)) {
    await remove(dest);
  }

  copyFileSync(src, dest);
  return true;
}

/**
 * Install all slash commands to the Claude commands directory
 * @param {string} repoDir - Repository directory
 * @param {string} baseDir - Base directory for installation
 * @returns {Promise<Object>} Results object with installed / failed / removed / skipped
 */
export async function installCommands(repoDir, baseDir = os.homedir()) {
  const results = {
    installed: [],
    failed: [],
    removed: [],
    skipped: [],
  };

  const legacyLocal = removeCommands(baseDir, { legacyOnly: true });
  results.removed.push(...legacyLocal.removed);
  results.failed.push(...legacyLocal.failed);

  if (baseDir && baseDir !== os.homedir()) {
    const legacyGlobal = removeCommands(undefined, { legacyOnly: true });
    results.removed.push(...legacyGlobal.removed);
    results.failed.push(...legacyGlobal.failed);
  }

  const { pluginProvidesCommand } = await import('./claude-plugin.js');
  const commandsDir = getClaudeCommandsDir(baseDir);

  for (const cmd of COMMANDS) {
    // Same rule the symlink step applies to skills: when the marketplace plugin
    // already provides the command, installing our own copy makes it show up
    // twice in the autocomplete. Clean up any copy left from before the plugin
    // was installed.
    if (pluginProvidesCommand(cmd, baseDir)) {
      const stalePath = join(commandsDir, `${cmd}.md`);
      if (existsSync(stalePath)) {
        await remove(stalePath);
        results.removed.push(cmd);
      }
      results.skipped.push(cmd);
      continue;
    }

    if (await installCommand(repoDir, cmd, baseDir)) {
      results.installed.push(cmd);
    } else {
      results.failed.push(cmd);
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
  installSkill,
  installSkills,
  installAgent,
  installAgents,
  installCommand,
  installCommands,
  getLocalRepoDir,
};
