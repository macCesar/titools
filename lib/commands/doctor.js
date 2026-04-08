/**
 * Doctor command
 * Diagnoses installation health (read-only)
 */

import chalk from 'chalk';
import { existsSync, lstatSync, readFileSync, realpathSync } from 'fs';
import { join } from 'path';
import os from 'os';
import {
  SKILLS,
  PACKAGE_VERSION,
  TITANIUM_KNOWLEDGE_VERSION,
  getAgentsSkillsDir,
  getClaudeAgentsDir,
  getConfigDir,
  getPlatforms,
} from '../config.js';
import { hasHook } from '../hooks.js';
import { readLastCheck } from '../cache.js';
import { isTitaniumProject, blockExists } from '../utils.js';

const CHECK = chalk.green('✓');
const CROSS = chalk.red('✗');
const WARN = chalk.yellow('⚠');

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

export async function doctorCommand() {
  const homeDir = os.homedir();
  const skillsDir = getAgentsSkillsDir(homeDir);
  const agentsDir = getClaudeAgentsDir(homeDir);
  const claudeDir = join(homeDir, '.claude');
  const cacheDir = getConfigDir();
  const cwd = process.cwd();

  let issues = 0;
  const symlinkIssues = [];

  console.log('');
  console.log(chalk.bold('Titanium SDK Skills Doctor'));
  console.log('');
  console.log('  Checking installation health...');
  console.log('');

  // CLI version
  console.log(`  ${CHECK} CLI version: v${PACKAGE_VERSION}`);

  // Skills check
  const missingSkills = [];
  for (const skill of SKILLS) {
    if (!existsSync(join(skillsDir, skill))) {
      missingSkills.push(skill);
    }
  }
  const installedCount = SKILLS.length - missingSkills.length;
  if (missingSkills.length === 0) {
    console.log(`  ${CHECK} Skills: ${installedCount}/${SKILLS.length} installed in ~/.agents/skills/`);
  } else {
    console.log(`  ${CROSS} Skills: ${installedCount}/${SKILLS.length} installed in ~/.agents/skills/ (missing: ${missingSkills.join(', ')})`);
    issues += missingSkills.length;
  }

  // Agent check
  const agentPath = join(agentsDir, 'ti-pro.md');
  if (existsSync(agentPath)) {
    console.log(`  ${CHECK} Agent: ti-pro installed`);
  } else {
    console.log(`  ${CROSS} Agent: ti-pro not found`);
    issues++;
  }

  // Hook check
  if (hasHook(claudeDir)) {
    console.log(`  ${CHECK} Hook: SessionStart configured`);
  } else {
    console.log(`  ${CROSS} Hook: SessionStart not configured`);
    issues++;
  }

  // Cache check
  const lastCheck = readLastCheck(cacheDir);
  if (lastCheck) {
    const hoursAgo = Math.round((Date.now() - lastCheck.lastCheck) / (1000 * 60 * 60));
    const timeLabel = hoursAgo < 1 ? 'less than an hour ago' : `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
    console.log(`  ${CHECK} Cache: last check ${timeLabel}`);
  } else {
    console.log(`  ${WARN} Cache: no check recorded`);
  }

  // Platforms
  console.log('');
  console.log('  Platforms:');
  const platforms = getPlatforms(homeDir);
  for (const platform of platforms) {
    const missing = [];
    const broken = [];

    for (const skill of SKILLS) {
      const linkPath = join(platform.skillsDir, skill);
      try {
        const stat = lstatSync(linkPath);
        if (stat.isSymbolicLink()) {
          // Check if target exists
          if (!existsSync(linkPath)) {
            broken.push(skill);
          }
        }
        // exists (symlink or directory), count as linked
      } catch {
        missing.push(skill);
      }
    }

    const linkedCount = SKILLS.length - missing.length - broken.length;

    if (missing.length === 0 && broken.length === 0) {
      console.log(`    ${CHECK} ${platform.displayName}: ${SKILLS.length}/${SKILLS.length} skills linked`);
    } else {
      const problems = [];
      if (missing.length > 0) problems.push(`missing: ${missing.join(', ')}`);
      if (broken.length > 0) problems.push(`broken: ${broken.join(', ')}`);
      console.log(`    ${CROSS} ${platform.displayName}: ${linkedCount}/${SKILLS.length} skills linked (${problems.join('; ')})`);
      issues += missing.length + broken.length;

      // Collect symlink issues for detailed report
      for (const skill of broken) {
        symlinkIssues.push(`${CROSS} ~/${platform.name === 'claude' ? '.claude' : `.${platform.name}`}/skills/${skill} → broken symlink (target missing)`);
      }
      for (const skill of missing) {
        symlinkIssues.push(`${CROSS} ~/${platform.name === 'claude' ? '.claude' : `.${platform.name}`}/skills/${skill} → not found`);
      }
    }
  }

  // Symlink issues detail
  if (symlinkIssues.length > 0) {
    console.log('');
    console.log(`  ${WARN} Symlink issues:`);
    for (const issue of symlinkIssues) {
      console.log(`    ${issue}`);
    }
  }

  // Project check
  if (isTitaniumProject(cwd)) {
    console.log('');
    console.log('  Project:');

    const mdFiles = ['CLAUDE.md', 'GEMINI.md', 'AGENTS.md'];
    for (const file of mdFiles) {
      const filePath = join(cwd, file);
      if (!existsSync(filePath)) {
        // Not an issue if file doesn't exist — it's optional
        continue;
      }

      if (blockExists(filePath)) {
        const version = extractIndexVersion(filePath);
        if (version === TITANIUM_KNOWLEDGE_VERSION) {
          console.log(`    ${CHECK} ${file}: Knowledge Index present (${version})`);
        } else if (version) {
          console.log(`    ${CROSS} ${file}: Knowledge Index outdated (${version})`);
          issues++;
        } else {
          console.log(`    ${CHECK} ${file}: Knowledge Index present`);
        }
      } else {
        console.log(`    ${CROSS} ${file}: no Knowledge Index`);
        issues++;
      }
    }
  }

  // Summary
  console.log('');
  if (issues === 0) {
    console.log(chalk.green(`  No issues found.`));
  } else {
    console.log(chalk.yellow(`  ${issues} issue${issues === 1 ? '' : 's'} found. Run 'titools install' to fix.`));
  }
  console.log('');
}

export default { doctorCommand };
