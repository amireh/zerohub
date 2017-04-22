import React, { PropTypes } from 'react';

const OutletOccupant = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
  },

  contextTypes: {
    addOutletOccupant: PropTypes.func.isRequired,
    removeOutletOccupant: PropTypes.func.isRequired,
  },

  componentDidMount() {
    this.context.addOutletOccupant(this.props.name, this);
  },

  componentWillUnmount() {
    this.context.removeOutletOccupant(this.props.name, this);
  },

  render() {
    return null;
  }
});

export default OutletOccupant;
