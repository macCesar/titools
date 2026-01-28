#!/usr/bin/env node

/**
 * Alloy Project Detection Script (for alloy-howtos)
 *
 * This script detects if the current project is an Alloy project.
 * Same as other alloy-* skills.
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
    path.join(projectPath, 'alloy.jmk'),
    path.join(projectPath, 'config.json'),
  ];

  const classicIndicators = [
    path.join(projectPath, 'Resources', 'app.js'),
  ];

  const alloyExists = alloyIndicators.filter(p => fs.existsSync(p));
  const classicExists = classicIndicators.filter(p => fs.existsSync(p));

  const isAlloy = alloyExists.length >= 2 && classicExists.length === 0;

  return {
    detected: isAlloy,
    type: isAlloy ? 'alloy' : classicExists.length > 0 ? 'classic' : 'unknown',
    alloyIndicators: alloyExists,
    confidence: alloyExists.length >= 3 ? 'high' : 'medium'
  };
}

// CLI usage
if (require.main === module) {
  const projectPath = process.argv[2] || process.cwd();
  const result = detectAlloy(projectPath);

  if (result.detected) {
    console.log(`Alloy project detected (${result.confidence} confidence)`);
    process.exit(0);
  } else {
    console.log(`NOT an Alloy project (detected: ${result.type})`);
    process.exit(1);
  }
}

module.exports = { detectAlloy };
