const React = require('react');
const Text = require('components/Text');
const { Button } = require('components/Native');
const { PropTypes } = React;

const PasswordInspector = React.createClass({
  propTypes: {
    passPhrase: PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      showingPassword: false
    };
  },

  render() {
    const { showingPassword } = this.state;

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
      </div>
    );
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
