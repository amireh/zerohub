const { send } = require('services/CoreDelegate');

module.exports = function storeCredentials(container, { apiToken }) {
  return send('UPDATE_SETTINGS', {
    apiToken
  })
}