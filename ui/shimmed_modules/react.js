const PropTypes = require('prop-types');
const React = require('../../node_modules/react');

// copy/paste create-react-class impl cause it can't resolve "react" otherwise
const factory = require('create-react-class/factory')

// Hack to grab NoopUpdateQueue from isomorphic React
const ReactNoopUpdateQueue = new React.Component().updater;

const createReactClass = factory(React.Component, React.isValidElement, ReactNoopUpdateQueue);

// re-add support for isMounted()
const createReactClassFrd = spec => {
  const klass = createReactClass(Object.assign({}, spec, {
    componentDidMount() {
      this._mounted = true;

      if (spec.componentDidMount) {
        spec.componentDidMount.call(this);
      }
    },

    componentWillUnmount() {
      if (spec.componentWillUnmount) {
        spec.componentWillUnmount.call(this);
      }

      this._mounted = false;
    }
  }))

  klass.prototype.isMounted = function() {
    return this._mounted;
  };

  return klass;
}

// re-add support for React.createClass
Object.defineProperty(React, 'createClass', {
  configurable: true,
  writable: false,
  value: createReactClassFrd
})

// re-add support for React.PropTypes
Object.defineProperty(React, 'PropTypes', {
  configurable: true,
  writable: false,
  value: PropTypes
})

module.exports = React;
