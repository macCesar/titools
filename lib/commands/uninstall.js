/**
 * Uninstall command
 * Removes installed skills and agents
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { SKILLS, AGENTS } from '../config.js';
import {
  detectPlatforms,
} from '../platform.js';
import { remove } from 'fs-extra';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import {
  getAgentsSkillsDir,
  getClaudeAgentsDir,
  getClaudeSkillsDir,
  getGeminiSkillsDir,
  getCodexSkillsDir,
} from '../config.js';

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

  if (!existsSync(platformSkillsDir)) {
    return results;
  }

  for (const skill of SKILLS) {
    const linkPath = join(platformSkillsDir, skill);

    if (existsSync(linkPath)) {
      try {
        rmSync(linkPath, { recursive: true, force: true });
        results.removed.push(skill);
      } catch (error) {
        results.failed.push(skill);
      }
    }
  }

  return results;
}

/**
 * Remove skills from central directory
 * @returns {Object} Results object
 */
function removeSkills() {
  const skillsDir = getAgentsSkillsDir();
  const results = {
    removed: [],
    failed: [],
  };

  if (!existsSync(skillsDir)) {
    return results;
  }

  for (const skill of SKILLS) {
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
 * @returns {Object} Results object
 */
function removeAgents() {
  const agentsDir = getClaudeAgentsDir();
  const results = {
    removed: [],
    failed: [],
  };

  if (!existsSync(agentsDir)) {
    return results;
  }

  for (const agent of AGENTS) {
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

  // Detect installed platforms
  const detectedPlatforms = detectPlatforms();

  if (detectedPlatforms.length === 0) {
    console.log(chalk.yellow('No AI coding assistants detected.'));
    console.log('However, you can still remove skills from the central directory.');
    console.log('');
  }

  // Show detected platforms
  for (const platform of detectedPlatforms) {
    console.log(chalk.green('✓'), `${platform.displayName} detected`);
  }
  console.log('');

  // Select what to uninstall
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'targets',
      message: 'What do you want to uninstall?',
      choices: [
        { name: 'Skill symlinks from all platforms', value: 'symlinks', checked: true },
        { name: 'Skills from central directory (~/.agents/skills/)', value: 'skills', checked: false },
        { name: 'Agents from Claude Code', value: 'agents', checked: false },
      ],
      validate: (answer) => answer.length > 0 || 'Please select at least one option',
    },
  ]);

  if (answers.targets.includes('symlinks') && detectedPlatforms.length === 0) {
    console.log(chalk.yellow('No platforms detected, skipping symlink removal.'));
    answers.targets = answers.targets.filter((t) => t !== 'symlinks');
  }

  if (answers.targets.length === 0) {
    console.log('Nothing to uninstall.');
    process.exit(0);
  }

  const spinner = ora();

  // Remove symlinks from platforms
  if (answers.targets.includes('symlinks')) {
    for (const platform of detectedPlatforms) {
      spinner.start(`Removing ${platform.displayName} symlinks...`);
      const symlinkResult = removeSkillSymlinks(platform.skillsDir);

      if (symlinkResult.removed.length > 0) {
        spinner.succeed(`${platform.displayName}: ${symlinkResult.removed.length} removed`);
      } else {
        spinner.info(`${platform.displayName}: No symlinks found`);
      }
    }
  }

  // Remove skills from central directory
  if (answers.targets.includes('skills')) {
    spinner.start('Removing skills from central directory...');
    const skillsResult = removeSkills();

    if (skillsResult.removed.length > 0) {
      spinner.succeed(`Skills: ${skillsResult.removed.join(', ')}`);
    } else {
      spinner.info('No skills found in central directory');
    }
  }

  // Remove agents
  if (answers.targets.includes('agents')) {
    spinner.start('Removing agents...');
    const agentsResult = removeAgents();

    if (agentsResult.removed.length > 0) {
      spinner.succeed(`Agents: ${agentsResult.removed.join(', ')}`);
    } else {
      spinner.info('No agents found');
    }
  }

  console.log('');
  console.log(chalk.green('✓ Uninstallation complete!'));
  console.log('');
  console.log(chalk.gray('Note: AGENTS.md/CLAUDE.md/GEMINI.md files in your projects were NOT removed.'));
  console.log(chalk.gray('To remove them manually:'));
  console.log(chalk.gray('  rm -f /path/to/your/project/AGENTS.md'));
  console.log('');
}

export default uninstallCommand;
