/**
 * GitHub download utilities
 * Fetches releases and archives from GitHub
 */

import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { pipeline } from 'stream/promises';
import { unlink } from 'fs/promises';
import { extract } from 'tar';
import { REPO_API_URL, REPO_RAW_URL, GITHUB_API_HEADERS } from './config.js';

/**
 * Fetch latest release info from GitHub API
 * @returns {Promise<Object>} Release information
 */
export async function fetchLatestRelease() {
  const response = await fetch(
    `${REPO_API_URL}/releases/latest`,
    {
      headers: GITHUB_API_HEADERS,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch release info: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch latest version from GitHub
 * @returns {Promise<string>} Latest version tag
 */
export async function fetchLatestVersion() {
  const release = await fetchLatestRelease();
  return release.tag_name;
}

/**
 * Download a file from URL to local path
 * @param {string} url - URL to download
 * @param {string} destPath - Destination path
 * @returns {Promise<void>}
 */
export async function downloadFile(url, destPath) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  // Ensure directory exists
  const dir = dirname(destPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Download with progress indication
  await pipeline(response.body, createWriteStream(destPath));
}

/**
 * Download and extract GitHub repository archive
 * @param {string} destDir - Destination directory
 * @param {string} ref - Git ref (branch, tag, commit)
 * @returns {Promise<string>} Path to extracted directory
 */
export async function downloadRepoArchive(destDir, ref = 'main') {
  const archiveUrl = `${REPO_API_URL}/tarball/${ref}`;
  const tempFile = join(tmpdir(), `titanium-skills-${Date.now()}.tar.gz`);

  try {
    // Download archive
    await downloadFile(archiveUrl, tempFile);

    // Extract archive
    await extract({
      file: tempFile,
      cwd: destDir,
      strip: 1, // Remove top-level directory
    });

    return destDir;
  } finally {
    // Clean up temp file
    if (existsSync(tempFile)) {
      await unlink(tempFile);
    }
  }
}

/**
 * Download a single file from GitHub raw content
 * @param {string} filePath - Path in repository (e.g., 'AGENTS-VERCEL-RESEARCH.md')
 * @param {string} destPath - Local destination path
 * @param {string} ref - Git ref (branch, tag, commit)
 * @returns {Promise<void>}
 */
export async function downloadRawFile(filePath, destPath, ref = 'main') {
  const url = `${REPO_RAW_URL}/${ref}/${filePath}`;

  // Ensure directory exists
  const dir = dirname(destPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  await downloadFile(url, destPath);
}

/**
 * Check if an update is available
 * @param {string} currentVersion - Current version
 * @returns {Promise<boolean>} True if update available
 */
export async function checkForUpdate(currentVersion) {
  try {
    const latestVersion = await fetchLatestVersion();
    // Remove 'v' prefix if present
    const latest = latestVersion.replace(/^v/, '');
    const current = currentVersion.replace(/^v/, '');

    // Simple version comparison
    const latestParts = latest.split('.').map((v) => parseInt(v, 10));
    const currentParts = current.split('.').map((v) => parseInt(v, 10));

    for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
      const l = latestParts[i] || 0;
      const c = currentParts[i] || 0;

      if (l > c) return true;
      if (l < c) return false;
    }

    return false;
  } catch {
    // If check fails, assume no update
    return false;
  }
}

export default {
  fetchLatestRelease,
  fetchLatestVersion,
  downloadFile,
  downloadRepoArchive,
  downloadRawFile,
  checkForUpdate,
};
