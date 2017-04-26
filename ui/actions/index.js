exports.acquireLock = require('./acquireLock');
exports.releaseLock = require('./releaseLock');

exports.applyOntoComponent = function(component, action, payload) {
  return action({
    state: component.state,
    setState(nextState) {
      if (component.isMounted()) {
        component.setState(nextState)
      }
    }
  }, payload);
};
