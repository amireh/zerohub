const { assert } = require('chai');

module.exports = function(initialState, options = { pedantic: true }) {
  return () => {
    const container = {
      isMounted() { return true; },
      setState(nextState) {
        if (options.pedantic) {
          Object.keys(nextState).forEach(key => {
            assert(initialState.hasOwnProperty(key),
              `Unexpected container state variable modification "${key}"`
            );
          });
        }

        Object.assign(container.state, nextState)
      },

      state: Object.assign({}, initialState),
    };

    return container;
  }
}