import test from 'node:test';
import assert from 'node:assert/strict';

import config, {
  CLAUDE_PLUGIN_KEY,
  CLAUDE_PLUGIN_MARKETPLACE,
  CLAUDE_PLUGIN_NAME,
  getAgentsDir,
  getClaudePluginSkillsPath,
  getClaudeSettingsPaths,
} from '../lib/config.js';
import downloader, { fetchLatestNpmVersion } from '../lib/downloader.js';

test('default exports retain the shared sibling-project API', () => {
  assert.equal(config.getAgentsDir, getAgentsDir);
  assert.equal(config.CLAUDE_PLUGIN_MARKETPLACE, CLAUDE_PLUGIN_MARKETPLACE);
  assert.equal(config.CLAUDE_PLUGIN_NAME, CLAUDE_PLUGIN_NAME);
  assert.equal(config.CLAUDE_PLUGIN_KEY, CLAUDE_PLUGIN_KEY);
  assert.equal(config.getClaudePluginSkillsPath, getClaudePluginSkillsPath);
  assert.equal(config.getClaudeSettingsPaths, getClaudeSettingsPaths);
  assert.equal(downloader.fetchLatestNpmVersion, fetchLatestNpmVersion);
});
