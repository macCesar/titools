/**
 * Skills command
 * Installs and manages skills in AI coding assistant directories
 */

import chalk from 'chalk';
import ora from 'ora';
import {
  SKILLS,
  getPlatforms,
  getAgentsSkillsDir,
} from '../config.js';
import select from '../prompts/selectCancel.js';
import checkbox, { Separator } from '../prompts/checkboxCancel.js';
import {
  detectPlatforms,
  detectOS,
} from '../platform.js';
import {
  getSkillList,
  removeSkillSymlinks,
  removeLegacySkillSymlinks,
  removeSkills,
  removeAgents,
  removeCommands,
  removeUnselectedSkills,
  removeUnselectedSymlinks,
  cleanupLegacyArtifacts,
} from '../cleanup.js';
import {
  installSkills,
  installAgents,
  installCommands,
  getLocalRepoDir,
} from '../installer.js';
import { agentsCommand } from './agents.js';
import { downloadRepoArchive } from '../downloader.js';
import { createSkillSymlinks } from '../symlink.js';
import { installHook } from '../hooks.js';
import {
  formatList,
  isTitaniumProject,
  readSkillDescription,
  shortenSkillDescription,
} from '../utils.js';
import { mkdtemp } from 'fs/promises';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { tmpdir } from 'os';

function hasAnySkillSymlink(platformSkillsDir) {
  if (!platformSkillsDir || !existsSync(platformSkillsDir)) return false;
  const skillList = getSkillList();
  return skillList.some((skill) => existsSync(join(platformSkillsDir, skill)));
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
  const skillsLocation = isLocal
    ? './.agents/skills/'
    : (customPath ? `${baseDir}/.agents/skills/` : '~/.agents/skills/');
  console.log('');
  console.log(
    chalk.yellow('▸'),
    'Skills install to',
    chalk.cyan.bold(skillsLocation),
    chalk.dim('(agentskills.io standard)')
  );
  console.log(
    '  ' + chalk.green('✓'),
    chalk.dim('Gemini, Codex, Cursor, Cline, Amp, GitHub Copilot +more read it directly —')
  );
  console.log('    ' + chalk.dim('nothing else to configure for them.'));
  console.log(
    '  ' + chalk.dim('Claude Code needs symlink mirrors, plus the ti-pro agent and the')
  );
  console.log(
    '  ' + chalk.dim('/ti-check, /ti-new-screen and /ti-audit slash commands — created below.')
  );
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
    console.log(chalk.yellow('No AI coding assistants detected globally that need platform symlinks.'));
    console.log('Install Claude Code if you want TiTools to create skill symlinks for it.');
    console.log('(Gemini CLI and Codex CLI auto-discover skills from ~/.agents/skills/ — no platform-specific symlink needed.)');
    console.log('Or use: titools install --local');
    process.exit(1);
  }

  // Show detected platforms
  // Only assistants that need TiTools-managed mirrors appear here, so a bare
  // "Claude Code detected" reads as if the others were looked for and not found.
  // They were never looked for: Gemini, Codex and the rest read
  // ~/.agents/skills/ directly and are already served by the install itself.
  if (detectedPlatforms.length > 0) {
    for (const platform of detectedPlatforms) {
      console.log(
        chalk.green('✓'),
        `${platform.displayName} detected`,
        chalk.dim('— needs mirrors, linked below')
      );
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

  // Skill selection prompt — pre-checks all skills; the user can uncheck the
  // ones they don't want. Skipped under --all (CI/automation) and removeOnly.
  // Each line shows the skill name + a one-liner hint in dim gray, like
  // skills.sh, so the rendered row height stays constant and the list does
  // not "jump" when the cursor moves between skills with different-length
  // descriptions.
  let skillsToInstall = SKILLS;
  if (!removeOnly && !options.all && !options.path) {
    const skillChoices = SKILLS.map((name) => {
      const fullDescription = readSkillDescription(repoDir, name);
      const hint = shortenSkillDescription(fullDescription);
      const label = hint
        ? `${name} ${chalk.dim(`(${hint})`)}`
        : name;
      return { name: label, value: name, short: name, checked: true };
    });

    try {
      const selected = await checkbox({
        message: 'Select skills to install:',
        choices: [...skillChoices, new Separator(' ')],
        theme: {
          style: {
            renderSelectedChoices: () => '',
            prefix: () => chalk.cyan('?'),
          },
        },
      });

      if (selected.includes('cancel')) {
        console.log('Cancelled.');
        process.exit(0);
      }

      skillsToInstall = SKILLS.filter((s) => selected.includes(s));
    } catch (error) {
      console.log('\nCancelled.');
      process.exit(0);
    }

    if (skillsToInstall.length === 0) {
      console.log(chalk.yellow('No skills selected. Nothing to install.'));
      process.exit(0);
    }
  }

  const selectedPlatformNames = new Set(selectedPlatforms.map((platform) => platform.name));
  const removedPlatformNames = [];
  const claudeSelected = selectedPlatformNames.has('claude');

  try {
    if (!removeOnly) {
      // Install skills
      spinner.start('Installing skills...');
      const skillsResult = await installSkills(repoDir, baseDir, skillsToInstall);
      spinner.succeed(`${skillsToInstall.length} skill${skillsToInstall.length !== 1 ? 's' : ''} installed`);

      // If the user deselected some skills, sweep any previously-installed
      // copies and their platform symlinks so on-disk state matches selection.
      if (skillsToInstall.length !== SKILLS.length) {
        removeUnselectedSkills(baseDir, skillsToInstall);
      }

      // Sweep legacy skills, legacy agents, and redundant symlinks at platforms
      // that no longer need TiTools-managed mirrors (Gemini, Codex). Without
      // this, users that ran older TiTools versions keep stale symlinks at
      // ~/.gemini/skills/ and ~/.codex/skills/ that Gemini reports as "Skill
      // conflict detected" warnings on startup.
      cleanupLegacyArtifacts(baseDir);

      if (claudeSelected) {
        // Install agents
        spinner.start('Installing agents...');
        const agentsResult = await installAgents(repoDir, baseDir);
        if (agentsResult.installed.length > 0) {
          spinner.succeed('Platform agents installed');
        } else {
          spinner.info('No agents to install (Claude Code not detected)');
        }
        // Install slash commands (/ti-check, /ti-new-screen, /ti-audit).
        // Claude Code only — they live in ~/.claude/commands/ and are skipped
        // when the marketplace plugin already serves them.
        spinner.start('Installing slash commands...');
        const commandsResult = await installCommands(repoDir, baseDir);
        if (commandsResult.installed.length > 0) {
          spinner.succeed(
            `${commandsResult.installed.length} slash command${commandsResult.installed.length !== 1 ? 's' : ''} installed`
          );
        } else if (commandsResult.skipped.length > 0) {
          spinner.info(
            `${commandsResult.skipped.length} slash command${commandsResult.skipped.length !== 1 ? 's' : ''} already provided by the marketplace plugin`
          );
        } else {
          spinner.info('No slash commands to install');
        }
      } else {
        spinner.start('Removing agents...');
        const agentsResult = removeAgents(baseDir);
        if (agentsResult.removed.length > 0) {
          spinner.succeed('Platform agents removed');
        } else {
          spinner.info('No agents to remove');
        }

        // Slash commands are Claude-only, so they follow the agents: if Claude
        // is not among the selected platforms, nothing should be left behind.
        const commandsResult = removeCommands(baseDir);
        if (commandsResult.removed.length > 0) {
          spinner.succeed('Slash commands removed');
        }
      }

      // Create symlinks for selected platforms
      for (const platform of selectedPlatforms) {
        removeLegacySkillSymlinks(platform.skillsDir);
        if (skillsToInstall.length !== SKILLS.length) {
          removeUnselectedSymlinks(platform.skillsDir, skillsToInstall);
        }
        spinner.start(`Linking ${platform.displayName}...`);
        const symlinkResult = await createSkillSymlinks(
          platform.skillsDir,
          skillsToInstall,
          baseDir
        );
        // Skills the marketplace plugin already serves are skipped on purpose,
        // so they must not count against the expected total — otherwise a
        // healthy install with the plugin enabled reports a warning.
        const expected = skillsToInstall.length - symlinkResult.skipped.length;
        const pluginNote = symlinkResult.skipped.length > 0
          ? ` (${symlinkResult.skipped.length} served by the marketplace plugin)`
          : '';
        if (expected === 0) {
          spinner.info(
            `${platform.displayName}: all skills served by the marketplace plugin`
          );
        } else if (symlinkResult.linked.length === expected) {
          spinner.succeed(`${platform.displayName}: Skills linked${pluginNote}`);
        } else {
          spinner.warn(
            `${platform.displayName}: ${symlinkResult.linked.length}/${expected} skills linked${pluginNote}`
          );
        }
      }

      // Install Claude Code auto-update hook
      if (claudeSelected) {
        const claudePlatform = selectedPlatforms.find((p) => p.name === 'claude');
        if (claudePlatform) {
          const claudeConfigDir = join(claudePlatform.skillsDir, '..');
          installHook(claudeConfigDir);
          spinner.succeed('Claude Code: Auto-update hook installed');
        }
      }
    } else {
      const agentsResult = removeAgents(baseDir);
      const commandsResult = removeCommands(baseDir);
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

      if (commandsResult.removed.length > 0) {
        console.log(chalk.green('✓'), `${commandsResult.removed.length} slash commands removed`);
      } else {
        console.log(chalk.gray('ℹ'), 'No slash commands to remove');
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

    // Summary — show where the skills landed and which agents read them.
    // This is the "did it actually work" confirmation the user needs.
    console.log('');
    console.log(chalk.green('✓ skills sync complete!'));
    if (!removeOnly) {
      console.log('');
      console.log(
        '  ' + chalk.bold(skillsLocation) + chalk.dim('  (') +
        chalk.dim(skillsToInstall.length + ' skill' + (skillsToInstall.length !== 1 ? 's' : '')) +
        chalk.dim(')')
      );
      console.log(
        '  ' + chalk.dim('• universal: ') +
        'Gemini, Codex, Cursor, Cline, Amp, GitHub Copilot ' + chalk.dim('+more')
      );
      if (claudeSelected) {
        console.log(
          '  ' + chalk.dim('• symlinked: ') +
          'Claude Code ' + chalk.dim('(~/.claude/skills/)')
        );
        console.log(
          '  ' + chalk.dim('• commands:  ') +
          '/ti-check, /ti-new-screen, /ti-audit ' + chalk.dim('(~/.claude/commands/)')
        );
      }
    }
    console.log('');
    const isProjectDir = isTitaniumProject(process.cwd());
    if (!removeOnly && selectedPlatforms.length > 0 && isProjectDir) {
      if (process.stdin.isTTY) {
        await agentsCommand(process.cwd(), { inline: true });
      } else {
        console.log(
          chalk.bold('▸'),
          'Sync knowledge index files (AGENTS.md/CLAUDE.md/GEMINI.md):',
          chalk.cyan('titools sync')
        );
        console.log('');
      }
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
