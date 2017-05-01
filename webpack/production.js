const webpack = require('webpack');
const generateConfig = require('./generateConfig');
const config = generateConfig({ useExtractText: true });

module.exports = Object.assign(config, {
  devtool: false,

  plugins: config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        screw_ie8: true,
      },
      mangle: {
        keep_fnames: true,
        screw_ie8: true,
      },
      sourceMap: true,
    }),
  ])
});
