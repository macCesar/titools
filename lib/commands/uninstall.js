/**
 * Uninstall command
 * Removes installed skills and agents
 */

import chalk from 'chalk';
import ora from 'ora';
import { SKILLS } from '../config.js';
import {
  detectPlatforms,
} from '../platform.js';
import {
  removeSkillSymlinks,
  removeSkills,
  removeAgents,
} from '../cleanup.js';
import checkbox, { Separator } from '../prompts/checkboxCancel.js';
import {
  isTitaniumProject,
  blockExists,
  removeOldBlock,
} from '../utils.js';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { getAgentsSkillsDir, getClaudeAgentsDir } from '../config.js';
import { getSkillList, getAgentList } from '../cleanup.js';

/**
 * Uninstall command handler
 * @param {Object} options - Command options
 */
export async function uninstallCommand(options) {
  console.log('');
  console.log(chalk.bold.blue('Titanium SDK Skills Uninstaller'));
  console.log('');

  const projectDir = resolve(process.cwd());
  const isProject = isTitaniumProject(projectDir);
  const baseDir = options.local ? projectDir : undefined;
  if (options.local) {
    console.log(chalk.cyan('Mode: Local uninstallation (current project)'));
    console.log('');
  }

  // Detect installed platforms
  const detectedPlatforms = detectPlatforms(baseDir);

  const knowledgeFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'];
  const existingKnowledgeFiles = knowledgeFiles
    .map((file) => ({ file, path: join(projectDir, file) }))
    .filter(({ path }) => existsSync(path));
  const hasKnowledgeBlocks = isProject && existingKnowledgeFiles.some(({ path }) => blockExists(path));

  const skillList = getSkillList();
  const agentList = getAgentList().map((agent) => `${agent}.md`);
  const homeSkillsDir = getAgentsSkillsDir();
  const projectSkillsDir = getAgentsSkillsDir(projectDir);
  const homeAgentsDir = getClaudeAgentsDir();
  const projectAgentsDir = getClaudeAgentsDir(projectDir);

  const hasAnyInDir = (dir, names) =>
    !!dir && existsSync(dir) && names.some((name) => existsSync(join(dir, name)));

  const hasHomeSkills = hasAnyInDir(homeSkillsDir, skillList);
  const hasProjectSkills = isProject && hasAnyInDir(projectSkillsDir, skillList);
  const hasHomeAgents = hasAnyInDir(homeAgentsDir, agentList);
  const hasProjectAgents = isProject && hasAnyInDir(projectAgentsDir, agentList);

  const hasHomeSymlinks = detectedPlatforms.some((platform) =>
    hasAnyInDir(platform.skillsDir, skillList)
  );
  const hasProjectSymlinks = isProject && detectPlatforms(projectDir).some((platform) =>
    hasAnyInDir(platform.skillsDir, skillList)
  );

  const choices = [];
  if (hasHomeAgents || hasProjectAgents) {
    choices.push({ name: '`ti-pro` for Claude Code', value: 'agents', checked: true });
  }
  if (hasKnowledgeBlocks) {
    choices.push({ name: 'Knowledge index from context files', value: 'knowledge', checked: true });
  }
  if (hasHomeSkills) {
    choices.push({ name: 'Skills from the `home` directory', value: 'skills-home', checked: false });
  }
  if (hasProjectSkills) {
    choices.push({ name: 'Skills from the `project` directory', value: 'skills-project', checked: false });
  }
  if (hasHomeSymlinks) {
    choices.push({ name: 'Skill symlinks from `home` directory', value: 'symlinks-home', checked: false });
  }
  if (hasProjectSymlinks) {
    choices.push({ name: 'Skill symlinks from `project` directory', value: 'symlinks-project', checked: false });
  }

  if (choices.length === 0) {
    console.log(chalk.yellow('No skills, agents, symlinks, or knowledge index blocks found.'));
    console.log('');
    return;
  }

  // Modern functional checkbox selection
  let targets = [];
  try {
    targets = await checkbox({
      message: 'What do you want to uninstall:',
      choices: [
        ...choices,
        new Separator(' '),
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

  if (targets.length === 0) {
    console.log(chalk.yellow('Nothing to uninstall. Cancelled.'));
    return;
  }

  const spinner = ora();
  let actionTaken = false;

  if (targets.includes('symlinks-home')) {
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

  if (targets.includes('symlinks-project')) {
    const projectPlatforms = detectPlatforms(projectDir);
    for (const platform of projectPlatforms) {
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

  if (targets.includes('skills-home')) {
    spinner.start('Removing skills...');
    const skillsResult = removeSkills(undefined);

    if (skillsResult.removed.length > 0) {
      spinner.succeed(`${SKILLS.length} skills removed`);
      actionTaken = true;
    } else {
      spinner.info('No skills to remove');
    }
  }

  if (targets.includes('skills-project')) {
    spinner.start('Removing skills...');
    const skillsResult = removeSkills(projectDir);

    if (skillsResult.removed.length > 0) {
      spinner.succeed(`${SKILLS.length} skills removed`);
      actionTaken = true;
    } else {
      spinner.info('No skills to remove');
    }
  }

  if (targets.includes('agents')) {
    spinner.start('Removing agents...');
    const results = [];
    results.push(removeAgents(undefined));
    if (isProject) {
      results.push(removeAgents(projectDir));
    }

    const removed = results.flatMap((r) => r.removed);
    if (removed.length > 0) {
      spinner.succeed('Platform agents removed');
      actionTaken = true;
    } else {
      spinner.info('No agents to remove');
    }
  }

  // Remove knowledge index blocks from project files
  if (targets.includes('knowledge')) {
    if (!isProject) {
      spinner.info('Not a Titanium project, skipping knowledge cleanup');
    } else {
      spinner.start('Removing knowledge index...');
      const cleaned = [];
      for (const { file, path } of existingKnowledgeFiles) {
        if (blockExists(path)) {
          try {
            removeOldBlock(path);
            cleaned.push(file);
          } catch {
            // Ignore; we only report if no files were cleaned
          }
        }
      }

      if (cleaned.length > 0) {
        spinner.succeed(`Knowledge index removed from: ${cleaned.join(', ')}`);
        actionTaken = true;
      } else {
        spinner.info('No knowledge index blocks to remove');
      }
    }
  }

  if (actionTaken) {
    console.log('');
    console.log(chalk.green('✓ Uninstallation complete!'));
    console.log('');
    if (isProject && !targets.includes('knowledge')) {
      console.log(chalk.gray('Note: Knowledge index blocks were not removed.'));
      console.log('');
    }
    console.log('');
  } else {
    console.log('');
    console.log(chalk.yellow('No changes were necessary.'));
    console.log('');
  }
}

export default uninstallCommand;
