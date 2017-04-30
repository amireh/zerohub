const { send } = require('services/CoreDelegate');

module.exports = function retrieveAllPassPhrases({ userId, spaceIds }) {
  return send('RETRIEVE_ALL_PASS_PHRASES', { userId, spaceIds }).then(payload => {
    return payload.passPhrases;
  })
}