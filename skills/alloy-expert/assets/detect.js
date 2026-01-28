#!/usr/bin/env node

/**
 * Alloy Project Detection Script
 *
 * This script detects if the current project is an Alloy project by checking:
 * 1. app/ folder exists (Alloy structure)
 * 2. app/views/ folder exists
 * 3. app/controllers/ folder exists
 * 4. alloy.jmk or config.json exists
 * 5. NOT a classic Titanium project (no Resources/*.js directly at root)
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
    path.join(projectPath, 'app', 'styles'),
    path.join(projectPath, 'alloy.jmk'),
    path.join(projectPath, 'config.json'),
  ];

  const classicIndicators = [
    path.join(projectPath, 'Resources'),
    path.join(projectPath, 'Resources', 'app.js'),
  ];

  const alloyExists = alloyIndicators.filter(p => fs.existsSync(p));
  const classicExists = classicIndicators.filter(p => fs.existsSync(p));

  // Alloy project: has app/ folder with views/controllers, NOT classic structure
  const isAlloy = alloyExists.length >= 3 && classicExists.length < 2;

  return {
    detected: isAlloy,
    type: isAlloy ? 'alloy' : classicExists.length >= 2 ? 'classic' : 'unknown',
    alloyIndicators: alloyExists,
    classicIndicators: classicExists,
    confidence: alloyExists.length >= 4 ? 'high' : alloyExists.length >= 3 ? 'medium' : 'none'
  };
}

// CLI usage
if (require.main === module) {
  const projectPath = process.argv[2] || process.cwd();
  const result = detectAlloy(projectPath);

  if (result.detected) {
    console.log(`Alloy project detected (${result.confidence} confidence)`);
    console.log('Type:', result.type);
    process.exit(0);
  } else {
    console.log(`NOT an Alloy project (detected: ${result.type})`);
    process.exit(1);
  }
}

module.exports = { detectAlloy };
