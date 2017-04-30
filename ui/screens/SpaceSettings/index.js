const React = require('react');
const OutletOccupant = require('components/OutletOccupant');
const Icon = require('components/Icon');
const Text = require('components/Text');
const { Button } = require('components/Native');
const { PropTypes } = React;
const EncryptionForm = require('./EncryptionForm');
const PasswordInspector = require('./PasswordInspector');
const DecryptionForm = require('./DecryptionForm');
const { actions } = require('actions');
const generatePasswordKey = require('utils/generatePasswordKey');
const { shell } = electronRequire('electron').remote;

const SpaceSettings = React.createClass({
  propTypes: {
    onChangeOfPassPhrase: PropTypes.func.isRequired,
    passPhrase: PropTypes.string,
    space: PropTypes.shape({ id: PropTypes.string }).isRequired,
    user: PropTypes.shape({ id: PropTypes.string }).isRequired,
  },

  getInitialState() {
    return {
      wantsToEnableEncryption: false,
      wantsToDisableEncryption: false,
    };
  },

  render() {
    return (
      <div className="space-settings">
        <OutletOccupant name="MEMBER_BANNER">
          <div className="space-settings__banner">
            <h1>{I18n.t('Space Settings')}</h1>

            <Button onClick={this.props.onClose} title={I18n.t('Close')} hint="icon">
              <Icon className="icon-close" />
            </Button>
          </div>
        </OutletOccupant>

        <div>
          <h2>{I18n.t('Encryption')}</h2>

          {this.renderPassPhraseContent()}
        </div>
      </div>
    );
  },

  renderPassPhraseContent() {
    if (this.props.passPhrase && this.state.wantsToDisableEncryption) {
      return (
        <DecryptionForm
          space={this.props.space}
          encryptedPages={this.getEncryptedPages()}
          onDisable={this.disableEncryption}
          onCancel={() => this.setState({ wantsToDisableEncryption: false })}
        />
      )
    }
    else if (this.props.passPhrase) {
      return (
        <PasswordInspector
          passPhrase={this.props.passPhrase}
          pages={this.props.pages}
          user={this.props.user}
          space={this.props.space}
          onDisable={this.maybeDisableEncryption}
        />
      )
    }
    else if (this.state.wantsToEnableEncryption) {
      return (
        <EncryptionForm
          user={this.props.user}
          space={this.props.space}
          onEnable={this.enableEncryption}
          onCancel={() => this.setState({ wantsToEnableEncryption: false })}
        />
      );
    }
    else {
      return (
        <p>
          <Text>
            <Button hint="link" onClick={() => this.setState({ wantsToEnableEncryption: true })}>
              {I18n.t('Set up encryption for this space')}
            </Button> or {(
              <Button
                hint="link"
                onClick={this.openPageInBrowser("https://www.pagehub.org/pagehub/0hub/encryption")}
              >
                learn more
              </Button>
            )} about 0hub's encryption features.
          </Text>
        </p>
      );
    }
  },

  getEncryptedPages() {
    return this.props.pages.filter(x => !!x.encrypted);
  },

  toggleSpaceEncryption(e) {
    if (e.target.checked && !this.props.passPhrase) {
      this.setState({ wantsToEnableEncryption: e.target.checked });
    }
    else if (!e.target.checked && this.props.passPhrase) {
      this.setState({ wantsToDisableEncryption: true });
    }
  },

  maybeDisableEncryption() {
    if (this.getEncryptedPages().length === 0) {
      this.disableEncryption();
    }
    else {
      this.setState({ wantsToDisableEncryption: true })
    }
  },

  enableEncryption(passPhrase) {
    actions.savePassPhrase(passPhrase).then(() => {
      this.props.onChangeOfPassPhrase(passPhrase);
    }).catch(() => {
      this.setState({
        wantsToEnableEncryption: false,
      })
    });
  },

  disableEncryption() {
    actions.removePassPhrase({
      key: generatePasswordKey({
        userId: this.props.user.id,
        spaceId: this.props.space.id
      })
    }).then(() => {
      this.props.onChangeOfPassPhrase(null);
      this.setState({
        wantsToDisableEncryption: false,
      })
    })
  },

  openPageInBrowser(url) {
    return () => {
      shell.openExternal(url);
    }
  }
});

module.exports = SpaceSettings;
