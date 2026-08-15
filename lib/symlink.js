/**
 * Cross-platform symlink utilities
 * Creates symlinks with fallback to copy on Windows
 */

import { mkdirSync, existsSync } from 'fs';
import { symlink, readlink } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { copy, remove } from 'fs-extra';
import { isWindows } from './platform.js';

/**
 * Create a symlink or copy as fallback
 * @param {string} target - Target path (what the symlink points to)
 * @param {string} path - Symlink path (where to create it)
 * @param {boolean} useRelative - Whether to use a relative path for the symlink
 * @returns {Promise<boolean>} True if successful
 */
export async function createSymlinkOrCopy(target, path, useRelative = false) {
  // Ensure parent directory exists
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Remove existing file/directory/symlink
  if (existsSync(path)) {
    await removePath(path);
  }

  // Determine final target path
  let finalTarget = target;
  if (useRelative) {
    finalTarget = relative(dirname(path), target);
  }

  // Try creating symlink first
  try {
    // Windows requires 'junction' or 'dir' for directory symlinks
    await symlink(finalTarget, path, 'dir');
    return true;
  } catch (error) {
    // On Windows or if symlink fails, copy the directory
    if (isWindows() || error.code === 'EPERM' || error.code === 'EXDEV') {
      try {
        await copy(target, path, { overwrite: true });
        return true;
      } catch (copyError) {
        console.error(`Failed to copy: ${copyError.message}`);
        return false;
      }
    }
    console.error(`Failed to create symlink: ${error.message}`);
    return false;
  }
}

/**
 * Remove a file, directory, or symlink
 * @param {string} path - Path to remove
 * @returns {Promise<void>}
 */
async function removePath(path) {
  try {
    await remove(path);
  } catch {
    // Ignore errors
  }
}

/**
 * Whether the marketplace plugin already provides this skill to Claude Code.
 *
 * Claude Code lists skills the plugin carries on its own, so an additional
 * symlink at ~/.claude/skills/<skill> produces a duplicate entry in the
 * autocomplete. This helper lets the symlink step skip Claude when the plugin
 * already covers it.
 *
 * Requires the plugin to be *enabled*, not merely cached — see `claude-plugin.js`
 * for why the distinction matters.
 * @param {string} skillName - Skill name (e.g. 'ti-expert')
 * @param {string} baseDir - Optional base directory (defaults to homedir via config)
 * @returns {Promise<boolean>} True if the plugin provides this skill
 */
export async function isClaudePluginSkillInstalled(skillName, baseDir) {
  const { pluginProvidesSkill } = await import('./claude-plugin.js');
  return pluginProvidesSkill(skillName, baseDir);
}

/**
 * Create symlinks for all skills to a platform directory.
 * For the Claude platform, skills already provided by the maccesar-titools
 * marketplace plugin are skipped to avoid duplicate entries; if a stale symlink
 * from a previous install exists, it is removed.
 * @param {string} platformSkillsDir - Platform skills directory
 * @param {Array} skills - List of skill names
 * @param {string} baseDir - Optional base directory for target resolution
 * @returns {Promise<Object>} Results object with linked / failed / skipped arrays
 */
export async function createSkillSymlinks(platformSkillsDir, skills, baseDir) {
  const { getAgentsSkillsDir, getClaudeSkillsDir } = await import('./config.js');
  const agentsSkillsDir = getAgentsSkillsDir(baseDir);
  const claudeSkillsDir = getClaudeSkillsDir(baseDir);
  const isClaudePlatform = platformSkillsDir === claudeSkillsDir;

  const results = {
    linked: [],
    failed: [],
    skipped: [],
  };

  // Ensure platform directory exists
  if (!existsSync(platformSkillsDir)) {
    mkdirSync(platformSkillsDir, { recursive: true });
  }

  // Use relative symlinks if we are in a local installation
  const useRelative = !!baseDir;

  for (const skill of skills) {
    // Skip Claude when the marketplace plugin already provides this skill;
    // clean up any stale symlink left from a previous CLI install.
    if (isClaudePlatform && await isClaudePluginSkillInstalled(skill, baseDir)) {
      const stalePath = join(platformSkillsDir, skill);
      if (existsSync(stalePath)) {
        await removePath(stalePath);
      }
      results.skipped.push(skill);
      continue;
    }

    const target = join(agentsSkillsDir, skill);
    const linkPath = join(platformSkillsDir, skill);

    if (await createSymlinkOrCopy(target, linkPath, useRelative)) {
      results.linked.push(skill);
    } else {
      results.failed.push(skill);
    }
  }

  return results;
}

/**
 * Check if a path is a symlink
 * @param {string} path - Path to check
 * @returns {Promise<boolean>} True if symlink
 */
export async function isSymlink(path) {
  try {
    const { lstat } = await import('fs/promises');
    const stats = await lstat(path);
    return stats.isSymbolicLink();
  } catch {
    return false;
  }
}

/**
 * Resolve symlink target
 * @param {string} path - Symlink path
 * @returns {Promise<string|null>} Target path or null
 */
export async function resolveSymlink(path) {
  try {
    return await readlink(path);
  } catch {
    return null;
  }
}

/**
 * Remove a symlink and recreate it (update)
 * @param {string} target - New target path
 * @param {string} path - Symlink path
 * @returns {Promise<boolean>} True if successful
 */
export async function updateSymlink(target, path) {
  await removePath(path);
  return createSymlinkOrCopy(target, path);
}

export default {
  createSymlinkOrCopy,
  isClaudePluginSkillInstalled,
  createSkillSymlinks,
  isSymlink,
  resolveSymlink,
  updateSymlink,
};
