const React = require('react');
const { request } = require('services/PageHub');
const { Redirect } = require('react-router-dom');
const ErrorMessage = require('components/ErrorMessage');
const { actions, applyOntoComponent } = require('actions');
const { TextInput, Checkbox, Button } = require('components/Native');
const APP_ENV = electronRequire('electron').remote.getGlobal('APP_ENV');

const Login = React.createClass({
  getInitialState: function() {
    return {
      credentialError: false,
      shouldSaveToken: true,
      username: '',
      password: '',
      loggedIn: false,
      reading: true,
    };
  },

  componentDidMount() {
    applyOntoComponent(this, actions.retrieveCredentials).then(apiToken => {
      this.setState({ reading: false });
      this.loginWith(apiToken);
    }).catch(() => {
      this.setState({ reading: false });
    })
  },

  render() {
    if (this.state.loggedIn) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="login">
          <div className="login__logo">
            <h1>{I18n.t('0Hub')}</h1>
          </div>

          <div className="">
            <div className="">
              {this.state.reading && (
                <p>{I18n.t('Logging in using stored credentials... please wait.')}</p>
              )}

              {this.renderForm()}
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderForm() {
    return (
      <form className="login__form" onSubmit={this.submit}>
        {this.state.credentialError && (
          <ErrorMessage>{I18n.t('Invalid credentials, please try again.')}</ErrorMessage>
        )}

        <label>
          <TextInput
            autoFocus
            placeholder={I18n.t('Username')}
            type="text"
            name="username"
            value={this.state.username || ''}
            onChange={this.trackUsername}
          />
        </label>

        <label>
          <TextInput
            placeholder={I18n.t('Password')}
            type="password"
            name="password"
            value={this.state.password || ''}
            onChange={this.trackPassword}
          />
        </label>

        <label>
          <Checkbox
            type="checkbox"
            checked={this.state.shouldSaveToken}
            onChange={this.trackSaveToken}
          />

          {I18n.t('Remember credentials')}
        </label>

        <Button type="submit" onClick={this.submit}>
          {I18n.t('Login')}
        </Button>
      </form>
    );
  },

  trackSaveToken(e) {
    this.setState({
      shouldSaveToken: e.target.checked
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

    this.loginWith( btoa(`${this.state.username}:${this.state.password}`) );
  },

  loginWith(apiToken) {
    APP_ENV.API_TOKEN = apiToken;

    request({
      url: '/api/users/self'
    }).then(() => {
      const logIn = () => this.setState({ loggedIn: true });

      if (this.state.shouldSaveToken) {
        applyOntoComponent(this, actions.storeCredentials, {
          apiToken
        }).then(logIn)
      }
      else {
        logIn();
      }
    }, () => {
      this.setState({ credentialError: true })
    });
  }
});

module.exports = Login;
