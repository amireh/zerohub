const { send } = require('services/CoreDelegate');

module.exports = function retrieveCredentials() {
  return send('RETRIEVE_SETTINGS').then(settings => settings.apiToken);
}