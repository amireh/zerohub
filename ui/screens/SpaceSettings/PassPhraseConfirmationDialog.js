const React = require('react');
const { send } = require('services/CoreDelegate')

const PassPhraseConfirmationDialog = React.createClass({
  getInitialState() {
    return {
      confirmed: false
    };
  },

  componentDidMount() {
    const { passPhrase } = this.props;

    send('OPEN_MODAL', {
      type: 'question',
      buttons: [
        I18n.t('Cancel'),
        I18n.t('Use Password')
      ],
      defaultId: 1,
      checkboxLabel: I18n.t('I have read and understood the implications.'),
      checkboxChecked: false,
      cancelId: 0,
      message: discardCarriage(`
You must keep this password secret! If this password is compromised, content\r
you've authored and encrypted using this password will also be compromised.

0Hub has stored this password in your keyring under the service and account\r
names "0Hub" and "${passPhrase.key}" for local access in the future.

Should you lose this password (e.g., it is removed from your keyring), you will\r
also lose the ability to modify any content encrypted using it.

Your chosen password is:

${passPhrase.value}`)
    }).then(({ response, checkboxChecked }) => {
      if (!checkboxChecked || response === 0) {
        this.props.onCancel()
      }
      else {
        this.props.onAccept();
      }
    })
  },

  render() {
    return null;
  },
});

module.exports = PassPhraseConfirmationDialog;

function discardCarriage(string) {
  return string.replace(/\r\n/g, '');
}