/**
 * Auto-update command
 * Full pipeline: check npm -> update CLI -> sync skills -> sync MDs
 * Designed to run silently from hooks or manually with progress
 */

import chalk from 'chalk';
import ora from 'ora';
import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import {
  PACKAGE_VERSION,
  SKILLS,
  getConfigDir,
} from '../config.js';
import {
  shouldCheckForUpdate as shouldCheck,
  writeLastCheck,
} from '../cache.js';
import {
  checkForUpdate,
  fetchLatestNpmVersion,
} from '../downloader.js';
import {
  installSkills,
  getLocalRepoDir,
} from '../installer.js';
import { createSkillSymlinks } from '../symlink.js';
import { detectPlatforms } from '../platform.js';
import { cleanupLegacyArtifacts, getSkillList } from '../cleanup.js';
import { isTitaniumProject } from '../utils.js';

function isDevMode() {
  const repoDir = getLocalRepoDir();
  if (!repoDir) return false;
  return existsSync(join(repoDir, '.git'));
}

function noopSpinner() {
  const noop = () => noopSpinner;
  return { start: noop, succeed: noop, fail: noop, warn: noop, info: noop };
}

export async function autoUpdateCommand(options) {
  const silent = !!options.silent;
  const log = silent ? () => {} : console.log;
  const spinner = silent ? noopSpinner() : ora();

  const cacheDir = getConfigDir();

  // Step 1: Check cache
  if (!shouldCheck(cacheDir)) {
    log(chalk.green('✔'), `Up to date (v${PACKAGE_VERSION})`);
    return;
  }

  // Step 2: Check npm for latest version
  spinner.start('Checking for updates...');

  let latestVersion;
  try {
    latestVersion = await fetchLatestNpmVersion();
  } catch {
    if (!silent) spinner.fail('Could not reach npm registry');
    return;
  }

  // Step 3: Write cache
  try {
    writeLastCheck(cacheDir, latestVersion);
  } catch {
    // Cache write failed — continue anyway
  }

  // Step 4: Compare versions
  const hasUpdate = await checkForUpdate(PACKAGE_VERSION);

  if (!hasUpdate) {
    spinner.succeed(`Up to date (v${PACKAGE_VERSION})`);
    return;
  }

  // Step 5: Update CLI (skip in dev mode)
  spinner.succeed(`Update available: v${PACKAGE_VERSION} → ${latestVersion}`);

  if (isDevMode()) {
    spinner.info(`Dev mode — skipping npm update`);
  } else {
    spinner.start(`Downloading and installing v${latestVersion}...`);
    try {
      execFileSync('npm', ['update', '-g', '@maccesar/titools'], {
        stdio: 'pipe',
        timeout: 60000,
      });
      spinner.succeed(`Updated to v${latestVersion}`);
    } catch (error) {
      spinner.fail(`npm update failed: ${error.message}`);
      return;
    }
  }

  // Step 6: Sync skills and refresh symlinks
  const repoDir = getLocalRepoDir();
  if (repoDir) {
    spinner.start('Syncing skills...');
    try {
      await installSkills(repoDir);
      cleanupLegacyArtifacts();

      const detectedPlatforms = detectPlatforms();
      const skillList = getSkillList({ includeLegacy: false });
      for (const platform of detectedPlatforms) {
        const hasSymlinks = skillList.some((skill) =>
          existsSync(join(platform.skillsDir, skill))
        );
        if (hasSymlinks) {
          await createSkillSymlinks(platform.skillsDir, SKILLS);
        }
      }
      spinner.succeed('Skills synced');
    } catch (error) {
      spinner.fail(`Skill sync failed: ${error.message}`);
    }
  }

  // Step 7: If in a Titanium project, update existing MD files
  const projectDir = resolve(process.cwd());
  if (isTitaniumProject(projectDir)) {
    try {
      const { agentsCommand } = await import('./agents.js');
      await agentsCommand(projectDir, { onlyExisting: true, force: true });
    } catch {
      // MD sync failed — not critical
    }
  }

  log('');
}

export default autoUpdateCommand;
