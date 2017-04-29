const React = require('react');
const { Redirect } = require('react-router-dom');
const { request } = require('services/PageHub')

const Home = React.createClass({
  getInitialState() {
    return {
      authenticated: null
    };
  },

  componentDidMount() {
    request({ url: '/api/users/self' }).then(() => {
      this.setState({
        authenticated: true
      });
    }, error => {
      if (error.response.status === 401) {
        this.setState({
          authenticated: false
        })
      }
      else {
        throw error;
      }
    })
  },

  render() {
    if (this.state.authenticated === null) {
      return (
        <div>{I18n.t('Loading...')}</div>
      )
    }
    else if (this.state.authenticated) {
      return (
        <Redirect to="/spaces" />
      )
    }
    else {
      return (
        <Redirect to="/login" />
      )
    }
  }
});

module.exports = Home;
