const CoreDelegate = require('services/CoreDelegate');

module.exports = function retrievePassPhrase(container, { spaceId }) {
  container.setState({ retrievingPassPhrase: true, passPhraseRetrievalError: false });

  return CoreDelegate.retrievePassPhrase({ spaceId }).then(passPhrase => {
    container.setState({
      passPhrase: passPhrase || null,
      retrievingPassPhrase: false,
      passPhraseRetrievalError: false,
    });
  }, error => {
    console.error('unable to generate pass phrase', error);

    container.setState({
      retrievingPassPhrase: false,
      passPhraseRetrievalError: true,
    });
  })
}