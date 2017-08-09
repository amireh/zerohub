const React = require('react');
const OutletOccupant = require('components/OutletOccupant');
const Text = require('components/Text');
const { Button, ErrorMessage, Icon } = require('components');
const { PropTypes } = React;
const EncryptionForm = require('./EncryptionForm');
const PasswordInspector = require('./PasswordInspector');
const PasswordEditor = require('./PasswordEditor');
const DecryptionForm = require('./DecryptionForm');
const gatherFacts = require('./gatherFacts');
const { actions } = require('actions');
const generatePasswordKey = require('utils/generatePasswordKey');
const { shell } = electronRequire('electron').remote;

const SpaceSettings = React.createClass({
  propTypes: {
    bulkEncryptionProgress: PropTypes.number,
    bulkEncryptionFailed: PropTypes.bool,
    bulkEncryptionType: PropTypes.oneOf([ 'ENCRYPT', 'DECRYPT' ]),
    onChangeOfPassPhrase: PropTypes.func.isRequired,
    onEncryptAllPages: PropTypes.func.isRequired,
    onDecryptAllPages: PropTypes.func.isRequired,
    onCancelBulkEncryption: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    password: PropTypes.string,
    space: PropTypes.shape({ id: PropTypes.string }).isRequired,
    pages: PropTypes.array.isRequired,
    user: PropTypes.shape({ id: PropTypes.string }).isRequired,
  },

  getInitialState() {
    return {
      facts: null,
      gatheringFacts: false,
      wantsToEnableEncryption: false,
      wantsToDisableEncryption: false,
    };
  },

  componentDidMount() {
    this.gatherFactsAndUpdate(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.password !== this.props.password) {
      this.gatherFactsAndUpdate(nextProps)
    }
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

        {this.state.gatheringFacts && (
          <p>{I18n.t('Gathering facts about this space... one moment please.')}</p>
        )}

        <div>
          <h2>{I18n.t('Encryption')}</h2>

          {this.renderPassPhraseContent()}
        </div>

        {this.props.password && (
          <div>
            <h2>{I18n.t('Encryption Password')}</h2>

            <PasswordEditor
              facts={this.state.facts}
              passPhrase={this.props.password}
              onChange={this.props.onChangeOfPassPhrase}
              user={this.props.user}
              space={this.props.space}
            />
          </div>
        )}
      </div>
    );
  },

  renderPassPhraseContent() {
    if (this.props.password && this.state.wantsToDisableEncryption) {
      return (
        <DecryptionForm
          space={this.props.space}
          encryptedPages={this.getEncryptedPages()}
          onDisable={this.disableEncryption}
          onCancel={() => this.setState({ wantsToDisableEncryption: false })}
        />
      )
    }
    else if (this.props.password) {
      return (
        <PasswordInspector
          passPhrase={this.props.password}
          pages={this.props.pages}
          user={this.props.user}
          space={this.props.space}
          onDisable={this.maybeDisableEncryption}
          onEncryptAllPages={this.props.onEncryptAllPages}
          onDecryptAllPages={this.props.onDecryptAllPages}
          onCancelBulkEncryption={this.props.onCancelBulkEncryption}
          pages={this.props.pages}
          bulkEncryptionType={this.props.bulkEncryptionType}
          bulkEncryptionProgress={this.props.bulkEncryptionProgress}
          bulkEncryptionFailed={this.props.bulkEncryptionFailed}
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
    if (e.target.checked && !this.props.password) {
      this.setState({ wantsToEnableEncryption: e.target.checked });
    }
    else if (!e.target.checked && this.props.password) {
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
  },

  gatherFactsAndUpdate(input) {
    this.setState({
      gatheringFacts: true,
    })

    gatherFacts({
      password: input.password,
      pages: input.pages,
    }).then(facts => {
      if (this.isMounted()) {
        this.setState({
          facts,
          gatheringFacts: false
        })
      }
    }, () => {
      if (this.isMounted()) {
        this.setState({
          facts: null,
          gatheringFacts: false,
        })
      }
    })
  }

});

module.exports = SpaceSettings;
