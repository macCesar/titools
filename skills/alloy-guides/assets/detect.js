#!/usr/bin/env node

/**
 * Alloy Project Detection Script (for alloy-guides)
 *
 * This script detects if the current project is an Alloy project.
 * Same logic as alloy-expert but focused on MVC/framework questions.
 *
 * Usage: node detect.js [project_path]
 *
 * Returns: 0 if Alloy detected, 1 if not
 */

const fs = require('fs');
const path = require('path');

function detectAlloy(projectPath = process.cwd()) {
  const alloyIndicators = [
    path.join(projectPath, 'app'),
    path.join(projectPath, 'app', 'views'),
    path.join(projectPath, 'app', 'controllers'),
    path.join(projectPath, 'app', 'models'),
    path.join(projectPath, 'app', 'styles'),
  ];

  const alloyExists = alloyIndicators.filter(p => fs.existsSync(p));

  return {
    detected: alloyExists.length >= 3,
    indicators: alloyExists,
    confidence: alloyExists.length >= 4 ? 'high' : 'medium'
  };
}

// CLI usage
if (require.main === module) {
  const projectPath = process.argv[2] || process.cwd();
  const result = detectAlloy(projectPath);

  if (result.detected) {
    console.log(`Alloy MVC project detected (${result.confidence} confidence)`);
    process.exit(0);
  } else {
    console.log('NOT an Alloy MVC project');
    process.exit(1);
  }
}

module.exports = { detectAlloy };
