import React from 'react';
import { Button } from 'components/Native';

const PassPhraseModal = React.createClass({
  render() {
    return (
      <div className="pass-phrase-modal">
        <p>
          You must keep this secret and be sure to write it down because you
          won't have access to it again. 0Hub has stored it in your keyring
          under the service name <code>"0Hub"</code> and account name
          <code>"{this.props.passPhrase.key}"</code> for local access in the future.
        </p>

        <p>
          Should you lose this pass-phrase, you will also lose the ability to
          modify any content encrypted using it.
        </p>

        <pre><code>{this.props.passPhrase.value}</code></pre>

        <Button onClick={this.props.onClose}>Dismiss</Button>
      </div>
    );
  }
});

export default PassPhraseModal;
