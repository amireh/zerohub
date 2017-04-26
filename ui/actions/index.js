exports.actions = {
  acquireLock: require('./acquireLock'),
  decryptPageContents: require('./decryptPageContents'),
  encryptPageContents: require('./encryptPageContents'),
  fetchPage: require('./fetchPage'),
  fetchSpace: require('./fetchSpace'),
  fetchSpaces: require('./fetchSpaces'),
  generatePassPhrase: require('./generatePassPhrase'),
  releaseLock: require('./releaseLock'),
  replaceQuery: require('./replaceQuery'),
  retrievePassPhrase: require('./retrievePassPhrase'),
  setPageEncryptionStatus: require('./setPageEncryptionStatus'),
  transition: require('./transition'),
  updateQuery: require('./updateQuery'),
  updatePageContent: require('./updatePageContent'),
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
