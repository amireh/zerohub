const React = require('react');

module.exports = function wrapCornflux(Component) {
  return React.createClass({
    childContextTypes: {
      dispatch: React.PropTypes.func,
    },
    propTypes: {
      dispatch: React.PropTypes.func.isRequired,
    },

    getChildContext() {
      return { dispatch: this.props.dispatch }
    },

    render() {
      return <Component {...this.props} />
    }
  });
}