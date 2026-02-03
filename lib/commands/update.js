/**
 * Update command
 * Updates skills and docs to the latest version
 */

import chalk from 'chalk';
import ora from 'ora';
import {
  PACKAGE_VERSION,
  REPO_URL,
  SKILLS,
} from '../config.js';
import select from '../prompts/selectCancel.js';
import {
  detectPlatforms,
} from '../platform.js';
import { cleanupLegacyArtifacts, getSkillList } from '../cleanup.js';
import {
  installSkills,
  installAgents,
  getLocalRepoDir,
} from '../installer.js';
import { agentsCommand } from './agents.js';
import {
  checkForUpdate,
  fetchLatestVersion,
} from '../downloader.js';
import { createSkillSymlinks } from '../symlink.js';
import { formatList, isTitaniumProject } from '../utils.js';
import { getAgentsSkillsDir } from '../config.js';
import { existsSync } from 'fs';
import { join, resolve } from 'path';

/**
 * Check if a platform has any skill symlinks installed
 * @param {string} platformSkillsDir - Platform skills directory
 * @returns {boolean} True if any skill symlink exists
 */
function hasAnySkillSymlink(platformSkillsDir) {
  if (!platformSkillsDir || !existsSync(platformSkillsDir)) return false;
  const skillList = getSkillList();
  return skillList.some((skill) => existsSync(join(platformSkillsDir, skill)));
}

/**
 * Update command handler
 * @param {Object} options - Command options
 */
export async function updateCommand(options) {
  console.log('');
  console.log(chalk.bold.blue('Titanium SDK Skills Updater'));
  console.log('');

  const spinner = ora();

  // Determine base directory
  let baseDir = options.local ? process.cwd() : undefined;
  const hasSkillsAt = (dir) =>
    SKILLS.some((skill) => existsSync(join(getAgentsSkillsDir(dir), skill)));

  // If not explicitly local, check if local skills exist to ask user
  if (!options.local) {
    const projectDir = process.cwd();
    const isProject = isTitaniumProject(projectDir);
    const localPlatforms = detectPlatforms(projectDir);
    const hasLocalSkills = isProject && hasSkillsAt(projectDir);
    const hasGlobalSkills = hasSkillsAt(undefined);
    if (hasLocalSkills && !hasGlobalSkills) {
      baseDir = projectDir;
    } else if (isProject && localPlatforms.length > 0) {
      try {
        const scope = await select({
          message: 'Local installation detected. What do you want to update:',
          choices: [
            { name: 'Global skills (user home)', value: 'global' },
            { name: 'Local skills (current project)', value: 'local' },
          ],
          theme: {
            style: {
              answer: () => '',
              prefix: () => chalk.cyan('?'),
            },
          },
        });
        if (scope === 'cancel') {
          console.log('Cancelled.');
          process.exit(0);
        }
        if (scope === 'local') {
          baseDir = process.cwd();
        }
      } catch (error) {
        console.log('\nCancelled.');
        process.exit(0);
      }
    }
  }

  if (baseDir) {
    console.log(chalk.cyan('Mode: Local update (current project)'));
  } else {
    console.log(chalk.cyan('Mode: Global update (user home)'));
  }
  console.log('');

  const skillsDir = getAgentsSkillsDir(baseDir);
  const hasSkillsInstalled = skillsDir && SKILLS.some((skill) => existsSync(join(skillsDir, skill)));
  if (!hasSkillsInstalled) {
    console.log(chalk.yellow('No skills installed at this location.'));
    console.log('Install them first with:');
    console.log('  titools install');
    console.log('');
    console.log('Looked for skills in:');
    console.log(`  ${baseDir ? 'Local' : 'Global'}: ${skillsDir}`);
    return;
  }

  // Check for updates
  spinner.start('Checking for updates...');

  try {
    const hasUpdate = await checkForUpdate(PACKAGE_VERSION);

    // If there's a newer version on GitHub, prompt user to update CLI first
    if (hasUpdate) {
      let latestVersion = '(newer)';
      try {
        latestVersion = await fetchLatestVersion();
      } catch {
        // Ignore error, we already know there's an update
      }

      spinner.warn('New version available');
      console.log('');
      console.log(chalk.yellow('A newer version is available on npm:'));
      console.log(`  Current: ${chalk.gray('v' + PACKAGE_VERSION)}`);
      console.log(`  Latest:  ${chalk.green(latestVersion)}`);
      console.log('');
      console.log('To update, run:');
      console.log(`  ${chalk.cyan('npm update -g @maccesar/titools')}`);
      console.log('');
      console.log('Then run this command again:');
      console.log(`  ${chalk.cyan('titools update')}`);
      console.log('');
      return;
    }

    // CLI is up to date, now sync skills from the installed package
    spinner.succeed(`CLI is up to date (v${PACKAGE_VERSION})`);

    // Get repository directory from the installed package
    const repoDir = getLocalRepoDir();
    if (!repoDir) {
      console.log('');
      console.log(chalk.red('Error: Could not locate skills source directory.'));
      console.log('Try reinstalling with:');
      console.log(`  ${chalk.cyan('npm install -g titools')}`);
      return;
    }

    // Detect platforms with existing symlinks (only update those)
    const detectedPlatforms = detectPlatforms(baseDir);
    const platformsWithSymlinks = detectedPlatforms.filter((p) =>
      hasAnySkillSymlink(p.skillsDir)
    );

    // Install skills
    spinner.start('Syncing skills...');
    const skillsResult = await installSkills(repoDir, baseDir);
    spinner.succeed(`Skills: ${formatList(skillsResult.installed)}`);

    // Install agents (only if Claude Code has symlinks)
    const claudePlatform = platformsWithSymlinks.find((p) => p.name === 'claude');
    if (claudePlatform) {
      spinner.start('Syncing agents...');
      const agentsResult = await installAgents(repoDir, baseDir);
      if (agentsResult.installed.length > 0) {
        spinner.succeed(`Agents: ${formatList(agentsResult.installed)}`);
      } else {
        spinner.info('No agents to sync');
      }
    }

    cleanupLegacyArtifacts(baseDir);

    // Update symlinks only for platforms that already had them
    for (const platform of platformsWithSymlinks) {
      spinner.start(`Updating ${platform.displayName} symlinks...`);
      const symlinkResult = await createSkillSymlinks(
        platform.skillsDir,
        SKILLS,
        baseDir
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

    // Update knowledge index in MD files if in a Titanium project
    const projectDir = resolve(process.cwd());
    if (isTitaniumProject(projectDir)) {
      const aiFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'];
      const hasAnyAiFile = aiFiles.some((file) => existsSync(join(projectDir, file)));
      if (hasAnyAiFile) {
        console.log('');
        await agentsCommand(projectDir, { onlyExisting: true, force: true });
      }
    }
    console.log('');

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
