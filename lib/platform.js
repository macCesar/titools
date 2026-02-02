/**
 * Platform detection utilities
 * Detects AI coding assistants and operating system
 */

import { existsSync } from 'fs';
import { getPlatforms } from './config.js';

/**
 * Detect installed AI coding assistant platforms
 * @param {string} baseDir - Optional base directory to check
 * @returns {Array} Detected platforms
 */
export function detectPlatforms(baseDir) {
  const detected = [];
  const platforms = getPlatforms(baseDir);

  for (const platform of platforms) {
    if (existsSync(platform.configDir)) {
      detected.push(platform);
    }
  }

  return detected;
}

/**
 * Get platform by name
 * @param {string} name - Platform name (claude, gemini, codex)
 * @param {string} baseDir - Optional base directory
 * @returns {Object|null} Platform object or null
 */
export function getPlatformByName(name, baseDir) {
  const platforms = getPlatforms(baseDir);
  return platforms.find((p) => p.name === name) || null;
}

/**
 * Detect operating system
 * @returns {string} OS type: 'macos', 'linux', 'windows'
 */
export function detectOS() {
  const platform = process.platform;

  if (platform === 'darwin') {
    return 'macos';
  }
  if (platform === 'win32') {
    return 'windows';
  }
  return 'linux';
}

/**
 * Check if running on Windows
 * @returns {boolean}
 */
export function isWindows() {
  return process.platform === 'win32';
}

/**
 * Check if running on macOS
 * @returns {boolean}
 */
export function isMacOS() {
  return process.platform === 'darwin';
}

/**
 * Check if running on Linux
 * @returns {boolean}
 */
export function isLinux() {
  return process.platform === 'linux';
}

/**
 * Get bin directory path for the current platform
 * @returns {string} Path to bin directory
 */
export function getBinDir() {
  if (isWindows()) {
    return `${process.env.HOME || process.env.USERPROFILE}\\bin`;
  }
  return '/usr/local/bin';
}

/**
 * Check if we have sudo/admin permissions
 * @returns {boolean}
 */
export function hasSudo() {
  if (isWindows()) {
    // Windows: check if running as administrator
    return process.env.USERDOMAIN === process.env.COMPUTERNAME;
  }
  // Unix-like: check if we can write to /usr/local/bin
  const binDir = getBinDir();
  return existsSync(binDir) && process.getuid && process.getuid() === 0;
}

export default {
  detectPlatforms,
  getPlatformByName,
  detectOS,
  isWindows,
  isMacOS,
  isLinux,
  getBinDir,
  hasSudo,
};
