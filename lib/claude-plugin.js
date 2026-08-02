/**
 * Detection of the maccesar-titools Claude Code marketplace plugin.
 *
 * When the plugin is installed, Claude Code already lists our skills and slash
 * commands from its plugin cache, so the CLI must not also install its own copy
 * into ~/.claude/ — that produces duplicate entries in the autocomplete.
 *
 * The subtlety, and the reason this lives in its own module: **the cache on disk
 * does not mean the plugin is installed.** Uninstalling a plugin removes it from
 * `enabledPlugins` in settings.json but leaves the cache directory behind.
 * Treating that leftover directory as proof of installation makes the CLI skip
 * work it should do, which leaves Claude Code with no skills at all and no way
 * for the user to repair it by re-running install. So the question we answer here
 * is "is the plugin enabled AND does it carry this file", never just the latter.
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import {
  CLAUDE_PLUGIN_KEY,
  getClaudePluginSkillsPath,
  getClaudeSettingsPaths,
} from './config.js';

/**
 * Whether Claude Code currently has the titools plugin enabled.
 * @param {string} baseDir - Optional base directory (defaults to homedir via config)
 * @returns {boolean} True only when a settings file explicitly enables the plugin
 */
export function isClaudePluginEnabled(baseDir) {
  for (const settingsPath of getClaudeSettingsPaths(baseDir)) {
    try {
      const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
      if (settings?.enabledPlugins?.[CLAUDE_PLUGIN_KEY] === true) {
        return true;
      }
    } catch {
      // Missing or malformed settings: nothing here says the plugin is enabled.
      // Falling through to `false` is the safe direction — the cost of a wrong
      // `false` is a duplicate entry, the cost of a wrong `true` is a user with
      // no skills installed.
    }
  }
  return false;
}

/**
 * Whether a plugin cache directory exists at all, regardless of whether the
 * plugin is enabled. An enabled plugin implies a cache; a cache implies nothing,
 * because uninstalling leaves it behind. Diagnostics use this to tell "never
 * installed" apart from "uninstalled, leftovers on disk".
 * @param {string} baseDir - Optional base directory
 * @returns {boolean}
 */
export function hasClaudePluginCache(baseDir) {
  return existsSync(getClaudePluginSkillsPath(baseDir));
}

/**
 * Whether any cached version of the plugin carries the given file.
 * @param {string} kind - Subdirectory inside the plugin ('skills' or 'commands')
 * @param {string} entry - Entry to look for (skill directory or command file)
 * @param {string} baseDir - Optional base directory
 * @returns {boolean} True if a cached version contains it
 */
function pluginCacheContains(kind, entry, baseDir) {
  const pluginBase = getClaudePluginSkillsPath(baseDir);
  if (!existsSync(pluginBase)) return false;
  try {
    return readdirSync(pluginBase).some((version) =>
      existsSync(join(pluginBase, version, kind, entry))
    );
  } catch {
    return false;
  }
}

/**
 * Whether the installed plugin already provides this skill to Claude Code.
 * @param {string} skillName - Skill name (e.g. 'ti-expert')
 * @param {string} baseDir - Optional base directory
 * @returns {boolean}
 */
export function pluginProvidesSkill(skillName, baseDir) {
  return isClaudePluginEnabled(baseDir) && pluginCacheContains('skills', skillName, baseDir);
}

/**
 * Whether the installed plugin already provides this slash command.
 * @param {string} commandName - Command name without the .md extension
 * @param {string} baseDir - Optional base directory
 * @returns {boolean}
 */
export function pluginProvidesCommand(commandName, baseDir) {
  return (
    isClaudePluginEnabled(baseDir) && pluginCacheContains('commands', `${commandName}.md`, baseDir)
  );
}

export default {
  isClaudePluginEnabled,
  hasClaudePluginCache,
  pluginProvidesSkill,
  pluginProvidesCommand,
};
