#!/usr/bin/env node

// This script provides an HTTP server that runs webpack and serves the bundle
// with hot-code reloading. Very nice during development.
//
// See README.md for notes on how to use this.

const path = require('path');
const connect = require('connect');
const webpack = require('webpack');
const modRewrite = require('connect-modrewrite');
const pushState = require('connect-pushstate');
const root = path.resolve(__dirname, '..');

const webpackConfig = Object.assign({}, require(path.join(root, 'webpack.config')));
const app = connect();
const contentBase = path.join(root, 'www');
const host = ensureHasScheme(process.env.HOST || 'localhost');
const port = parseInt(process.env.PORT, 10) || 9999;
const hostString = `${host}:${port}`;
// const apiHost = process.env.API_HOST || 'http://localhost:5430';

webpackConfig.entry = [
  `webpack-hot-middleware/client?path=${hostString}/__webpack_hmr`
].concat( webpackConfig.entry );
webpackConfig.output.publicPath = `${hostString}/dist/`;
webpackConfig.plugins = (webpackConfig.plugins || []).concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
]);

webpackConfig.module.rules.forEach(function(rule) {
  if (rule.test && rule.test.toString().match(/\.js\b/)) {
    rule.loaders.unshift('react-hot-loader');
  }
});

var compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
  contentBase: contentBase,
  publicPath: webpackConfig.output.publicPath,
  hot: false,
  quiet: false,
  noInfo: false,
  lazy: false,
  inline: false,
  watchOptions: {
    aggregateTimeout: 300,
  },
  stats: { colors: true },
  historyApiFallback: false,
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(modRewrite([
  '^/dist/crypthub-style.css$ - [G]',
  // `^/api/(.*)$ ${apiHost}/api/$1 [P]`
]));

app.use(pushState());

app.use(require('serve-static')(contentBase));

app.listen(port, host.replace(/^http:\/\//, ''));

function ensureHasScheme(string) {
  return string.indexOf('http://') === 0 ? string : `http://${string}`;
}