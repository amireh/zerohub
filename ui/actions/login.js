const { request, setApiToken } = require('services/PageHub');
const { send } = require('services/CoreDelegate');

module.exports = function login(container, { apiToken }) {
  setApiToken(apiToken);

  return request({ url: '/api/users/self' }).then(payload => {
    return send('UPDATE_SETTINGS', { apiToken }).then(() => payload);
  });
};