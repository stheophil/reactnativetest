const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const monorepoRoot = path.resolve(__dirname, '../..'); 
const appDirectory = path.resolve(__dirname, '.');
const packagesWorkspace = path.resolve(monorepoRoot, "common");
const appNodeModules = path.resolve(__dirname, 'node_modules');

const babelConfig = require('./babel.config');

// Babel loader configuration
const babelLoaderConfiguration = {
  test: /\.(tsx|jsx|ts|js)?$/,
  include: [
    path.resolve(appDirectory),   // the app itself
    packagesWorkspace            // your shared packages
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      // Presets and plugins imported from main babel.config.js in root dir
      presets: babelConfig.presets,
      plugins: ['react-native-web', ...(babelConfig.plugins || [])],
    },
  },
};

// Image loader configuration
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

// File loader configuration
const fileLoaderConfiguration = {
  test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'fonts/',
      },
    },
  ],
};

module.exports = argv => {
  return {
    entry: path.resolve(appDirectory, 'index'),
    output: {
      clean: true,
      path: path.resolve(appDirectory, 'dist'),
      filename: '[name].[chunkhash].js',
      sourceMapFilename: '[name].[chunkhash].map',
      chunkFilename: '[id].[chunkhash].js',
    },
    resolve: {
      extensions: ['.web.js','.js','.web.ts','.ts','.web.jsx','.jsx','.web.tsx','.tsx'],
      // Always try the app's node_modules first
      modules: [appNodeModules, 'node_modules'],
      symlinks: true, // follow workspace symlinks (default true)
      alias: {
        // React stack: ensure one physical copy
        react: path.resolve(appNodeModules, 'react'),
        'react-dom': path.resolve(appNodeModules, 'react-dom'),
        'react-native': path.resolve(appNodeModules, 'react-native'),
        'react-native-web': path.resolve(appNodeModules, 'react-native-web'),

        // Often-used RN libs (add as you adopt them)
        '@react-native': path.resolve(appNodeModules, '@react-native'),
        '@react-native-community': path.resolve(appNodeModules, '@react-native-community'),

        // Your org namespace: import '@your-org/foo' from packages/foo/src
        // (adjust if your packages build to dist/)
        '@org': packagesWorkspace,
      },
    },
    module: {
      rules: [
        babelLoaderConfiguration,
        imageLoaderConfiguration,
        fileLoaderConfiguration,
      ],
    },
    plugins: [
      // Fast refresh plugin
      new ReactRefreshWebpackPlugin(),

      // Plugin that takes public/index.html and injects script tags with the built bundles
      new HtmlWebpackPlugin({
        template: path.resolve(appDirectory, 'index.html'),
      }),

      // Defines __DEV__ and process.env as not being null
      new webpack.DefinePlugin({
        __DEV__: argv.mode !== 'production' || true,
        process: {env: {}},
      }),
    ],
    optimization: {
      // Split into vendor and main js files
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'initial',
          },
        },
      },
    },
  };
};