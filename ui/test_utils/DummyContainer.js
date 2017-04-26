const { assert } = require('chai');

module.exports = function(initialState, options = { pedantic: true }) {
  const expectedModifications = Object.keys(initialState);

  return () => {
    const container = {
      isMounted() { return true; },
      setState(nextState) {
        if (options.pedantic) {
          Object.keys(nextState).forEach(key => {
            assert.include(expectedModifications, key,
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