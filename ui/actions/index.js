exports.actions = {
  acquireLock: require('./acquireLock'),
  releaseLock: require('./releaseLock'),
  fetchPage: require('./fetchPage'),
  updatePageContent: require('./updatePageContent'),
  setPageEncryptionStatus: require('./setPageEncryptionStatus'),
  updateQuery: require('./updateQuery'),
  replaceQuery: require('./replaceQuery'),
  transition: require('./transition'),
};

exports.applyOntoComponent = function(component, action, payload) {
  return action({
    state: component.state,
    setState: function(nextState) {
      if (this.isMounted()) {
        this.setState(nextState)
      }
    }.bind(component)
  }, payload);
};
