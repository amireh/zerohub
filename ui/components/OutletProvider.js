const React = require('react');
const invariant = require('invariant');
const { PropTypes } = React;

const OutletProvider = React.createClass({
  propTypes: {
    names: PropTypes.arrayOf(PropTypes.string).isRequired,
  },

  childContextTypes: {
    addOutletChangeListener: PropTypes.func,
    addOutletOccupant: PropTypes.func,
    getOutletOccupant: PropTypes.func,
    hasOutletOccupant: PropTypes.func,
    emitOutletChange: PropTypes.func,
    removeOutletChangeListener: PropTypes.func,
    removeOutletOccupant: PropTypes.func,
  },

  componentWillMount() {
    this.occupants = [];
    this.changeListeners = [];
  },

  componentWillUnmount() {
    this.changeListeners = null;
    this.occupants = null;
  },

  getChildContext() {
    return {
      addOutletOccupant: this.addOutletOccupant,
      addOutletChangeListener: this.addOutletChangeListener,
      getOutletOccupant: this.getOutletOccupant,
      hasOutletOccupant: this.hasOutletOccupant,
      emitOutletChange: this.emitChangeOfOutletState,
      removeOutletOccupant: this.removeOutletOccupant,
      removeOutletChangeListener: this.removeOutletChangeListener,
    }
  },

  render() {
    return React.Children.only(this.props.children);
  },

  addOutletOccupant(key, instance) {
    if (!this.occupants) {
      console.warn('no occupants !!!')
      return;
    }

    this.assertNameIsKnown(key);
    this.occupants = this.occupants.concat({ key, instance });
    this.forceUpdate();
  },

  removeOutletOccupant(key, instance) {
    if (!this.occupants) {
      console.warn('no occupants !!!')
      return;
    }

    this.assertNameIsKnown(key);

    this.occupants = this.occupants.filter(x => x.key !== key && x.instance !== instance);
    this.forceUpdate();
  },

  getOutletOccupant(key) {
    if (!this.occupants) {
      console.warn('no occupants !!!')
      return;
    }

    this.assertNameIsKnown(key);

    const occupants = this.occupants.filter(x => x.key === key);
    const mostRecentOccupant = occupants[occupants.length-1];

    return mostRecentOccupant && mostRecentOccupant.instance || null;
  },

  hasOutletOccupant(key) {
    return this.occupants && this.occupants.some(x => x.key === key && x.instance.isPopulated());
  },

  assertNameIsKnown(key) {
    invariant(this.props.names.indexOf(key) > -1,
      `Unknown outlet "${key}"`
    );
  },

  addOutletChangeListener(listener) {
    if (!this.changeListeners) {
      return;
    }

    this.changeListeners.push(listener);
  },

  emitChangeOfOutletState(name) {
    if (!this.changeListeners) {
      return;
    }

    this.changeListeners.forEach(fn => fn(name));
  },

  removeOutletChangeListener(listener) {
    if (!this.changeListeners) {
      return;
    }

    const index = this.changeListeners.indexOf(listener);

    if (index > -1) {
      this.changeListeners.splice(index, 1);
    }
  },

});

module.exports = OutletProvider;
