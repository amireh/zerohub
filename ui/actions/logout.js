const { setApiToken } = require('services/PageHub');
const { send } = require('services/CoreDelegate');

module.exports = function logout() {
  return send('UPDATE_SETTINGS', {
    apiToken: null
  }).then(() => {
    setApiToken(null);
  });
}