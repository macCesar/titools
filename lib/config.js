/**
 * Configuration constants for Titanium SDK Skills
 * Single source of truth for version management
 */

import path from 'path';
import os from 'os';
import { readFileSync } from 'fs';

// Read package.json version dynamically
let packageVersion = '2.1.0';
try {
  const packagePath = new URL('../package.json', import.meta.url);
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
  packageVersion = pkg.version;
} catch {
  // Use default version if package.json not found
}

// Version management
export const PACKAGE_VERSION = packageVersion;
export const TITANIUM_KNOWLEDGE_VERSION = `v${PACKAGE_VERSION}`;
export const BLOCK_START = '<!-- TITANIUM-KNOWLEDGE-START -->';
export const BLOCK_END = '<!-- TITANIUM-KNOWLEDGE-END -->';

// Repository configuration
export const REPO_URL = 'https://github.com/macCesar/titools';
export const REPO_RAW_URL = 'https://raw.githubusercontent.com/macCesar/titools/main';
export const REPO_API_URL = 'https://api.github.com/repos/macCesar/titools';

// Skills to install
export const SKILLS = [
  'ti-expert',
  'purgetss',
  'ti-ui',
  'ti-howtos',
  'ti-guides',
  'alloy-guides',
  'alloy-howtos',
];
// Legacy skills to remove during updates/uninstall
export const LEGACY_SKILLS = [
  'alloy-expert',
];

// Agents to install
export const AGENTS = [
  'ti-pro',
];
// Legacy agents to remove during updates/uninstall
export const LEGACY_AGENTS = [
  'ti-researcher',
];

// Directory paths
export const getAgentsDir = (baseDir = os.homedir()) => path.join(baseDir, '.agents');
export const getAgentsSkillsDir = (baseDir = os.homedir()) => path.join(getAgentsDir(baseDir), 'skills');
export const getClaudeAgentsDir = (baseDir = os.homedir()) => path.join(baseDir, '.claude', 'agents');
export const getClaudeSkillsDir = (baseDir = os.homedir()) => path.join(baseDir, '.claude', 'skills');
export const getGeminiSkillsDir = (baseDir = os.homedir()) => path.join(baseDir, '.gemini', 'skills');
export const getCodexSkillsDir = (baseDir = os.homedir()) => path.join(baseDir, '.codex', 'skills');

// AI platform detection
export const getPlatforms = (baseDir = os.homedir()) => [
  {
    name: 'claude',
    displayName: 'Claude Code',
    skillsDir: getClaudeSkillsDir(baseDir),
    configDir: path.join(baseDir, '.claude'),
  },
  {
    name: 'gemini',
    displayName: 'Gemini CLI',
    skillsDir: getGeminiSkillsDir(baseDir),
    configDir: path.join(baseDir, '.gemini'),
  },
  {
    name: 'codex',
    displayName: 'Codex CLI',
    skillsDir: getCodexSkillsDir(baseDir),
    configDir: path.join(baseDir, '.codex'),
  },
];

// Files to install

// AI file priorities (higher = more priority)
export const AI_FILE_PRIORITIES = {
  'CLAUDE.md': 3,
  'GEMINI.md': 2,
  'AGENTS.md': 1,
};

// Titanium project detection
export const TITANIUM_PROJECT_FILE = 'tiapp.xml';

// API configuration
export const GITHUB_API_HEADERS = {
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': '@maccesar/titanium-skills',
};

export default {
  PACKAGE_VERSION,
  TITANIUM_KNOWLEDGE_VERSION,
  BLOCK_START,
  BLOCK_END,
  REPO_URL,
  REPO_RAW_URL,
  REPO_API_URL,
  SKILLS,
  LEGACY_SKILLS,
  AGENTS,
  LEGACY_AGENTS,
  getAgentsDir,
  getAgentsSkillsDir,
  getClaudeAgentsDir,
  getClaudeSkillsDir,
  getGeminiSkillsDir,
  getCodexSkillsDir,
  getPlatforms,
  AI_FILE_PRIORITIES,
  TITANIUM_PROJECT_FILE,
  GITHUB_API_HEADERS,
};
