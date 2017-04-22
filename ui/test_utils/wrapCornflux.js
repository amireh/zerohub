import React, { PropTypes } from 'react';

export default function wrapCornflux(Component) {
  return React.createClass({
    childContextTypes: {
      dispatch: PropTypes.func,
    },
    propTypes: {
      dispatch: PropTypes.func.isRequired,
    },

    getChildContext() {
      return { dispatch: this.props.dispatch }
    },

    render() {
      return <Component {...this.props} />
    }
  });
}