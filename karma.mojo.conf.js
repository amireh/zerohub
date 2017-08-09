const webpack = require('webpack')
const config = loadKarmaConfig(require('./karma.conf.js'));
const mojoRunner = process.env.MOJO_RUNNER_PATH;

// 1. Register the "karma-mojo" plugin:
config.plugins.push('karma-mojo');

config.reporters = [
  'mojo',

  // You can use your regular reporters too like "progress" or "dot" or "spec":
  'progress'
];

// 4. Configure Mojo with the defaults then customize later if needed:
config.mojo = require('karma-mojo').defaults;

// [Optional]
//
// You can customize Mojo's defaults here:
config.mojo.pattern = [ 'ui/**/__tests__/*.test.js' ];

// This is an example of utilizing the environment variables that are exposed by
// the "mojo" binary to let the user override defaults through the command-line:
config.mojo.grepDir = process.env.MOJO_GREP_DIR || 'ui';

Object.assign(config, {
  files: [
    {
      pattern: 'ui/index--test.js',
      watched: false,
      included: true,
      served: true,
    },
    {
      pattern: 'ui/index--test-mojo-entry.js',
      watched: false,
      included: true,
      served: true,
    },
    {
      pattern: mojoRunner,
      watched: false,
      included: true,
      served: true,
    }
  ],

  preprocessors: {
    'ui/index--test.js': [ 'electron' ],
    'ui/index--test-mojo-entry.js': [ 'webpack', 'sourcemap' ],
  },
})

config.preprocessors[mojoRunner] = [ 'webpack', 'sourcemap' ];
// config.webpack.plugins.push(new webpack.DefinePlugin({
//   'process.env.MOJO_RUNNER': JSON.stringify(mojoRunner)
// }))

// [Optional]
//
// Mojo will be invoking the executor manually, no need for autoWatch.
config.autoWatch = false;
config.autoWatchBatchDelay = 0;

module.exports = function(karma) {
  karma.set(config);
};

// We need some tricks to import karma's base config because it exports a
// function instead of a plain object so you can use this helper function to
// do that.
//
// A cleaner option would be to create a file that contains the "base" config
// which both karma.conf.js and karma.mojo.conf.js can end up using. That file
// would export a normal object in turn.
function loadKarmaConfig(karmaConfig) {
  var x;

  karmaConfig({
    set: function(baseConfig) {
      x = baseConfig;
    }
  });

  return x;
}