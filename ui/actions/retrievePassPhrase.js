const { send } = require('services/CoreDelegate');
const invariant = require('invariant');

module.exports = function retrievePassPhrase(container, { key }) {
  invariant(typeof key === 'string' && key.length, '"key" must be a string');

  container.setState({ retrievingPassPhrase: true, passPhraseRetrievalError: false });

  return send('RETRIEVE_PASS_PHRASE', { key }).then(payload => {
    const value = {
      passPhrase: payload.passPhrase || null,
      retrievingPassPhrase: false,
      passPhraseRetrievalError: false,
    }

    container.setState(value);

    return value;
  }, error => {
    console.error('unable to retrieve pass phrase', error);

    container.setState({
      retrievingPassPhrase: false,
      passPhraseRetrievalError: true,
    });
  })
}