/**
 * Uninstall command
 * Removes installed skills and agents
 */

import chalk from 'chalk';
import ora from 'ora';
import { SKILLS, AGENTS, LEGACY_AGENTS, LEGACY_SKILLS } from '../config.js';
import {
  detectPlatforms,
} from '../platform.js';
import { existsSync, lstatSync, rmSync } from 'fs';
import { join } from 'path';
import {
  getAgentsSkillsDir,
  getClaudeAgentsDir,
} from '../config.js';
import checkbox, { Separator } from '../prompts/checkboxCancel.js';

/**
 * Remove skill symlinks from a platform directory
 * @param {string} platformSkillsDir - Platform skills directory
 * @returns {Object} Results object with success/failure counts
 */
function removeSkillSymlinks(platformSkillsDir) {
  const results = {
    removed: [],
    failed: [],
  };

  if (!platformSkillsDir || !existsSync(platformSkillsDir)) {
    return results;
  }

  const skillList = [...SKILLS, ...LEGACY_SKILLS];
  for (const skill of skillList) {
    const linkPath = join(platformSkillsDir, skill);

    try {
      lstatSync(linkPath);
      rmSync(linkPath, { recursive: true, force: true });
      results.removed.push(skill);
    } catch (error) {
      if (error.code && error.code !== 'ENOENT') {
        results.failed.push(skill);
      }
    }
  }

  return results;
}

/**
 * Remove skills from central directory
 * @param {string} baseDir - Base directory
 * @returns {Object} Results object
 */
function removeSkills(baseDir) {
  const skillsDir = getAgentsSkillsDir(baseDir);
  const results = {
    removed: [],
    failed: [],
  };

  if (!existsSync(skillsDir)) {
    return results;
  }

  const skillList = [...SKILLS, ...LEGACY_SKILLS];
  for (const skill of skillList) {
    const skillPath = join(skillsDir, skill);

    if (existsSync(skillPath)) {
      try {
        rmSync(skillPath, { recursive: true, force: true });
        results.removed.push(skill);
      } catch (error) {
        results.failed.push(skill);
      }
    }
  }

  return results;
}

/**
 * Remove agents from Claude Code
 * @param {string} baseDir - Base directory
 * @returns {Object} Results object
 */
function removeAgents(baseDir) {
  const agentsDir = getClaudeAgentsDir(baseDir);
  const results = {
    removed: [],
    failed: [],
  };

  if (!existsSync(agentsDir)) {
    return results;
  }

  const agentList = [...AGENTS, ...LEGACY_AGENTS];
  for (const agent of agentList) {
    const agentPath = join(agentsDir, `${agent}.md`);

    if (existsSync(agentPath)) {
      try {
        rmSync(agentPath);
        results.removed.push(agent);
      } catch (error) {
        results.failed.push(agent);
      }
    }
  }

  return results;
}

/**
 * Uninstall command handler
 * @param {Object} options - Command options
 */
export async function uninstallCommand(options) {
  console.log('');
  console.log(chalk.bold.blue('Titanium SDK Skills Uninstaller'));
  console.log('');

  const baseDir = options.local ? process.cwd() : undefined;
  if (options.local) {
    console.log(chalk.cyan('Mode: Local uninstallation (current project)'));
    console.log('');
  }

  // Detect installed platforms
  const detectedPlatforms = detectPlatforms(baseDir);

  // Show detected platforms
  if (detectedPlatforms.length > 0) {
    for (const platform of detectedPlatforms) {
      console.log(chalk.green('✓'), `${platform.displayName} detected`);
    }
    console.log('');
  } else if (!options.local) {
    console.log(chalk.yellow('No AI coding assistants detected globally.'));
    console.log('');
  }

  // Modern functional checkbox selection
  let targets = [];
  try {
    targets = await checkbox({
      message: 'What do you want to uninstall:',
      choices: [
        { name: 'Skill symlinks from all platforms', value: 'symlinks', checked: true },
        { name: `Skills from central directory (${options.local ? './.agents/skills/' : '~/.agents/skills/'})`, value: 'skills', checked: false },
        { name: 'Agents from Claude Code', value: 'agents', checked: false },
        new Separator(' ')
      ],
      shortcuts: { invert: null },
      theme: {
        style: {
          renderSelectedChoices: () => '',
        },
      },
    });
  } catch (error) {
    console.log('\nCancelled.');
    process.exit(0);
  }

  // Handle cancellation (by 'q')
  if (targets.includes('cancel')) {
    console.log('Cancelled.');
    return;
  }

  if (targets.includes('symlinks') && detectedPlatforms.length === 0) {
    console.log(chalk.yellow('No platforms detected, skipping symlink removal.'));
    targets = targets.filter((t) => t !== 'symlinks');
  }

  if (targets.length === 0) {
    console.log(chalk.yellow('Nothing to uninstall. Cancelled.'));
    return;
  }

  const spinner = ora();
  let actionTaken = false;

  // Remove symlinks from platforms
  if (targets.includes('symlinks')) {
    for (const platform of detectedPlatforms) {
      spinner.start(`Removing ${platform.displayName} symlinks...`);
      const symlinkResult = removeSkillSymlinks(platform.skillsDir);

      if (symlinkResult.removed.length > 0) {
        spinner.succeed(`${platform.displayName}: Skills unlinked`);
        actionTaken = true;
      } else {
        spinner.info(`${platform.displayName}: No symlinks found`);
      }
    }
  }

  // Remove skills from central directory
  if (targets.includes('skills')) {
    spinner.start('Removing skills...');
    const skillsResult = removeSkills(baseDir);

    if (skillsResult.removed.length > 0) {
      spinner.succeed(`${SKILLS.length} skills removed`);
      actionTaken = true;
    } else {
      spinner.info('No skills to remove');
    }
  }

  // Remove agents
  if (targets.includes('agents')) {
    spinner.start('Removing agents...');
    const agentsResult = removeAgents(baseDir);

    if (agentsResult.removed.length > 0) {
      spinner.succeed('Platform agents removed');
      actionTaken = true;
    } else {
      spinner.info('No agents to remove');
    }
  }

  if (actionTaken) {
    console.log('');
    console.log(chalk.green('✓ Uninstallation complete!'));
    console.log('');
    if (options.local) {
      console.log(chalk.gray('Note: Local AGENTS.md/CLAUDE.md/GEMINI.md files were NOT removed.'));
    } else {
      console.log(chalk.gray('Note: Project-level AGENTS.md/CLAUDE.md/GEMINI.md files were NOT removed.'));
    }
    console.log('');
  } else {
    console.log('');
    console.log(chalk.yellow('No changes were necessary.'));
    console.log('');
  }
}

export default uninstallCommand;
