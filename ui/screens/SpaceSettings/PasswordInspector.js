const React = require('react');
const Text = require('components/Text');
const { Button, ProgressBar, ErrorMessage } = require('components');
const { PropTypes } = React;

const PasswordInspector = React.createClass({
  propTypes: {
    passPhrase: PropTypes.string.isRequired,
    pages: PropTypes.array.isRequired,
    bulkEncryptionProgress: PropTypes.number,
    bulkEncryptionFailed: PropTypes.bool,
    bulkEncryptionType: PropTypes.oneOf([ 'ENCRYPT', 'DECRYPT' ]),
    onDisable: PropTypes.func,
    onEncryptAllPages: PropTypes.func,
    onDecryptAllPages: PropTypes.func,
    onCancelBulkEncryption: PropTypes.func,
  },

  getInitialState() {
    return {
      showingPassword: false
    };
  },

  render() {
    const { showingPassword } = this.state;
    const { pages } = this.props;
    const nonEncryptedPages = pages.filter(x => !x.encrypted);
    const encryptedPages = pages.filter(x => x.encrypted);
    const isOperating = this.props.bulkEncryptionProgress !== null;

    return (
      <div className="margin-t-m">
        <p>
          <Text>
            Encryption is enabled for this space. Click to
            {' '}

            {showingPassword ? (
              I18n.t('show the password')
            ) : (
              <Button hint="link" onClick={this.showPassword}>show the password</Button>
            )}

            {' '}
            or to
            {' '}
            <Button onClick={this.props.onDisable} hint="link">disable entirely</Button>.
          </Text>
        </p>

        {showingPassword && (
          <div>
            <pre className="password-box"><code>{this.props.passPhrase}</code></pre>

            <Button hint="link" onClick={this.hidePassword}>
              {I18n.t('Hide')}
            </Button>
          </div>
        )}

        {!isOperating && encryptedPages.length === pages.length && pages.length > 0 && (
          <p>
            <Text>
              Leet haxor status achieved. All {this.props.pages.length} pages are encrypted!
              Would you like to
              {' '}
              <Button hint="link" onClick={this.props.onDecryptAllPages}>decrypt them all</Button>
              ?
            </Text>
          </p>
        )}

        <ul>
          {!isOperating && nonEncryptedPages.length > 0 && (
            <li>
              <Text>
                There are {nonEncryptedPages.length} pages that are not
                currently encrypted, would you like to
                {' '}
                <Button hint="link" onClick={this.props.onEncryptAllPages}>
                  encrypt them all
                </Button>
                ?
              </Text>
            </li>
          )}

          {!isOperating && encryptedPages.length > 0 && encryptedPages.length < pages.length && (
            <li>
              <Text>
                There are {encryptedPages.length} pages that are currently encrypted,
                would you like to
                {' '}
                <Button hint="link" onClick={this.props.onDecryptAllPages}>
                  decrypt them all
                </Button>
                ?
              </Text>
            </li>
          )}
        </ul>

        {isOperating && (
          this.renderBulkEncryptionStatus()
        )}

        {this.props.bulkEncryptionFailed && (
          this.renderBulkEncryptionError()
        )}
      </div>
    );
  },

  renderBulkEncryptionStatus() {
    const progress = this.props.bulkEncryptionProgress;

    return (
      <div className="space-settings__bulk-encryption-status">
        <p>
          {this.props.bulkEncryptionType === 'ENCRYPT' ? (
            <Text>Encryption is underway, hold tight!</Text>
          ) : (
            <Text>Decryption is underway, hold tight!</Text>
          )}
        </p>

        <ProgressBar progress={progress} />

        <div className="margin-tb-m">
          <Button onClick={this.props.onCancelBulkEncryption}>{I18n.t('Abort')}</Button>
        </div>
      </div>
    )
  },

  renderBulkEncryptionError() {
    return (
      <ErrorMessage>
        <Text>Oops! Something went wrong... you can try again or contact us for help.</Text>
      </ErrorMessage>
    )
  },

  showPassword() {
    this.setState({
      showingPassword: true
    })
  },

  hidePassword() {
    this.setState({
      showingPassword: false
    })
  }
});

module.exports = PasswordInspector;
