// @ts-check
/* eslint-disable n/no-sync */

const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const packageFile = require('../packages/snap/package.json');

console.log('[preinstalled-snap] - attempt to build preinstalled snap');

/**
 * Read the contents of a file and return as a string.
 * @param {string} filePath - Path to file.
 * @returns {string} File as utf-8 string.
 */
function readFileContents(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file from disk: ${filePath}`, error);
    throw error;
  }
}

// Paths to the files
const bundlePath = require.resolve('../packages/snap/dist/bundle.js');
const iconPath = require.resolve('../packages/snap/images/icon.svg');
const manifestPath = require.resolve('../packages/snap/snap.manifest.json');

// File Contents
const bundle = readFileContents(bundlePath);
const icon = readFileContents(iconPath);
const manifest = readFileContents(manifestPath);

/** @type {import('@metamask/snaps-controllers').PreinstalledSnap.snapId} */
const snapId = `npm:${packageFile.name}`;

/**
 * @type {import('@metamask/snaps-controllers').PreinstalledSnap}
 */
const preinstalledSnap = {
  snapId,
  manifest: JSON.parse(manifest),
  files: [
    {
      path: 'images/icon.svg',
      value: icon,
    },
    {
      path: 'dist/bundle.js',
      value: bundle,
    },
  ],
  removable: false,
};

// Write preinstalled-snap file
try {
  // Preinstalled Snap File
  const outputPath = join(
    __dirname,
    '../packages/snap/dist/preinstalled-snap.json',
  );
  writeFileSync(outputPath, JSON.stringify(preinstalledSnap, null, 0));

  console.log(
    `[preinstalled-snap] - successfully created preinstalled snap at ${outputPath}`,
  );
} catch (error) {
  console.error('Error writing combined file to disk:', error);
  throw error;
}
