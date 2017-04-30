const React = require('react');
const { request, setApiToken } = require('services/PageHub');
const { Redirect } = require('react-router-dom');
const { actions } = require('actions');
const { TextInput, Checkbox, Button } = require('components/Native');

const Login = React.createClass({
  getInitialState: function() {
    return {
      credentialError: false,
      userWantsToSaveToken: true,
      username: '',
      password: '',
    };
  },

  render() {
    if (this.props.user) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="login-center">
          <div className="login">
            <div className="login__logo">
              <h1><em>0</em><span>Hub</span></h1>
            </div>

            <div className="">
              <div className="">
                {this.renderForm()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderForm() {
    return (
      <form className="login__form" onSubmit={this.submit}>
        <label>
          <TextInput
            autoFocus
            placeholder={I18n.t('Username')}
            type="text"
            name="username"
            value={this.state.username || ''}
            className={this.state.credentialError ? 'text-input--invalid' : undefined}
            onChange={this.trackUsername}
          />
        </label>

        <label>
          <TextInput
            placeholder={I18n.t('Password')}
            type="password"
            name="password"
            value={this.state.password || ''}
            className={this.state.credentialError ? 'text-input--invalid' : undefined}
            onChange={this.trackPassword}
          />
        </label>

        {false && (<label>
          <Checkbox
            type="checkbox"
            checked={this.state.userWantsToSaveToken}
            onChange={this.trackSaveToken}
          />

          {I18n.t('Remember credentials')}
        </label>)}

        <Button hint="danger" type="submit" onClick={this.submit}>
          {I18n.t('Sign in')}
        </Button>
      </form>
    );
  },

  trackSaveToken(e) {
    this.setState({
      userWantsToSaveToken: e.target.checked
    })
  },

  trackUsername(e) {
    this.setState({ username: e.target.value });
  },

  trackPassword(e) {
    this.setState({ password: e.target.value });
  },

  submit(e) {
    e.preventDefault();

    const apiToken = btoa(`${this.state.username}:${this.state.password}`);

    this.loginWith({ apiToken, }).then(payload => {
      if (this.isMounted() && this.state.userWantsToSaveToken) {
        return actions.storeCredentials(this, { apiToken }).then(() => payload);
      }
      else {
        return payload;
      }
    }).then(payload => {
      if (this.isMounted()) {
        this.emitChangeOfUser(payload);
      }
    });
  },

  loginWith({ apiToken }) {
    setApiToken(apiToken);

    return request({ url: '/api/users/self' }).catch(() => {
      if (this.isMounted()) {
        this.setState({ credentialError: true })
      }
    });
  },

  emitChangeOfUser(payload) {
    this.props.onChangeOfUser(payload.users[0]);
  }
});

module.exports = Login;
