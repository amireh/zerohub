const { send } = require('services/CoreDelegate');
const invariant = require('invariant');

module.exports = function removePassPhrase({ key }) {
  invariant(typeof key === 'string' && key.length, '"key" must be a string');

  return send('REMOVE_PASS_PHRASE', { key })
}