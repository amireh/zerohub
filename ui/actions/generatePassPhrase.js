const CoreDelegate = require('services/CoreDelegate');

module.exports = function generatePassPhrase(container, { spaceId }) {
  container.setState({ generatingPassPhrase: true });

  return CoreDelegate.generatePassPhrase({ spaceId }).then(passPhrase => {
    container.setState({
      passPhrase: passPhrase || null,
      generatingPassPhrase: false
    });
  }, error => {
    console.error('unable to generate pass phrase');

    container.setState({ generatingPassPhrase: false });

    throw error;
  })
}