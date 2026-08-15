/**
 * Status command
 * Shows a quick overview of what's installed (read-only)
 */

import chalk from 'chalk';
import { existsSync, lstatSync, readFileSync } from 'fs';
import { join } from 'path';
import os from 'os';
import {
  SKILLS,
  PACKAGE_VERSION,
  getAgentsSkillsDir,
  getClaudeAgentsDir,
  getConfigDir,
  getPlatforms,
} from '../config.js';
import { hasHook } from '../hooks.js';
import { readLastCheck } from '../cache.js';
import { isTitaniumProject, detectTitaniumVersion, blockExists } from '../utils.js';

const CHECK = chalk.green('✓');
const CROSS = chalk.red('✗');

function countInstalledSkills(skillsDir) {
  let count = 0;
  for (const skill of SKILLS) {
    if (existsSync(join(skillsDir, skill))) {
      count++;
    }
  }
  return count;
}

function countLinkedSkills(platformSkillsDir) {
  let count = 0;
  for (const skill of SKILLS) {
    const linkPath = join(platformSkillsDir, skill);
    try {
      lstatSync(linkPath);
      count++;
    } catch {
      // not found
    }
  }
  return count;
}

function formatLastCheck(data) {
  if (!data) return chalk.gray('never');
  const date = new Date(data.lastCheck);
  const formatted = date.toISOString().replace('T', ' ').slice(0, 16);
  return `${formatted} (v${data.latestVersion})`;
}

function extractIndexVersion(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    const content = readFileSync(filePath, 'utf8');
    const match = content.match(/<!-- Version: (v[\d.]+) -->/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function statusCommand() {
  const homeDir = os.homedir();
  const skillsDir = getAgentsSkillsDir(homeDir);
  const agentsDir = getClaudeAgentsDir(homeDir);
  const claudeDir = join(homeDir, '.claude');
  const cacheDir = getConfigDir();
  const cwd = process.cwd();

  // Skills count
  const installedCount = countInstalledSkills(skillsDir);
  const totalCount = SKILLS.length;

  // Agent check
  const agentExists = existsSync(join(agentsDir, 'ti-pro.md'));

  // Hook check
  const hookExists = hasHook(claudeDir);

  // Cache
  const lastCheck = readLastCheck(cacheDir);

  console.log('');
  console.log(chalk.bold('Titanium SDK Skills Status'));
  console.log('');
  console.log(`  Version:    v${PACKAGE_VERSION}`);
  console.log(`  Skills:     ${installedCount}/${totalCount} installed`);
  console.log(`  Agent:      ti-pro ${agentExists ? CHECK : CROSS}`);
  console.log(`  Hook:       Claude Code SessionStart ${hookExists ? CHECK : CROSS}`);
  console.log(`  Last check: ${formatLastCheck(lastCheck)}`);

  // Platforms
  console.log('');
  console.log('  Platforms:');
  const platforms = getPlatforms(homeDir);
  for (const platform of platforms) {
    const linked = countLinkedSkills(platform.skillsDir);
    if (linked > 0) {
      console.log(`    ${platform.displayName.padEnd(13)} ${CHECK} ${linked} skills linked`);
    } else {
      console.log(`    ${platform.displayName.padEnd(13)} ${CROSS} ${chalk.gray('not linked')}`);
    }
  }

  // Project
  console.log('');
  if (isTitaniumProject(cwd)) {
    const sdkVersion = detectTitaniumVersion(cwd);
    console.log(`  Project: ${chalk.cyan('Titanium')} (SDK ${sdkVersion})`);

    const mdFiles = ['CLAUDE.md', 'GEMINI.md', 'AGENTS.md'];
    for (const file of mdFiles) {
      const filePath = join(cwd, file);
      if (!existsSync(filePath)) {
        console.log(`    ${file.padEnd(11)} ${CROSS} ${chalk.gray('not found')}`);
      } else if (blockExists(filePath)) {
        const version = extractIndexVersion(filePath);
        console.log(`    ${file.padEnd(11)} ${CHECK} Knowledge Index${version ? ` (${version})` : ''}`);
      } else {
        console.log(`    ${file.padEnd(11)} ${CROSS} ${chalk.gray('no index')}`);
      }
    }
  } else {
    console.log(`  Project: ${chalk.gray('(not a Titanium project)')}`);
  }

  console.log('');
}

export default { statusCommand };
