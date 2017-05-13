const path = require('path');
const webpack = require('webpack');
const root = path.resolve(__dirname, '..');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function generateConfig({
  useExtractText = false
}) {
  const config = {};
  const publicPath = '';

  config.plugins = [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ].concat([
    useExtractText && new ExtractTextPlugin({
      filename: '[name].css',
    }),
  ]).filter(x => !!x);

  if (useExtractText) {
    config.entry = {
      'zerohub-ui': path.join(root, 'ui/index.js'),
      'zerohub-style': path.join(root, 'ui/css/index.less'),
    }
  }
  else {
    config.entry = {
      'zerohub-ui': [
        path.join(root, 'ui/index.js'),
        path.join(root, 'ui/css/index.less'),
      ]
    }
  }

  config.node = {
    process: false,
    Buffer: false,
    global: false,
    __filename: false,
    __dirname: false,
  }

  config.output = {
    path: path.join(root, 'www/dist'),
    filename: '[name].js',
    publicPath,
  };

  config.resolve = {
    modules: [
      path.join(root, 'ui'),
      path.join(root, 'ui/shimmed_modules'),
      path.join(root, 'node_modules'),
    ],
  };

  config.module = {
    rules: [
      {
        test: /\.js$/,
        use: [ 'babel-loader' ],
        include: [
          path.join(root, 'ui'),
          path.join(root, 'node_modules/cornflux/src'),
        ]
      },

      {
        test: /\.less$/,
        include: [
          path.join(root, 'ui/css'),
        ],
        use: useExtractText ? (
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            publicPath: publicPath,
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
                  sourceMap: false,
                }
              },
              {
                loader: 'less-loader'
              }
            ],
          })
        ) : (
          [ 'style-loader', 'css-loader', 'less-loader' ]
        )
      },

      {
        test: /\.(png|woff|woff2|eot|ttf|otf|svg)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader',
        options: {
          limit: 100000,
          publicPath,
        },
        include: [
          path.join(root, 'ui/css/fonts')
        ]
      },
    ]
  }

  return config;
}