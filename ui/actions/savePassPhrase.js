const { send } = require('services/CoreDelegate');
const invariant = require('invariant');

module.exports = function savePassPhrase({ key, value }) {
  invariant(typeof key === 'string' && key.length, '"key" must be a string');
  invariant(typeof value === 'string' && value.length, '"value" must be a string');

  return send('SAVE_PASS_PHRASE', { key, value })
}