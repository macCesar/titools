/**
 * Marketplace-plugin detection.
 *
 * TiTools ships through two channels — the npm CLI and the Claude Code
 * marketplace plugin — and a user may have both. When the plugin is enabled it
 * already serves the skills and slash commands, so a second copy installed by
 * the CLI shows up twice in the autocomplete.
 *
 * The two failure modes below are the ones this detection exists to prevent.
 * Both were found by hand in the sibling project (aiskills v1.16.0) before this
 * code was ported here, so they are covered from the start rather than after the
 * fact:
 *
 *   1. Uninstalling the plugin leaves its cache directory on disk. Reading that
 *      leftover as "the plugin provides this skill" makes the CLI skip every
 *      symlink, leaving Claude Code with no skills and no way to repair it by
 *      re-running install.
 *   2. Slash commands that never ask the question at all get installed alongside
 *      the plugin's own copy and appear twice.
 *
 * Each test builds a throwaway home directory so the real one is never touched.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  isClaudePluginEnabled,
  hasClaudePluginCache,
  pluginProvidesSkill,
  pluginProvidesCommand,
} from '../lib/claude-plugin.js';
import { createSkillSymlinks } from '../lib/symlink.js';
import { installCommands } from '../lib/installer.js';
import {
  CLAUDE_PLUGIN_KEY,
  CLAUDE_PLUGIN_MARKETPLACE,
  CLAUDE_PLUGIN_NAME,
  COMMANDS,
} from '../lib/config.js';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Build a fake home directory; returns its path. */
function makeHome() {
  return mkdtempSync(path.join(tmpdir(), 'titools-test-'));
}

/** Write ~/.claude/settings.json with the plugin enabled or disabled. */
function writeSettings(base, { enabled, file = 'settings.json' } = {}) {
  const dir = path.join(base, '.claude');
  mkdirSync(dir, { recursive: true });
  const body = enabled === undefined ? {} : { enabledPlugins: { [CLAUDE_PLUGIN_KEY]: enabled } };
  writeFileSync(path.join(dir, file), JSON.stringify(body, null, 2));
}

/** Populate the plugin cache as Claude Code leaves it. */
function writePluginCache(base, { skills = [], commands = [], version = '4.2.0' } = {}) {
  const root = path.join(
    base, '.claude', 'plugins', 'cache', CLAUDE_PLUGIN_MARKETPLACE, CLAUDE_PLUGIN_NAME, version
  );
  for (const skill of skills) {
    mkdirSync(path.join(root, 'skills', skill), { recursive: true });
  }
  if (commands.length > 0) {
    mkdirSync(path.join(root, 'commands'), { recursive: true });
    for (const command of commands) {
      writeFileSync(path.join(root, 'commands', `${command}.md`), '# stub\n');
    }
  }
}

/** Populate ~/.agents/skills so there is something to link to. */
function writeAgentsSkills(base, skills) {
  for (const skill of skills) {
    const dir = path.join(base, '.agents', 'skills', skill);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, 'SKILL.md'), '---\nname: x\ndescription: y\n---\n');
  }
}

describe('isClaudePluginEnabled', () => {
  test('false when no settings file exists', () => {
    const base = makeHome();
    assert.equal(isClaudePluginEnabled(base), false);
    rmSync(base, { recursive: true, force: true });
  });

  test('false when settings exist but the plugin is not listed', () => {
    const base = makeHome();
    writeSettings(base, {});
    assert.equal(isClaudePluginEnabled(base), false);
    rmSync(base, { recursive: true, force: true });
  });

  test('false when the plugin is listed as disabled', () => {
    const base = makeHome();
    writeSettings(base, { enabled: false });
    assert.equal(isClaudePluginEnabled(base), false);
    rmSync(base, { recursive: true, force: true });
  });

  test('true when enabled in settings.json', () => {
    const base = makeHome();
    writeSettings(base, { enabled: true });
    assert.equal(isClaudePluginEnabled(base), true);
    rmSync(base, { recursive: true, force: true });
  });

  test('true when enabled in settings.local.json', () => {
    const base = makeHome();
    writeSettings(base, { enabled: true, file: 'settings.local.json' });
    assert.equal(isClaudePluginEnabled(base), true);
    rmSync(base, { recursive: true, force: true });
  });

  test('false when settings.json is malformed rather than throwing', () => {
    const base = makeHome();
    mkdirSync(path.join(base, '.claude'), { recursive: true });
    writeFileSync(path.join(base, '.claude', 'settings.json'), '{ not valid json');
    assert.equal(isClaudePluginEnabled(base), false);
    rmSync(base, { recursive: true, force: true });
  });
});

describe('a leftover cache is not an installed plugin', () => {
  test('pluginProvidesSkill is false when the cache remains but the plugin was uninstalled', () => {
    const base = makeHome();
    writePluginCache(base, { skills: ['ti-expert'] });
    writeSettings(base, {}); // uninstalled: key gone from enabledPlugins
    assert.equal(
      pluginProvidesSkill('ti-expert', base),
      false,
      'a cache directory left behind by an uninstall must not count as the plugin providing the skill',
    );
    rmSync(base, { recursive: true, force: true });
  });

  test('hasClaudePluginCache tells "never installed" apart from "leftovers on disk"', () => {
    const clean = makeHome();
    assert.equal(hasClaudePluginCache(clean), false, 'no cache: the plugin was never installed');
    rmSync(clean, { recursive: true, force: true });

    const leftover = makeHome();
    writePluginCache(leftover, { skills: ['ti-expert'] });
    writeSettings(leftover, {});
    assert.equal(hasClaudePluginCache(leftover), true, 'cache present though the plugin is gone');
    assert.equal(
      isClaudePluginEnabled(leftover),
      false,
      'the pair (cache yes, enabled no) is what diagnostics report as an orphaned cache',
    );
    rmSync(leftover, { recursive: true, force: true });
  });

  test('pluginProvidesSkill is true only with cache AND enabled plugin', () => {
    const base = makeHome();
    writePluginCache(base, { skills: ['ti-expert'] });
    writeSettings(base, { enabled: true });
    assert.equal(pluginProvidesSkill('ti-expert', base), true);
    assert.equal(pluginProvidesSkill('not-shipped', base), false, 'skill absent from the cache');
    rmSync(base, { recursive: true, force: true });
  });
});

describe('createSkillSymlinks', () => {
  test('links the skill when the cache is stale but the plugin is gone', async () => {
    const base = makeHome();
    writeAgentsSkills(base, ['ti-expert']);
    writePluginCache(base, { skills: ['ti-expert'] });
    writeSettings(base, {}); // the failure state: cache left by an uninstall

    const claudeSkills = path.join(base, '.claude', 'skills');
    const result = await createSkillSymlinks(claudeSkills, ['ti-expert'], base);

    assert.deepEqual(result.linked, ['ti-expert'], 'the skill must be linked, not skipped');
    assert.ok(existsSync(path.join(claudeSkills, 'ti-expert')));
    rmSync(base, { recursive: true, force: true });
  });

  test('skips and removes the stale symlink when the plugin is enabled', async () => {
    const base = makeHome();
    writeAgentsSkills(base, ['ti-expert']);
    writePluginCache(base, { skills: ['ti-expert'] });
    writeSettings(base, { enabled: true });

    const claudeSkills = path.join(base, '.claude', 'skills');
    mkdirSync(claudeSkills, { recursive: true });
    symlinkSync(
      path.join(base, '.agents', 'skills', 'ti-expert'),
      path.join(claudeSkills, 'ti-expert'),
      'dir'
    );

    const result = await createSkillSymlinks(claudeSkills, ['ti-expert'], base);

    assert.deepEqual(result.skipped, ['ti-expert']);
    assert.equal(
      existsSync(path.join(claudeSkills, 'ti-expert')),
      false,
      'the duplicate symlink must be cleaned up',
    );
    rmSync(base, { recursive: true, force: true });
  });

  test('skips a skill while an older plugin cache still provides a same-name command', async () => {
    const base = makeHome();
    writeAgentsSkills(base, ['ti-expert']);
    writePluginCache(base, { commands: ['ti-expert'] });
    writeSettings(base, { enabled: true });

    const claudeSkills = path.join(base, '.claude', 'skills');
    const result = await createSkillSymlinks(claudeSkills, ['ti-expert'], base);

    assert.deepEqual(result.skipped, ['ti-expert']);
    assert.equal(
      existsSync(path.join(claudeSkills, 'ti-expert')),
      false,
      'a same-name plugin command must suppress the duplicate skill mirror during migration',
    );
    rmSync(base, { recursive: true, force: true });
  });

  test('links when there is no plugin cache at all', async () => {
    const base = makeHome();
    writeAgentsSkills(base, ['ti-expert']);
    const claudeSkills = path.join(base, '.claude', 'skills');
    const result = await createSkillSymlinks(claudeSkills, ['ti-expert'], base);
    assert.deepEqual(result.linked, ['ti-expert']);
    rmSync(base, { recursive: true, force: true });
  });
});

describe('installCommands', () => {
  test('installs every command when the plugin is not enabled', async () => {
    const base = makeHome();
    const result = await installCommands(REPO_ROOT, base);
    assert.deepEqual(result.installed, COMMANDS, 'all commands land in ~/.claude/commands/');
    assert.deepEqual(result.failed, [], 'every command in COMMANDS must have a file in commands/');
    for (const cmd of COMMANDS) {
      assert.ok(existsSync(path.join(base, '.claude', 'commands', `${cmd}.md`)), `${cmd}.md installed`);
    }
    rmSync(base, { recursive: true, force: true });
  });

  test('skips the command and removes the duplicate when the plugin provides it', async () => {
    const base = makeHome();
    writePluginCache(base, { commands: ['ti-check'] });
    writeSettings(base, { enabled: true });

    // A copy left from an install that ran before the plugin existed.
    const commandsDir = path.join(base, '.claude', 'commands');
    mkdirSync(commandsDir, { recursive: true });
    writeFileSync(path.join(commandsDir, 'ti-check.md'), '# stale copy\n');

    const result = await installCommands(REPO_ROOT, base);

    assert.deepEqual(result.skipped, ['ti-check']);
    assert.ok(!result.installed.includes('ti-check'));
    assert.equal(
      existsSync(path.join(commandsDir, 'ti-check.md')),
      false,
      'the duplicate slash command must be cleaned up',
    );
    // The commands the plugin does *not* carry still get installed.
    assert.ok(result.installed.includes('ti-audit'));
    rmSync(base, { recursive: true, force: true });
  });

  test('installs the command when the cache is stale but the plugin is gone', async () => {
    const base = makeHome();
    writePluginCache(base, { commands: ['ti-check'] });
    writeSettings(base, {});

    const result = await installCommands(REPO_ROOT, base);

    assert.ok(result.installed.includes('ti-check'));
    assert.ok(existsSync(path.join(base, '.claude', 'commands', 'ti-check.md')));
    rmSync(base, { recursive: true, force: true });
  });

  test('pluginProvidesCommand needs both the cache entry and the enabled plugin', () => {
    const base = makeHome();
    writePluginCache(base, { commands: ['ti-check'] });
    writeSettings(base, { enabled: true });
    assert.equal(pluginProvidesCommand('ti-check', base), true);
    assert.equal(pluginProvidesCommand('nonexistent', base), false);
    rmSync(base, { recursive: true, force: true });
  });
});
