const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const fs = require('fs');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const rnwPath = fs.realpathSync(
  path.resolve(require.resolve('react-native-windows/package.json'), '..'),
);

const monorepoRoot = path.resolve(__dirname, '../..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    // Add the monorepo root to the watch folders
    monorepoRoot,
  ],
  resolver: {
    // Make sure Metro can resolve modules from the root node_modules
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    sourceExts: [...require('metro-config/src/defaults/defaults').sourceExts, 'mjs', 'cjs'],
    unstable_enablePackageExports: true,
    blockList: exclusionList([
      // This stops "npx @react-native-community/cli run-windows" from causing the metro server to crash if its already running
      new RegExp(
        `${path.resolve(__dirname, 'windows').replace(/[/\\]/g, '/')}.*`,
      ),
      // This prevents "npx @react-native-community/cli run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip or other files produced by msbuild
      new RegExp(`${rnwPath}/build/.*`),
      new RegExp(`${rnwPath}/target/.*`),
      /.*\.ProjectImports\.zip/,
    ]),
    // Ensure that only one copy of react and react-native is used
    extraNodeModules: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);