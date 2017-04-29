const React = require('react');
const Splash = require('components/Splash');
const { actions } = require('actions');

const ApplicationLoader = Component => React.createClass({
  displayName: `ApplicationLoader`,
  getInitialState() {
    return {
      loading: true,
    };
  },

  componentWillMount() {
    const start = () => {
      if (this.isMounted()) {
        this.setState({ loading: false });
      }
    }

    actions.retrieveCredentials().then(apiToken => {
      if (apiToken) {
        return actions.login(null, { apiToken }).then(payload => {
          this.setState({ user: payload.users[0] });
        });
      }
      else {
        return Promise.resolve();
      }
    }).then(start, start)
  },

  render() {
    if (this.state.loading) {
      return <Splash />
    }

    const applicationData = {
      user: this.state.user,
    };

    return <Component {...this.props} applicationData={applicationData} />
  }
});

module.exports = ApplicationLoader;
