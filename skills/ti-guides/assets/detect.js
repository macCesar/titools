#!/usr/bin/env node

/**
 * Titanium Project Detection Script (for ti-guides)
 *
 * This script detects if the current project is a Titanium project.
 * Same as ti-ui but focused on guides/best practices.
 *
 * Usage: node detect.js [project_path]
 *
 * Returns: 0 if Titanium project detected, 1 if not
 */

const fs = require('fs');
const path = require('path');

function detectTitanium(projectPath = process.cwd()) {
  // tiapp.xml is THE definitive indicator of a Titanium project
  const hasTiappXml = fs.existsSync(path.join(projectPath, 'tiapp.xml'));

  // Additional indicators for confidence
  const indicators = [
    path.join(projectPath, 'tiapp.xml'),
    path.join(projectPath, 'app'), // Alloy
    path.join(projectPath, 'Resources'), // Classic
  ];

  const exists = indicators.filter(p => fs.existsSync(p));

  return {
    detected: hasTiappXml,
    isTitanium: hasTiappXml,
    indicators: exists,
    confidence: hasTiappXml ? 'high' : 'none'
  };
}

// CLI usage
if (require.main === module) {
  const projectPath = process.argv[2] || process.cwd();
  const result = detectTitanium(projectPath);

  if (result.detected) {
    console.log(`Titanium project detected (${result.confidence} confidence)`);
    process.exit(0);
  } else {
    console.log('NOT a Titanium project');
    process.exit(1);
  }
}

module.exports = { detectTitanium };
