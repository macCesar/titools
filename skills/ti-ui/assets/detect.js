#!/usr/bin/env node

/**
 * Titanium Project Detection Script (for ti-ui)
 *
 * This script detects if the current project is a Titanium project
 * (Alloy OR Classic) - UI patterns apply to both.
 *
 * Usage: node detect.js [project_path]
 *
 * Returns: 0 if Titanium project detected, 1 if not
 */

const fs = require('fs');
const path = require('path');

function detectTitanium(projectPath = process.cwd()) {
  const indicators = [
    // Titanium Classic indicators
    path.join(projectPath, 'tiapp.xml'),
    path.join(projectPath, 'Resources'),
    // Alloy indicators
    path.join(projectPath, 'app'),
    // Build/config files
    path.join(projectPath, 'build.log'),
  ];

  const exists = indicators.filter(p => fs.existsSync(p));

  // Must have tiapp.xml (required for Titanium projects)
  const hasTiappXml = fs.existsSync(path.join(projectPath, 'tiapp.xml'));

  return {
    detected: hasTiappXml,
    isTitanium: hasTiappXml,
    indicators: exists,
    type: exists.find(p => p.includes('app')) ? 'alloy' :
           exists.find(p => p.includes('Resources')) ? 'classic' :
           hasTiappXml ? 'titanium' : 'unknown',
    confidence: hasTiappXml ? 'high' : 'none'
  };
}

// CLI usage
if (require.main === module) {
  const projectPath = process.argv[2] || process.cwd();
  const result = detectTitanium(projectPath);

  if (result.detected) {
    console.log(`Titanium project detected (${result.type}, ${result.confidence} confidence)`);
    process.exit(0);
  } else {
    console.log('NOT a Titanium project');
    process.exit(1);
  }
}

module.exports = { detectTitanium };
