import React, { PropTypes } from 'react';
import invariant from 'invariant';

const OutletProvider = React.createClass({
  propTypes: {
    names: PropTypes.arrayOf(PropTypes.string).isRequired,
  },

  childContextTypes: {
    addOutletChangeListener: PropTypes.func,
    addOutletOccupant: PropTypes.func,
    getOutletOccupant: PropTypes.func,
    emitOutletChange: PropTypes.func,
    removeOutletChangeListener: PropTypes.func,
    removeOutletOccupant: PropTypes.func,
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
    this.changeListeners = [];
  },

  componentWillUnmount() {
    this.changeListeners = null;
    this.occupants = null;
  },

  getChildContext() {
    return {
      addOutletOccupant: this.addOccupant,
      addOutletChangeListener: this.addOutletChangeListener,
      getOutletOccupant: this.getOccupant,
      emitOutletChange: this.emitChangeOfOutletState,
      removeOutletOccupant: this.removeOccupant,
      removeOutletChangeListener: this.removeOutletChangeListener,
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
      return (this.state.occupants[key]);
    }
    else {
      return null;
    }
  },

  assertNameIsKnown(key) {
    invariant(this.props.names.indexOf(key) > -1,
      `Unknown outlet "${key}"`
    );
  },

  addOutletChangeListener(listener) {
    this.changeListeners.push(listener);
  },

  emitChangeOfOutletState(name) {
    this.changeListeners.forEach(fn => fn(name));
  },

  removeOutletChangeListener(listener) {
    const index = this.changeListeners.indexOf(listener);

    if (index > -1) {
      this.changeListeners.splice(index, 1);
    }
  },

});

export default OutletProvider;
