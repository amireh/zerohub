import React, { PropTypes } from 'react';

const Outlet = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  },

  contextTypes: {
    addOutletChangeListener: PropTypes.func.isRequired,
    getOutletOccupant: PropTypes.func.isRequired,
    removeOutletChangeListener: PropTypes.func.isRequired,
  },

  componentDidMount() {
    this.context.addOutletChangeListener(this.reloadOnOccupantUpdate)
  },

  componentWillUnmount: function() {
    this.context.removeOutletChangeListener(this.reloadOnOccupantUpdate)
  },

  render() {
    const occupant = this.context.getOutletOccupant(this.props.name);

    if (!occupant) {
      return null;
    }

    const child = React.Children.only(this.props.children);

    return React.cloneElement(child, {
      children: React.Children.only(occupant.props.children)
    });
  },

  reloadOnOccupantUpdate(key) {
    if (key === this.props.name) {
      this.forceUpdate();
    }
  }
});

export default Outlet;
