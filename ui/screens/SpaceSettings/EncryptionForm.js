const React = require('react');
const ErrorMessage = require('components/ErrorMessage');
const Text = require('components/Text');
const generatePasswordKey = require('utils/generatePasswordKey');
const { Button, Radio, TextInput, } = require('components/Native');
const { applyOntoNull, actions } = require('actions');
const { PropTypes } = React;
const PassPhraseConfirmationDialog = require('./PassPhraseConfirmationDialog');
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

const PasswordForm = React.createClass({
  propTypes: {
    space: PropTypes.shape({ id: PropTypes.string }).isRequired,
    user: PropTypes.shape({ id: PropTypes.string }).isRequired,
    onEnable: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      confirming: false,
      inputMethod: null,
      passwords: {
        paste: null,
        generate: null,
        file: null,
      },
      saveError: false,
    };
  },

  render() {
    const inputPassword = this.getInputPassword();
    const canUsePassPhrase = (
      inputPassword &&
      inputPassword.length >= MIN_PASSWORD_LENGTH &&
      inputPassword.length <= MAX_PASSWORD_LENGTH
    );

    return (
      <div>
        {this.state.confirming && this.renderConfirmationDialog()}

        <p>
          <Text>
            In order for 0Hub to be able to encrypt your pages, you
            must assign a password to use for this space.
          </Text>
        </p>

        <label className="space-settings__control-label">
          <Radio
            checked={this.state.inputMethod === 'paste'}
            onChange={this.setInputMethod('paste')}
          />

          {I18n.t('Insert a password')}
        </label>

        {this.state.inputMethod === 'paste' && (
          <div className="space-settings__section">
            <div className="margin-t-m">
              <TextInput
                placeholder={I18n.t('Enter password...')}
                onChange={this.acceptPasswordFromPaste}
                size={64}
                autoFocus
              />
            </div>

            <p>
              <em>
                <Text>Password is recommended to be 64 characters long and
                needs to be at least 8 characters long.
                </Text>
              </em>
            </p>
          </div>
        )}

        <label className="space-settings__control-label">
          <Radio
            checked={this.state.inputMethod === 'file'}
            onChange={this.setInputMethod('file')}
          />

          {I18n.t('Import a password stored in a file')}
        </label>

        {this.state.inputMethod === 'file' && (
          <div className="space-settings__section margin-t-m">
            <input type="file" onChange={this.acceptPasswordFromFile} />
          </div>
        )}

        <label className="space-settings__control-label">
          <Radio
            checked={this.state.inputMethod === 'generate'}
            onChange={this.generatePassword}
          />

          {I18n.t('Generate a password')}
        </label>

        {this.state.inputMethod === 'generate' && (
          <div className="space-settings__section">
            <p><Text>
              0Hub will generate a password for you which you will get to
              see and write down once you confirm your action.
            </Text></p>
          </div>
        )}

        {inputPassword && inputPassword.length < MIN_PASSWORD_LENGTH && (
          <ErrorMessage>
            {I18n.t(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`)}
          </ErrorMessage>
        )}

        {inputPassword && inputPassword.length > MAX_PASSWORD_LENGTH && (
          <ErrorMessage>
            {I18n.t(`Password length can not exceed ${MAX_PASSWORD_LENGTH} characters.`)}
          </ErrorMessage>
        )}

        {this.state.saveError && (
          <ErrorMessage>
            {I18n.t('Sorry! Something went wrong while saving the password.')}
          </ErrorMessage>
        )}

        <div className="margin-t-m">
          <Button
            onClick={this.confirmPassPhrase}
            disabled={!canUsePassPhrase}
            children={I18n.t('Apply Encryption Setting')}
            hint="danger"
          />
          {' '}
          <Button
            onClick={this.props.onCancel}
            children={I18n.t('Cancel')}
          />
        </div>
      </div>
    )
  },

  renderConfirmationDialog() {
    const passPhrase = {
      key: generatePasswordKey({
        userId: this.props.user.id,
        spaceId: this.props.space.id,
      }),

      value: this.getInputPassword()
    };

    return (
      <PassPhraseConfirmationDialog
        passPhrase={passPhrase}
        onAccept={() => this.usePassPhrase(passPhrase)}
        onCancel={() => this.setState({ confirming: false})}
      />
    );
  },

  getInputPassword() {
    switch (this.state.inputMethod) {
      case 'paste':
        return this.state.passwords.paste;
      case 'file':
        return this.state.passwords.file;
      case 'generate':
        return this.state.passwords.generate;
    }
  },

  setInputMethod(method) {
    return () => {
      this.setState({
        inputMethod: method,
        passwords: Object.assign({}, this.state.passwords, {
          [method]: null
        })
      })
    }
  },

  generatePassword() {
    applyOntoNull(actions.generatePassPhrase, {
      userId: this.props.user.id,
      spaceId: this.props.space.id,
      save: false,
    }).then(passPhrase => {
      this.setState({
        inputMethod: 'generate',
        passwords: Object.assign({}, this.state.passwords, {
          generate: passPhrase.value,
        }),
      });
    }, () => {
      this.setState({ generationError: true });
    })
  },

  acceptPasswordFromPaste(e) {
    this.setState({
      passwords: Object.assign({}, this.state.passwords, {
        paste: e.target.value
      })
    });
  },

  acceptPasswordFromFile(e) {
    const reader = new FileReader();

    reader.onload = readEvent => {
      if (this.isMounted()) {
        this.setState({
          passwords: Object.assign({}, this.state.passwords, {
            file: readEvent.target.result
          })
        });
      }
    };

    reader.readAsText(e.target.files[0]);
  },

  confirmPassPhrase() {
    this.setState({ confirming: true, })
  },

  usePassPhrase(passPhrase) {
    this.setState({ confirming: false })
    this.props.onEnable(passPhrase);
  }
});

module.exports = PasswordForm;
