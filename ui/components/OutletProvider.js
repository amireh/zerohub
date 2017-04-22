import React, { PropTypes } from 'react';
import invariant from 'invariant';

const OutletProvider = React.createClass({
  propTypes: {
    names: PropTypes.arrayOf(PropTypes.string).isRequired,
  },

  childContextTypes: {
    addOutletOccupant: PropTypes.func.isRequired,
    getOutletOccupant: PropTypes.func.isRequired,
    removeOutletOccupant: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      occupants: this.props.names.reduce((map, key) => {
        map[key] = null;

        return map;
      }, {})
    };
  },

  componentWillMount() {
    this.occupants = {};
  },

  getChildContext() {
    return {
      addOutletOccupant: this.addOccupant,
      getOutletOccupant: this.getOccupant,
      removeOutletOccupant: this.removeOccupant,
    }
  },

  render() {
    return React.Children.only(this.props.children);
  },

  addOccupant(key, instance) {
    this.assertNameIsKnown(key);

    this.setState({
      occupants: Object.assign({}, this.state.occupants, {
        [key]: instance
      })
    });
  },

  removeOccupant(key, instance) {
    this.assertNameIsKnown(key);

    if (this.state.occupants[key] === instance) {
      this.setState({
        occupants: Object.assign({}, this.state.occupants, {
          [key]: null
        })
      });
    }
  },

  getOccupant(key) {
    this.assertNameIsKnown(key);

    if (this.state.occupants[key]) {
      return React.Children.only(this.state.occupants[key].props.children);
    }
    else {
      return null;
    }
  },

  assertNameIsKnown(key) {
    invariant(this.props.names.indexOf(key) > -1,
      `Unknown outlet "${key}"`
    );
  }
});

export default OutletProvider;
