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
import { cleanupLegacyArtifacts } from '../cleanup.js';
import {
  installSkills,
  installAgents,
  getLocalRepoDir,
} from '../installer.js';
import { agentsCommand } from './agents.js';
import {
  downloadRepoArchive,
  checkForUpdate,
} from '../downloader.js';
import { createSkillSymlinks } from '../symlink.js';
import { formatList, isTitaniumProject } from '../utils.js';
import { getAgentsSkillsDir } from '../config.js';
import { mkdtemp } from 'fs/promises';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { tmpdir } from 'os';

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

    if (!hasUpdate) {
      spinner.info(`Already up to date (v${PACKAGE_VERSION})`);
      cleanupLegacyArtifacts(baseDir);
      console.log('');
      console.log(chalk.green('✓'), 'Skills and agents are already at the latest version');
      const projectDir = resolve(process.cwd());
      if (isTitaniumProject(projectDir)) {
        const aiFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'];
        const hasAnyAiFile = aiFiles.some((file) => existsSync(join(projectDir, file)));
        if (hasAnyAiFile) {
          await agentsCommand(projectDir, { onlyExisting: true, force: true });
        }
      }
      console.log('');
      return;
    }

    spinner.succeed(`Update available!`);
    console.log('');
    console.log(chalk.gray(`Current: ${PACKAGE_VERSION}`));
    console.log(chalk.gray(`Latest:  (from GitHub)`));
    console.log('');

    // Detect installed platforms at target
    const detectedPlatforms = detectPlatforms(baseDir);

    if (detectedPlatforms.length === 0) {
      console.log(chalk.yellow('No AI coding assistants detected.'));
      if (baseDir) {
        console.log('Update will install skills to ./.agents/skills/');
      } else {
        console.log('Update will install skills to ~/.agents/skills/');
      }
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
      const skillsResult = await installSkills(repoDir, baseDir);
      spinner.succeed(
        `Skills: ${formatList(skillsResult.installed)}`
      );

      // Install agents
      spinner.start('Updating agents...');
      const agentsResult = await installAgents(repoDir, baseDir);
      if (agentsResult.installed.length > 0) {
        spinner.succeed(
          `Agents: ${formatList(agentsResult.installed)}`
        );
      } else {
        spinner.info('No agents to update');
      }

      cleanupLegacyArtifacts(baseDir);

      // Update symlinks for detected platforms
      for (const platform of detectedPlatforms) {
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
      console.log('');
      const projectDir = resolve(process.cwd());
      if (isTitaniumProject(projectDir)) {
        const aiFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'];
        const hasAnyAiFile = aiFiles.some((file) => existsSync(join(projectDir, file)));
        if (hasAnyAiFile) {
          await agentsCommand(projectDir, { onlyExisting: true, force: true });
        } else {
          console.log(chalk.bold('▸'), 'Run in the Titanium project:', chalk.cyan('titools sync'));
        }
      } else {
        console.log(chalk.bold('▸'), 'Run in the Titanium project:', chalk.cyan('titools sync'));
      }
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
