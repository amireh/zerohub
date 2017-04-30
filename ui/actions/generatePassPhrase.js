const { send } = require('services/CoreDelegate');
const invariant = require('invariant');

module.exports = function generatePassPhrase(container, { userId, spaceId, save = true }) {
  invariant(typeof userId === 'string' && userId.length, '"userId" must be a string');
  invariant(typeof spaceId === 'string' && spaceId.length, '"spaceId" must be a string');

  container.setState({ generatingPassPhrase: true });

  return send('GENERATE_PASS_PHRASE', { userId, spaceId, save }).then(payload => {
    const { passPhrase } = payload;

    container.setState({
      passPhrase: passPhrase || null,
      generatingPassPhrase: false,
    });

    return passPhrase;
  }, error => {
    console.error('unable to generate pass phrase');

    container.setState({ generatingPassPhrase: false });

    throw error;
  })
}