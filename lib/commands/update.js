/**
 * Update command
 * Updates skills and docs to the latest version
 */

import chalk from 'chalk';
import ora from 'ora';
import {
  PACKAGE_VERSION,
  REPO_URL,
  REPO_API_URL,
  SKILLS,
  AGENTS,
} from '../config.js';
import {
  detectPlatforms,
} from '../platform.js';
import {
  installSkills,
  installAgents,
  installAgentsTemplate,
  getLocalRepoDir,
} from '../installer.js';
import {
  downloadRepoArchive,
  checkForUpdate,
} from '../downloader.js';
import { createSkillSymlinks } from '../symlink.js';
import { formatList } from '../utils.js';
import { mkdtemp } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

/**
 * Update command handler
 */
export async function updateCommand() {
  console.log('');
  console.log(chalk.bold.blue('Titanium SDK Skills Updater'));
  console.log('');

  const spinner = ora();

  // Check for updates
  spinner.start('Checking for updates...');

  try {
    const hasUpdate = await checkForUpdate(PACKAGE_VERSION);

    if (!hasUpdate) {
      spinner.info(`Already up to date (v${PACKAGE_VERSION})`);
      console.log('');
      console.log(chalk.green('✓'), 'Skills and agents are already at the latest version');
      console.log('');
      return;
    }

    spinner.succeed(`Update available!`);
    console.log('');
    console.log(chalk.gray(`Current: ${PACKAGE_VERSION}`));
    console.log(chalk.gray(`Latest:  (from GitHub)`));
    console.log('');

    // Detect installed platforms
    const detectedPlatforms = detectPlatforms();

    if (detectedPlatforms.length === 0) {
      console.log(chalk.yellow('No AI coding assistants detected.'));
      console.log('Update will install skills to ~/.agents/skills/');
      console.log('');
    } else {
      for (const platform of detectedPlatforms) {
        console.log(chalk.green('✓'), platform.displayName);
      }
      console.log('');
    }

    // Download latest from GitHub
    spinner.start('Downloading latest from GitHub...');

    let repoDir = getLocalRepoDir();
    let tempDir = null;

    if (!repoDir) {
      tempDir = await mkdtemp(join(tmpdir(), 'titanium-skills-'));
      repoDir = await downloadRepoArchive(tempDir);
    }

    spinner.succeed('Downloaded from GitHub');

    try {
      // Install skills
      spinner.start('Updating skills...');
      const skillsResult = await installSkills(repoDir);
      spinner.succeed(
        `Skills: ${formatList(skillsResult.installed)}`
      );

      // Install agents
      spinner.start('Updating agents...');
      const agentsResult = await installAgents(repoDir);
      if (agentsResult.installed.length > 0) {
        spinner.succeed(
          `Agents: ${formatList(agentsResult.installed)}`
        );
      } else {
        spinner.info('No agents to update');
      }

      // Install AGENTS-TEMPLATE.md
      spinner.start('Updating AGENTS-TEMPLATE.md...');
      const templateInstalled = await installAgentsTemplate(repoDir);
      if (templateInstalled) {
        spinner.succeed('AGENTS-TEMPLATE.md updated');
      } else {
        spinner.warn('AGENTS-TEMPLATE.md not found');
      }

      // Update symlinks for detected platforms
      for (const platform of detectedPlatforms) {
        spinner.start(`Updating ${platform.displayName} symlinks...`);
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
      console.log(chalk.green('✓ Update complete!'));
      console.log('');
      console.log(chalk.bold('▸'), 'Run in your Titanium project:', chalk.cyan('titools agents'));
      console.log('');

    } finally {
      // Clean up temp directory
      if (tempDir) {
        await import('fs-extra').then(({ remove }) => remove(tempDir));
      }
    }

  } catch (error) {
    spinner.fail('Update failed');
    console.error(chalk.red(error.message));
    console.log('');
    console.log('You can try manually installing from:');
    console.log(chalk.cyan(REPO_URL));
    process.exit(1);
  }
}

export default updateCommand;
