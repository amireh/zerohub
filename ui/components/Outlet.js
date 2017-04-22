import React, { PropTypes } from 'react';

const Outlet = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  },

  contextTypes: {
    getOutletOccupant: PropTypes.func.isRequired,
  },

  render() {
    const occupant = this.context.getOutletOccupant(this.props.name);

    if (!occupant) {
      return null;
    }

    const child = React.Children.only(this.props.children);

    return React.cloneElement(child, {
      children: occupant
    });
  }
});

export default Outlet;
