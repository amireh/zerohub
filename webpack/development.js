const generateConfig = require('./generateConfig');

module.exports = Object.assign({}, generateConfig({}), {
  devtool: 'eval',
});
