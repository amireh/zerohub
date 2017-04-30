const React = require('react');
const { Button } = require('components/Native');

const PassPhraseModal = React.createClass({
  render() {
    const passPhrase = this.props.passPhrase  || {};

    return (
      <div className="pass-phrase-modal">
        <p>
          You must keep this secret and be sure to write it down because you
          won't have access to it again. 0Hub has stored it in your keyring
          under the service name <code>"0Hub"</code> and account name
          <code>"{passPhrase.key}"</code> for local access in the future.
        </p>

        <p>
          Should you lose this pass-phrase, you will also lose the ability to
          modify any content encrypted using it.
        </p>

        <pre className="pass-phrase-modal__pass-phrase"><code>{passPhrase.value}</code></pre>

        <Button onClick={this.props.onClose}>Dismiss</Button>
      </div>
    );
  }
});

module.exports = PassPhraseModal;
