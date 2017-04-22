const path = require('path');

module.exports = function (config) {
  config.set({
    plugins: [
      'karma-electron',
      'karma-mocha',
      'karma-spec-reporter',
      'karma-webpack',
      'karma-sourcemap-loader',
    ],

    browsers: [ 'VisibleElectron'/*, 'chrome_without_security' */ ],
    browserConsoleLogOptions: {
      level: 'debug',
      terminal: true,
    },
    browserDisconnectTolerance: 0,
    browserNoActivityTimeout: 2000,
    concurrency: 1,
    customLaunchers: {
      VisibleElectron: {
        base: 'Electron',
        flags: [
          '--show',
          `--entry=${path.resolve(__dirname, 'ui/index--test-core-entry.js')}`,
          '--enable-logging'
        ],
      }
    },

    frameworks: [
      'mocha'
    ],

    files: [
      {
        pattern: 'ui/index--test.js',
        watched: false,
        included: true,
        served: true,
      },
      {
        pattern: 'ui/index--test-entry.js',
        watched: false,
        included: true,
        served: true,
      },
    ],

    preprocessors: {
      'ui/index--test.js': [ 'electron' ],
      'ui/index--test-entry.js': [ 'webpack', 'sourcemap' ],
    },

    reporters: [ 'spec' ],

    webpack: require('./webpack/test.js'),

    client: {
      captureConsole: true,
      clearContext: true,
      useIframe: false,
      runInParent: true,
      loadScriptsViaRequire: true,
    },

    webpackServer: {
      noInfo: true
    }
  });
};
