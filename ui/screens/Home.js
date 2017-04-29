const React = require('react');
const { Redirect } = require('react-router-dom');

const Home = React.createClass({
  getInitialState() {
    return {
      authenticated: null
    };
  },

  render() {
    if (this.props.user) {
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
