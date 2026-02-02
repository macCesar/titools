/**
 * Cross-platform symlink utilities
 * Creates symlinks with fallback to copy on Windows
 */

import { mkdirSync, existsSync } from 'fs';
import { symlink, readlink, unlink, lstat } from 'fs/promises';
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
 * Create symlinks for all skills to a platform directory
 * @param {string} platformSkillsDir - Platform skills directory
 * @param {Array} skills - List of skill names
 * @param {string} baseDir - Optional base directory for target resolution
 * @returns {Promise<Object>} Results object with success/failure counts
 */
export async function createSkillSymlinks(platformSkillsDir, skills, baseDir) {
  const { getAgentsSkillsDir } = await import('./config.js');
  const agentsSkillsDir = getAgentsSkillsDir(baseDir);

  const results = {
    linked: [],
    failed: [],
  };

  // Ensure platform directory exists
  if (!existsSync(platformSkillsDir)) {
    mkdirSync(platformSkillsDir, { recursive: true });
  }

  // Use relative symlinks if we are in a local installation
  const useRelative = !!baseDir;

  for (const skill of skills) {
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
  createSkillSymlinks,
  isSymlink,
  resolveSymlink,
  updateSymlink,
};
