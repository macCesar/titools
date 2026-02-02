/**
 * Skills command
 * Installs and manages skills in AI coding assistant directories
 */

import chalk from 'chalk';
import ora from 'ora';
import {
  SKILLS,
  AGENTS,
  LEGACY_AGENTS,
  LEGACY_SKILLS,
  getPlatforms,
  getClaudeAgentsDir,
  getAgentsSkillsDir,
} from '../config.js';
import select from '../prompts/selectCancel.js';
import checkbox, { Separator } from '../prompts/checkboxCancel.js';
import {
  detectPlatforms,
  detectOS,
} from '../platform.js';
import {
  installSkills,
  installAgents,
  getLocalRepoDir,
} from '../installer.js';
import { downloadRepoArchive } from '../downloader.js';
import { createSkillSymlinks } from '../symlink.js';
import { formatList, isTitaniumProject } from '../utils.js';
import { mkdtemp } from 'fs/promises';
import { existsSync, lstatSync, rmSync } from 'fs';
import { join, resolve } from 'path';
import { tmpdir } from 'os';

function hasAnySkillSymlink(platformSkillsDir) {
  if (!platformSkillsDir || !existsSync(platformSkillsDir)) return false;
  const skillList = [...SKILLS, ...LEGACY_SKILLS];
  return skillList.some((skill) => existsSync(join(platformSkillsDir, skill)));
}

function removeSkillSymlinks(platformSkillsDir) {
  const results = { removed: [], failed: [] };
  if (!platformSkillsDir || !existsSync(platformSkillsDir)) return results;

  const skillList = [...SKILLS, ...LEGACY_SKILLS];
  for (const skill of skillList) {
    const linkPath = join(platformSkillsDir, skill);
    try {
      lstatSync(linkPath);
      rmSync(linkPath, { recursive: true, force: true });
      results.removed.push(skill);
    } catch (error) {
      // Ignore missing paths; track real failures separately
      if (error.code && error.code !== 'ENOENT') {
        results.failed.push(skill);
      }
    }
  }

  return results;
}

function removeLegacySkillSymlinks(platformSkillsDir) {
  const results = { removed: [], failed: [] };
  if (!platformSkillsDir || !existsSync(platformSkillsDir)) return results;

  for (const skill of LEGACY_SKILLS) {
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

function removeAgents(baseDir) {
  const agentsDir = getClaudeAgentsDir(baseDir);
  const results = { removed: [], failed: [] };
  if (!existsSync(agentsDir)) return results;

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

function removeSkills(baseDir) {
  const skillsDir = getAgentsSkillsDir(baseDir);
  const results = { removed: [], failed: [] };
  if (!existsSync(skillsDir)) return results;

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
 * Skills command handler
 * @param {Object} options - Command options
 */
export async function skillsCommand(options) {
  console.log('');
  console.log(chalk.bold.blue('Titanium SDK Skills Manager'));
  console.log('');

  let isLocal = options.local;
  let customPath = options.path;

  // Auto-detection logic: If no explicit mode, check if we are in a Titanium project
  if (!isLocal && !customPath) {
    const projectDir = process.cwd();
    const isProject = isTitaniumProject(projectDir);

    if (isProject) {
      try {
        const mode = await select({
          message: 'Titanium project detected. Where do you want to install the skills:',
          choices: [
            { name: 'Global (user home) - Recommended for personal use', value: 'global' },
            { name: 'Local (current project) - Best for shared repositories', value: 'local' },
          ],
          theme: {
            style: {
              answer: () => '',
              prefix: () => chalk.cyan('?'),
            },
          },
        });
        if (mode === 'cancel') {
          console.log('Cancelled.');
          process.exit(0);
        }
        isLocal = mode === 'local';
      } catch (error) {
        console.log('\nCancelled.');
        process.exit(0);
      }
    }
  }

  // Determine base directory (Local vs Global)
  const baseDir = isLocal ? process.cwd() : (customPath ? resolve(customPath) : undefined);

  if (isLocal) {
    console.log(chalk.cyan('Mode: Local installation (current project)'));
  } else if (customPath) {
    console.log(chalk.cyan(`Mode: Custom path (${baseDir})`));
  } else {
    console.log(chalk.cyan('Mode: Global installation (user home)'));
  }
  console.log('');

  // Detect installed platforms at the target base directory
  const localPlatforms = detectPlatforms(baseDir);
  const globalPlatforms = detectPlatforms();
  let detectedPlatforms = localPlatforms;

  if (isLocal || options.path) {
    const localNames = new Set(localPlatforms.map((platform) => platform.name));
    const globalNames = new Set(globalPlatforms.map((platform) => platform.name));
    const allPlatforms = getPlatforms(baseDir);
    const merged = [...localPlatforms];
    for (const platform of allPlatforms) {
      if (globalNames.has(platform.name) && !localNames.has(platform.name)) {
        merged.push(platform);
      }
    }
    detectedPlatforms = merged;
  }

  if (detectedPlatforms.length === 0 && !options.path && !isLocal) {
    console.log(chalk.yellow('No AI coding assistants detected globally.'));
    console.log('Install one of: Claude Code, Gemini CLI, or Codex CLI');
    console.log('Or use: titools skills --local');
    process.exit(1);
  }

  // Show detected platforms
  if (detectedPlatforms.length > 0) {
    for (const platform of detectedPlatforms) {
      console.log(chalk.green('✓'), `${platform.displayName} detected`);
    }
    console.log('');
  } else if (isLocal) {
    // If local and none detected, still allow selection
    detectedPlatforms = getPlatforms(baseDir);
  }

  // Select platforms to install
  let selectedPlatforms = [];

  if (options.path) {
    // Custom path mode - skip platform selection
    selectedPlatforms = detectedPlatforms;
  } else if (options.all) {
    // Install to all detected platforms
    selectedPlatforms = detectedPlatforms;
  } else {
    // Modern functional selection
    try {
      const platformChoices = await checkbox({
        message: 'Select platforms to sync:',
        choices: [
          ...detectedPlatforms.map((p) => ({
            name: p.displayName,
            value: p.name,
            checked: hasAnySkillSymlink(p.skillsDir),
          })),
          new Separator(' ')
        ],
        shortcuts: { invert: null },
        theme: {
          style: {
            renderSelectedChoices: () => '',
            prefix: () => chalk.cyan('?'),
          },
        },
      });

      if (platformChoices.includes('cancel')) {
        console.log('Cancelled.');
        process.exit(0);
      }

      selectedPlatforms = detectedPlatforms.filter((p) =>
        platformChoices.includes(p.name)
      );
    } catch (error) {
      console.log('\nCancelled.');
      process.exit(0);
    }
  }

  const removeOnly = selectedPlatforms.length === 0;
  if (removeOnly) {
    console.log(chalk.yellow('No platforms selected. Removing all platform symlinks and agents.'));
  }

  // Get repository directory (local or download)
  const spinner = ora();
  let repoDir = null;
  let tempDir = null;

  if (!removeOnly) {
    repoDir = getLocalRepoDir();

    if (!repoDir) {
      // Download from GitHub
      spinner.start('Downloading from GitHub...');
      try {
        tempDir = await mkdtemp(join(tmpdir(), 'titanium-skills-'));
        repoDir = await downloadRepoArchive(tempDir);
        spinner.succeed('Downloaded from GitHub');
      } catch (error) {
        spinner.fail('Failed to download');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    } else {
      console.log(chalk.green('Using local repository'));
    }
  }

  const selectedPlatformNames = new Set(selectedPlatforms.map((platform) => platform.name));
  const removedPlatformNames = [];
  const claudeSelected = selectedPlatformNames.has('claude');

  try {
    if (!removeOnly) {
      // Install skills
      spinner.start('Installing skills...');
      const skillsResult = await installSkills(repoDir, baseDir);
      spinner.succeed(`${SKILLS.length} skills installed`);

      if (claudeSelected) {
        // Install agents
        spinner.start('Installing agents...');
        const agentsResult = await installAgents(repoDir, baseDir);
        if (agentsResult.installed.length > 0) {
          spinner.succeed('Platform agents installed');
        } else {
          spinner.info('No agents to install (Claude Code not detected)');
        }
      } else {
        spinner.start('Removing agents...');
        const agentsResult = removeAgents(baseDir);
        if (agentsResult.removed.length > 0) {
          spinner.succeed('Platform agents removed');
        } else {
          spinner.info('No agents to remove');
        }
      }

      // Create symlinks for selected platforms
      for (const platform of selectedPlatforms) {
        removeLegacySkillSymlinks(platform.skillsDir);
        spinner.start(`Linking ${platform.displayName}...`);
        const symlinkResult = await createSkillSymlinks(
          platform.skillsDir,
          SKILLS,
          baseDir
        );
      if (symlinkResult.linked.length === SKILLS.length) {
        spinner.succeed(`${platform.displayName}: Skills linked`);
      } else {
        spinner.warn(
          `${platform.displayName}: ${symlinkResult.linked.length}/${SKILLS.length} skills linked`
        );
      }
      }
    } else {
      const agentsResult = removeAgents(baseDir);
      const skillsResult = removeSkills(baseDir);
      const platformResults = detectedPlatforms.map((platform) => {
        const symlinkResult = removeSkillSymlinks(platform.skillsDir);
        return {
          displayName: platform.displayName,
          removedCount: symlinkResult.removed.length,
        };
      });
      const anyRemoved = platformResults.some((result) => result.removedCount > 0);

      if (skillsResult.removed.length > 0) {
        console.log(chalk.green('✓'), `${skillsResult.removed.length} skills removed`);
      } else {
        console.log(chalk.gray('ℹ'), 'No skills to remove');
      }

      if (agentsResult.removed.length > 0) {
        console.log(chalk.green('✓'), 'Platform agents removed');
      } else {
        console.log(chalk.gray('ℹ'), 'No agents to remove');
      }

      for (const result of platformResults) {
        if (result.removedCount > 0) {
          console.log(chalk.green('✓'), `${result.displayName}: Skills unlinked`);
        } else {
          console.log(chalk.gray('ℹ'), `${result.displayName}: No symlinks found`);
        }
      }
    }

    // Remove symlinks for unselected detected platforms
    if (!removeOnly) {
      for (const platform of detectedPlatforms) {
        if (selectedPlatformNames.has(platform.name)) continue;
        spinner.start(`Unlinking ${platform.displayName}...`);
        const symlinkResult = removeSkillSymlinks(platform.skillsDir);
        if (symlinkResult.removed.length > 0) {
          spinner.succeed(`${platform.displayName}: Skills unlinked`);
          removedPlatformNames.push(platform.displayName);
        } else {
          spinner.info(`${platform.displayName}: No symlinks found`);
        }
      }
    }

    // Summary
    console.log('');
    console.log(chalk.green('✓ Skills sync complete!'));
    console.log('');
    if (!removeOnly && selectedPlatforms.length > 0) {
      console.log(chalk.bold('▸'), 'Add AGENTS.md to the project:', chalk.cyan('titools agents'));
      console.log('');
    }

    if (!removeOnly && !isLocal && detectOS() === 'windows') {
      console.log(chalk.yellow('▸'), 'Windows: Ensure ~/bin is in your PATH');
      console.log('');
    }

  } finally {
    // Clean up temp directory if we downloaded
    if (tempDir) {
      await import('fs-extra').then(({ remove }) => remove(tempDir));
    }
  }
}

export default skillsCommand;
