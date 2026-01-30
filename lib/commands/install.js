/**
 * Install command
 * Installs skills and agents to AI coding assistant directories
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import {
  SKILLS,
  AGENTS,
  REPO_URL,
} from '../config.js';
import {
  detectPlatforms,
  detectOS,
} from '../platform.js';
import {
  installSkills,
  installAgents,
  installAgentsTemplate,
  getLocalRepoDir,
} from '../installer.js';
import { downloadRepoArchive } from '../downloader.js';
import { createSkillSymlinks } from '../symlink.js';
import { formatList } from '../utils.js';
import { mkdtemp } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

/**
 * Install command handler
 * @param {Object} options - Command options
 */
export async function installCommand(options) {
  console.log('');
  console.log(chalk.bold.blue('Titanium SDK Skills Installer'));
  console.log('');

  // Detect installed platforms
  const detectedPlatforms = detectPlatforms();

  if (detectedPlatforms.length === 0 && !options.path) {
    console.log(chalk.yellow('No AI coding assistants detected.'));
    console.log('Install one of: Claude Code, Gemini CLI, or Codex CLI');
    console.log('Or use: titools install --path /custom/path');
    process.exit(1);
  }

  // Show detected platforms
  for (const platform of detectedPlatforms) {
    console.log(chalk.green('✓'), `${platform.displayName} detected`);
  }
  console.log('');

  // Select platforms to install
  let selectedPlatforms = [];

  if (options.path) {
    // Custom path mode - skip platform selection
    selectedPlatforms = [];
  } else if (options.all) {
    // Install to all detected platforms
    selectedPlatforms = detectedPlatforms;
  } else {
    // Interactive selection
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'platform',
        message: 'Select platform to install:',
        choices: [
          { name: 'All detected platforms', value: 'all' },
          ...detectedPlatforms.map((p) => ({
            name: `${p.displayName} only`,
            value: p.name,
          })),
          { name: 'Cancel', value: 'cancel' },
        ],
      },
    ]);

    if (answers.platform === 'cancel') {
      console.log('Cancelled.');
      process.exit(0);
    }

    if (answers.platform === 'all') {
      selectedPlatforms = detectedPlatforms;
    } else {
      selectedPlatforms = detectedPlatforms.filter(
        (p) => p.name === answers.platform
      );
    }
  }

  if (selectedPlatforms.length === 0 && !options.path) {
    console.log('No platforms selected.');
    process.exit(0);
  }

  // Get repository directory (local or download)
  const spinner = ora();
  let repoDir = getLocalRepoDir();

  if (!repoDir) {
    // Download from GitHub
    spinner.start('Downloading from GitHub...');
    try {
      const tempDir = tmpdir();
      repoDir = await mkdtemp(join(tempDir, 'titanium-skills-'));
      await downloadRepoArchive(repoDir);
      spinner.succeed('Downloaded from GitHub');
    } catch (error) {
      spinner.fail('Failed to download');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  } else {
    console.log(chalk.green('Using local repository'));
  }

  try {
    // Install skills
    spinner.start('Installing skills...');
    const skillsResult = await installSkills(repoDir);
    spinner.succeed(
      `Skills: ${formatList(skillsResult.installed)}`
    );

    // Install agents
    spinner.start('Installing agents...');
    const agentsResult = await installAgents(repoDir);
    if (agentsResult.installed.length > 0) {
      spinner.succeed(
        `Agents: ${formatList(agentsResult.installed)}`
      );
    } else {
      spinner.info('No agents to install (Claude Code not detected)');
    }

    // Install AGENTS-TEMPLATE.md
    spinner.start('Installing AGENTS-TEMPLATE.md...');
    const templateInstalled = await installAgentsTemplate(repoDir);
    if (templateInstalled) {
      spinner.succeed('AGENTS-TEMPLATE.md installed');
    } else {
      spinner.warn('AGENTS-TEMPLATE.md not found');
    }

    // Create symlinks for selected platforms
    for (const platform of selectedPlatforms) {
      spinner.start(`Linking ${platform.displayName}...`);
      const symlinkResult = await createSkillSymlinks(
        platform.skillsDir,
        SKILLS
      );
      if (symlinkResult.linked.length === SKILLS.length) {
        spinner.succeed(`${platform.displayName} linked`);
      } else {
        spinner.warn(
          `${platform.displayName}: ${symlinkResult.linked.length}/${SKILLS.length} linked`
        );
      }
    }

    // Summary
    console.log('');
    console.log(chalk.green('✓ Installation complete!'));
    console.log('');
    console.log(chalk.bold('▸'), 'Add AGENTS.md to your project:', chalk.cyan('titools agents'));
    console.log(chalk.bold('▸'), 'Improves AI:', chalk.red('53%'), '→', chalk.green('100%'));
    console.log('');

    if (detectOS() === 'windows') {
      console.log(chalk.yellow('▸'), 'Windows: Ensure ~/bin is in your PATH');
      console.log('');
    }

  } finally {
    // Clean up temp directory if we downloaded
    if (repoDir !== getLocalRepoDir() && repoDir.startsWith(tmpdir())) {
      await import('fs-extra').then(({ remove }) => remove(repoDir));
    }
  }
}

export default installCommand;
