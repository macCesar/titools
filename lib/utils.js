/**
 * Utility functions
 * Block management, color output, and helper functions
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { BLOCK_START, BLOCK_END, TITANIUM_KNOWLEDGE_VERSION } from './config.js';

/**
 * Check if Titanium knowledge block exists in a file
 * @param {string} filePath - Path to the file
 * @returns {boolean} True if block exists
 */
export function blockExists(filePath) {
  if (!existsSync(filePath)) {
    return false;
  }

  const content = readFileSync(filePath, 'utf8');
  return content.includes(BLOCK_START);
}

/**
 * Remove old Titanium knowledge block from a file
 * @param {string} filePath - Path to the file
 * @returns {boolean} True if block was removed
 */
export function removeOldBlock(filePath) {
  if (!existsSync(filePath)) {
    return false;
  }

  const content = readFileSync(filePath, 'utf8');
  const regex = new RegExp(
    `[\\s\\S]*?${BLOCK_START}[\\s\\S]*?${BLOCK_END}[\\s\\S]*?\\n*`,
    'g'
  );

  const newContent = content.replace(regex, '\n\n');

  writeFileSync(filePath, newContent, 'utf8');
  return true;
}

/**
 * Create the Titanium knowledge block content
 * @param {string} templatePath - Path to AGENTS-TEMPLATE.md
 * @returns {string} The knowledge block content
 */
export function createKnowledgeBlock(templatePath) {
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const template = readFileSync(templatePath, 'utf8');

  // Extract the compressed index section
  const compressedIndexMatch = template.match(
    /## Compressed Documentation Index[\s\S]*?^-/m
  );

  if (!compressedIndexMatch) {
    throw new Error('Could not find compressed documentation index in template');
  }

  const compressedIndex = compressedIndexMatch[0].replace(/^-$/, ''); // Remove trailing ---

  return `

<!-- TITANIUM-KNOWLEDGE-${TITANIUM_KNOWLEDGE_VERSION} -->
<!--
Titanium SDK Knowledge Index
Added by titools -->
Based on Vercel's research: https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals

IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning when working with Titanium SDK.
Always consult the documentation files below rather than relying on training data, which may be outdated.

This knowledge index is based on the latest Titanium SDK documentation.
-->

${compressedIndex}

<!-- END-TITANIUM-KNOWLEDGE -->
`;
}

/**
 * Add or update Titanium knowledge block in a file
 * @param {string} filePath - Path to the file
 * @param {string} templatePath - Path to AGENTS-TEMPLATE.md
 * @returns {boolean} True if file was updated
 */
export function addOrUpdateBlock(filePath, templatePath) {
  let content = '';

  if (existsSync(filePath)) {
    content = readFileSync(filePath, 'utf8');
  }

  const block = createKnowledgeBlock(templatePath);

  // Remove existing block if present (only the block, not the content before/after)
  if (content.includes(BLOCK_START)) {
    // Escape special regex characters in BLOCK_START and BLOCK_END
    const escapedStart = BLOCK_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedEnd = BLOCK_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Match from START to END, including newlines
    const regex = new RegExp(
      `${escapedStart}[\\s\\S]*?${escapedEnd}\\n*`,
      'g'
    );
    content = content.replace(regex, '');
  }

  // Add new block at the end (preserve existing content)
  content = content.trimEnd() + '\n\n' + block + '\n';

  writeFileSync(filePath, content, 'utf8');
  return true;
}

/**
 * Detect Titanium SDK version from tiapp.xml
 * @param {string} projectDir - Path to project directory
 * @returns {string} SDK version or 'unknown'
 */
export function detectTitaniumVersion(projectDir) {
  const tiappPath = join(projectDir, 'tiapp.xml');

  if (!existsSync(tiappPath)) {
    return 'unknown';
  }

  const content = readFileSync(tiappPath, 'utf8');
  const match = content.match(/<sdk-version>([^<]+)<\/sdk-version>/);

  return match ? match[1].trim() : 'unknown';
}

/**
 * Check if directory is a Titanium project
 * @param {string} dir - Path to check
 * @returns {boolean}
 */
export function isTitaniumProject(dir) {
  return existsSync(join(dir, 'tiapp.xml'));
}

/**
 * Get AI configuration files that exist in a directory
 * @param {string} dir - Path to check
 * @returns {Object} Object with boolean flags for each file type
 */
export function getAIFiles(dir) {
  return {
    claude: existsSync(join(dir, 'CLAUDE.md')),
    gemini: existsSync(join(dir, 'GEMINI.md')),
    agents: existsSync(join(dir, 'AGENTS.md')),
  };
}

/**
 * Determine which AI files to update based on priority
 * @param {Object} aiFiles - Object with boolean flags for each file type
 * @returns {Array} Array of file names to update (priority order)
 */
export function determineFilesToUpdate(aiFiles) {
  const files = [];

  // Priority: CLAUDE.md > GEMINI.md > AGENTS.md
  if (aiFiles.claude) {
    files.push('CLAUDE.md');
    if (aiFiles.gemini) files.push('GEMINI.md');
    if (aiFiles.agents) files.push('AGENTS.md');
  } else if (aiFiles.gemini) {
    files.push('GEMINI.md');
    if (aiFiles.agents) files.push('AGENTS.md');
  } else if (aiFiles.agents) {
    files.push('AGENTS.md');
  }

  return files;
}

/**
 * Format a list of items for display
 * @param {Array} items - Array of strings
 * @returns {string} Comma-separated list
 */
export function formatList(items) {
  return items.join(', ');
}

/**
 * Parse SDK version string to compare
 * @param {string} version - Version string (e.g., "13.1.0.GA")
 * @returns {Array} Array of version parts
 */
export function parseVersion(version) {
  return version
    .replace('.GA', '')
    .replace('.RC', '-')
    .split(/[.-]/)
    .map((v) => parseInt(v, 10) || 0);
}

/**
 * Compare two version strings
 * @param {string} v1 - First version
 * @param {string} v2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export function compareVersions(v1, v2) {
  const parts1 = parseVersion(v1);
  const parts2 = parseVersion(v2);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;

    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }

  return 0;
}

export default {
  blockExists,
  removeOldBlock,
  createKnowledgeBlock,
  addOrUpdateBlock,
  detectTitaniumVersion,
  isTitaniumProject,
  getAIFiles,
  determineFilesToUpdate,
  formatList,
  parseVersion,
  compareVersions,
};
