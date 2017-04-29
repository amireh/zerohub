#!/usr/bin/env node

// This script provides an HTTP server that runs webpack and serves the bundle
// with hot-code reloading. Very nice during development.
//
// See README.md for notes on how to use this.

const path = require('path');
const connect = require('connect');
const webpack = require('webpack');
const baseWebpackConfig = require('./development');
const app = connect();
const contentBase = path.resolve(__dirname, '..', 'public');
const host = process.env.HOT_CLIENT_HOST || 'http://localhost:3001';
const webpackConfig = monkeyPatchWebpackConfig(baseWebpackConfig);
const compiler = webpack(webpackConfig);

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
  serverSideRender: false,
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use(require('serve-static')(contentBase));

app.listen(host.match(/:(\d+)/)[1]);

function monkeyPatchWebpackConfig(config) {
  config.entry.unshift('react-hot-loader/patch');
  config.entry.unshift('webpack-hot-middleware/client?path=' + host + '/__webpack_hmr');

  config.output.publicPath = `${host}/dist/`;

  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  config.module.rules.forEach(function(loader, index) {
    if (index === 0) {
      loader.use.unshift('react-hot-loader/webpack');
    }
  });

  return config;
}