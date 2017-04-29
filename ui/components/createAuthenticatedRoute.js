const React = require('react');
const { Redirect } = require('react-router-dom');

const createAuthenticatedRoute = Component => React.createClass({
  render() {
    if (!this.props.user) {
      return <Redirect to="/login" />
    }
    else {
      return <Component {...this.props} />
    }
  }
});

module.exports = createAuthenticatedRoute;
