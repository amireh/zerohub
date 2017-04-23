const path = require('path');
const webpack = require('webpack');
const root = path.resolve(__dirname, '..');

module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? null : 'eval',

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],

  entry: [
    path.join(root, 'ui/index.js'),
    path.join(root, 'ui/css/index.less'),
  ],

  output: {
    path: path.join(root, 'www/dist'),
    filename: 'zerohub-ui.js',
  },

  resolve: {
    modules: [
      path.join(root, 'ui'),
      path.join(root, 'ui/shimmed_modules'),
      path.join(root, 'node_modules'),
    ],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: [ 'babel-loader' ],
        include: [
          path.join(root, 'ui'),
          path.join(root, 'node_modules/cornflux/src'),
        ]
      },

      {
        test: /\.less$/,
        loaders: [ 'style-loader', 'css-loader', 'less-loader' ],
        include: [
          path.join(root, 'ui/css'),
        ],
      },

      {
        test: /\.(png|woff|woff2|eot|ttf|otf|svg)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader?limit=100000&publicPath=dist/',
        include: [
          path.join(root, 'ui/css/fonts')
        ]
      },
    ]
  }
};
