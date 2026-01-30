/**
 * Tests for lib/config.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import config from '../lib/config.js';

describe('config', () => {
  it('should export PACKAGE_VERSION', () => {
    assert.ok(config.PACKAGE_VERSION);
    assert.strictEqual(typeof config.PACKAGE_VERSION, 'string');
  });

  it('should export TITANIUM_KNOWLEDGE_VERSION', () => {
    assert.strictEqual(config.TITANIUM_KNOWLEDGE_VERSION, 'v1.0.0');
  });

  it('should export BLOCK_START and BLOCK_END', () => {
    assert.ok(config.BLOCK_START.includes('TITANIUM-KNOWLEDGE'));
    assert.strictEqual(config.BLOCK_END, '<!-- END-TITANIUM-KNOWLEDGE -->');
  });

  it('should export SKILLS array', () => {
    assert.ok(Array.isArray(config.SKILLS));
    assert.ok(config.SKILLS.length > 0);
    assert.ok(config.SKILLS.includes('alloy-expert'));
    assert.ok(config.SKILLS.includes('purgetss'));
  });

  it('should export AGENTS array', () => {
    assert.ok(Array.isArray(config.AGENTS));
    assert.ok(config.AGENTS.includes('ti-researcher'));
  });

  it('should export PLATFORMS array', () => {
    assert.ok(Array.isArray(config.PLATFORMS));
    assert.strictEqual(config.PLATFORMS.length, 3);
  });

  it('should export directory getter functions', () => {
    assert.strictEqual(typeof config.getAgentsDir, 'function');
    assert.strictEqual(typeof config.getAgentsSkillsDir, 'function');
    assert.strictEqual(typeof config.getClaudeAgentsDir, 'function');
    assert.strictEqual(typeof config.getClaudeSkillsDir, 'function');
  });

  it('getter functions should return strings', () => {
    assert.strictEqual(typeof config.getAgentsDir(), 'string');
    assert.strictEqual(typeof config.getAgentsSkillsDir(), 'string');
    assert.strictEqual(typeof config.getClaudeAgentsDir(), 'string');
    assert.strictEqual(typeof config.getClaudeSkillsDir(), 'string');
  });
});
