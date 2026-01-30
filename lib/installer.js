/**
 * File installation utilities
 * Installs skills, agents, and templates to their respective directories
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
} from 'fs';
import { join } from 'path';
import { remove, copy } from 'fs-extra';
import {
  SKILLS,
  AGENTS,
  getAgentsSkillsDir,
  getClaudeAgentsDir,
  getAgentsDir,
  AGENTS_TEMPLATE_FILE,
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
 * @returns {Promise<boolean>} True if installed successfully
 */
export async function installSkill(repoDir, skillName) {
  const skillsDir = getAgentsSkillsDir();
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
 * @returns {Promise<Object>} Results object with success/failure counts
 */
export async function installSkills(repoDir) {
  const results = {
    installed: [],
    failed: [],
  };

  for (const skill of SKILLS) {
    if (await installSkill(repoDir, skill)) {
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
 * @returns {Promise<boolean>} True if installed successfully
 */
export async function installAgent(repoDir, agentName) {
  const agentsDir = getClaudeAgentsDir();
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
 * @returns {Promise<Object>} Results object with success/failure counts
 */
export async function installAgents(repoDir) {
  const results = {
    installed: [],
    failed: [],
  };

  for (const agent of AGENTS) {
    if (await installAgent(repoDir, agent)) {
      results.installed.push(agent);
    } else {
      results.failed.push(agent);
    }
  }

  return results;
}

/**
 * Install AGENTS-TEMPLATE.md to the agents directory
 * @param {string} repoDir - Repository directory
 * @returns {Promise<boolean>} True if installed successfully
 */
export async function installAgentsTemplate(repoDir) {
  const agentsDir = getAgentsDir();
  const templateSrc = join(repoDir, AGENTS_TEMPLATE_FILE);
  const templateDest = join(agentsDir, AGENTS_TEMPLATE_FILE);

  // Create agents directory if needed
  if (!existsSync(agentsDir)) {
    mkdirSync(agentsDir, { recursive: true });
  }

  // Check if source exists
  if (!existsSync(templateSrc)) {
    return false;
  }

  // Copy template file
  copyFileSync(templateSrc, templateDest);
  return true;
}

/**
 * Install the ti-docs-index helper script
 * @param {string} repoDir - Repository directory
 * @param {string} binDir - Bin directory path
 * @returns {Promise<boolean>} True if installed successfully
 */
export async function installTiDocsIndexScript(repoDir, binDir) {
  const scriptSrc = join(repoDir, 'scripts', 'ti-docs-index');
  const scriptDest = join(binDir, 'ti-docs-index');

  // Check if source exists
  if (!existsSync(scriptSrc)) {
    return false;
  }

  // Create bin directory if needed
  if (!existsSync(binDir)) {
    try {
      mkdirSync(binDir, { recursive: true });
    } catch {
      // If we can't create the bin dir, skip script installation
      return false;
    }
  }

  // Try to copy script file
  try {
    copyFileSync(scriptSrc, scriptDest);
  } catch (error) {
    // If we can't write to binDir (permission denied), skip script installation
    if (error.code === 'EACCES' || error.code === 'EPERM') {
      return false;
    }
    throw error;
  }

  // Make executable (chmod +x)
  try {
    const { chmod } = await import('fs/promises');
    await chmod(scriptDest, 0o755);
  } catch {
    // Ignore permission errors
  }

  return true;
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
  installAgentsTemplate,
  installTiDocsIndexScript,
  getLocalRepoDir,
};
