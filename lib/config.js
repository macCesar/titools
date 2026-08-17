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
  'ti-game',
  'ti-api',
  'ti-guides',
  'ti-howtos',
  'alloy-guides',
  'alloy-howtos',
];
// Legacy skills to remove during updates/uninstall
export const LEGACY_SKILLS = [
  'alloy-expert',
  'ti-branding',
];

// Agents to install
export const AGENTS = [
  'ti-pro',
];
// Legacy agents to remove during updates/uninstall
export const LEGACY_AGENTS = [
  'ti-researcher',
];

// Slash commands to install (Claude Code only — copied to ~/.claude/commands/)
export const COMMANDS = [
  'ti-check',
  'ti-new-screen',
  'ti-audit',
];
// Legacy commands to remove during updates/uninstall
export const LEGACY_COMMANDS = [];

// Directory paths
export const getAgentsDir = (baseDir = os.homedir()) => path.join(baseDir, '.agents');
export const getAgentsSkillsDir = (baseDir = os.homedir()) => path.join(getAgentsDir(baseDir), 'skills');
export const getClaudeAgentsDir = (baseDir = os.homedir()) => path.join(baseDir, '.claude', 'agents');
export const getClaudeSkillsDir = (baseDir = os.homedir()) => path.join(baseDir, '.claude', 'skills');
export const getClaudeCommandsDir = (baseDir = os.homedir()) => path.join(baseDir, '.claude', 'commands');
export const getGeminiSkillsDir = (baseDir = os.homedir()) => path.join(baseDir, '.gemini', 'skills');
export const getCodexSkillsDir = (baseDir = os.homedir()) => path.join(baseDir, '.codex', 'skills');
export const getConfigDir = () => path.join(os.homedir(), '.titools');

// Name of the Claude marketplace and plugin where this CLI publishes itself.
// Used to detect when a skill or command already reaches Claude Code through the
// marketplace plugin, so the CLI does not install a second copy of it.
export const CLAUDE_PLUGIN_MARKETPLACE = 'maccesar-titools';
export const CLAUDE_PLUGIN_NAME = 'titools';
export const getClaudePluginSkillsPath = (baseDir = os.homedir()) =>
  path.join(baseDir, '.claude', 'plugins', 'cache', CLAUDE_PLUGIN_MARKETPLACE, CLAUDE_PLUGIN_NAME);

// The key Claude Code writes under "enabledPlugins" when the plugin is installed.
export const CLAUDE_PLUGIN_KEY = `${CLAUDE_PLUGIN_NAME}@${CLAUDE_PLUGIN_MARKETPLACE}`;

// Where Claude Code records which plugins are enabled. Both files are consulted
// because the local variant overrides the shared one, and either may carry the
// entry depending on how the plugin was installed.
export const getClaudeSettingsPaths = (baseDir = os.homedir()) => [
  path.join(baseDir, '.claude', 'settings.json'),
  path.join(baseDir, '.claude', 'settings.local.json'),
];

// AI platform detection
//
// Only platforms that need TiTools-managed symlinks appear here.
// Gemini CLI and Codex CLI auto-discover skills from the canonical
// ~/.agents/skills/ per the agentskills.io standard, so creating
// platform-specific symlinks at ~/.gemini/skills/ or ~/.codex/skills/
// would be redundant — and in Gemini's case actively harmful, since it
// reads both locations and reports "Skill conflict detected" warnings
// when the same skill exists in both.
export const getPlatforms = (baseDir = os.homedir()) => [
  {
    name: 'claude',
    displayName: 'Claude Code',
    skillsDir: getClaudeSkillsDir(baseDir),
    configDir: path.join(baseDir, '.claude'),
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
  COMMANDS,
  LEGACY_COMMANDS,
  getAgentsDir,
  getAgentsSkillsDir,
  getClaudeAgentsDir,
  getClaudeSkillsDir,
  getClaudeCommandsDir,
  getGeminiSkillsDir,
  getCodexSkillsDir,
  getConfigDir,
  getPlatforms,
  CLAUDE_PLUGIN_MARKETPLACE,
  CLAUDE_PLUGIN_NAME,
  CLAUDE_PLUGIN_KEY,
  getClaudePluginSkillsPath,
  getClaudeSettingsPaths,
  AI_FILE_PRIORITIES,
  TITANIUM_PROJECT_FILE,
  GITHUB_API_HEADERS,
};
