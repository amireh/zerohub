const React = require('react');
const { Button, Text, TextInput, } = require('components');
const isPasswordValid = require('./isPasswordValid');
const buildPassPhrase = require('./buildPassPhrase');
const { savePassPhrase } = require('actions')
const Modes = {
  Initial: 1,
  Editing: 2,
  Viewing: 3,
};

const PasswordEditor = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    passPhrase: React.PropTypes.string,
    space: React.PropTypes.shape({ id: React.PropTypes.string }).isRequired,
    user: React.PropTypes.shape({ id: React.PropTypes.string }).isRequired,
  },

  getInitialState() {
    return {
      nextPassPhrase: '',
      mode: Modes.Initial,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.passPhrase !== this.props.passPhrase) {
      this.reset();
    }
  },

  render() {
    const { mode } = this.state;

    return (
      <div>
        {mode === Modes.Initial && (
          <ul>
            <li>
              <Text>
                <Button hint="link" onClick={this.showPassword}>Show password</Button>
              </Text>
            </li>

            <li>
              <Text>
                <Button hint="link" onClick={this.changePassword}>Change password</Button>
              </Text>
            </li>
          </ul>
        )}

        {mode === Modes.Editing && (
          this.renderEditingWidget()
        )}

        {mode === Modes.Viewing && (
          this.renderPassPhraseInPlainText()
        )}
      </div>
    );
  },

  showPassword() {
    this.setState({ mode: Modes.Viewing })
  },

  changePassword() {
    this.setState({ mode: Modes.Editing })
  },

  reset() {
    this.setState({ mode: Modes.Initial, nextPassPhrase: '', })
  },

  renderEditingWidget() {
    return (
      <div className="pure-g">
        <div className="pure-u-1-1">
          <TextInput
            type="password"
            placeholder={I18n.t('Enter new password')}
            value={this.state.nextPassPhrase}
            onChange={this.trackNewPassword}
          />
          {' '}

          <Button
            onClick={this.emitChange}
            hint="danger"
            disabled={!isPasswordValid(this.state.nextPassPhrase)}
          >
            {I18n.t('Apply')}
          </Button>
        </div>

        <div className="pure-u-1-1 margin-t-s">
          <Button onClick={this.reset}>
            {I18n.t('Cancel')}
          </Button>

          {' '}

        </div>
      </div>
    )
  },

  renderPassPhraseInPlainText() {
    return (
      <div>
        <pre className="password-box"><code>{this.props.passPhrase}</code></pre>

        <Button hint="link" onClick={this.reset}>
          {I18n.t('Hide')}
        </Button>
      </div>
    )
  },

  trackNewPassword(e) {
    this.setState({ nextPassPhrase: e.target.value })
  },

  emitChange() {
    if (isPasswordValid(this.state.nextPassPhrase)) {
      const secret = this.state.nextPassPhrase;
      const passPhrase = buildPassPhrase({
        user: this.props.user,
        space: this.props.space,
        secret
      });

      savePassPhrase(passPhrase).then(() => {
        this.props.onChange(passPhrase);
      })
    }
  }
});

module.exports = PasswordEditor;
