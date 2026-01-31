/**
 * Configuration constants for Titanium SDK Skills
 * Single source of truth for version management
 */

import path from 'path';
import os from 'os';
import { readFileSync } from 'fs';

// Read package.json version dynamically
let packageVersion = '1.7.0';
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
  'alloy-expert',
  'purgetss',
  'ti-ui',
  'ti-howtos',
  'ti-guides',
  'alloy-guides',
  'alloy-howtos',
];

// Agents to install
export const AGENTS = [
  'ti-researcher',
];

// Directory paths
export const getAgentsDir = () => path.join(os.homedir(), '.agents');
export const getAgentsSkillsDir = () => path.join(getAgentsDir(), 'skills');
export const getClaudeAgentsDir = () => path.join(os.homedir(), '.claude', 'agents');
export const getClaudeSkillsDir = () => path.join(os.homedir(), '.claude', 'skills');
export const getGeminiSkillsDir = () => path.join(os.homedir(), '.gemini', 'skills');
export const getCodexSkillsDir = () => path.join(os.homedir(), '.codex', 'skills');

// AI platform detection
export const PLATFORMS = [
  {
    name: 'claude',
    displayName: 'Claude Code',
    skillsDir: getClaudeSkillsDir(),
    configDir: path.join(os.homedir(), '.claude'),
  },
  {
    name: 'gemini',
    displayName: 'Gemini CLI',
    skillsDir: getGeminiSkillsDir(),
    configDir: path.join(os.homedir(), '.gemini'),
  },
  {
    name: 'codex',
    displayName: 'Codex CLI',
    skillsDir: getCodexSkillsDir(),
    configDir: path.join(os.homedir(), '.codex'),
  },
];

// Files to install
export const AGENTS_TEMPLATE_FILE = 'AGENTS-TEMPLATE.md';
export const TI_DOCS_INDEX_SCRIPT = 'ti-docs-index';

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
  AGENTS,
  getAgentsDir,
  getAgentsSkillsDir,
  getClaudeAgentsDir,
  getClaudeSkillsDir,
  getGeminiSkillsDir,
  getCodexSkillsDir,
  PLATFORMS,
  AGENTS_TEMPLATE_FILE,
  TI_DOCS_INDEX_SCRIPT,
  AI_FILE_PRIORITIES,
  TITANIUM_PROJECT_FILE,
  GITHUB_API_HEADERS,
};
