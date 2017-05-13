exports.actions = {
  acquireLock: require('./acquireLock'),
  bulkSetPageEncryptionStatus: require('./bulkSetPageEncryptionStatus'),
  createPage: require('./createPage'),
  decryptPageContents: require('./decryptPageContents'),
  encryptPageContents: require('./encryptPageContents'),
  fetchPage: require('./fetchPage'),
  fetchSpace: require('./fetchSpace'),
  fetchSpaces: require('./fetchSpaces'),
  generatePassPhrase: require('./generatePassPhrase'),
  login: require('./login'),
  logout: require('./logout'),
  promptForPageRemoval: require('./promptForPageRemoval'),
  releaseLock: require('./releaseLock'),
  removePage: require('./removePage'),
  removePassPhrase: require('./removePassPhrase'),
  replaceQuery: require('./replaceQuery'),
  retrieveCredentials: require('./retrieveCredentials'),
  retrieveAllPassPhrases: require('./retrieveAllPassPhrases'),
  retrievePassPhrase: require('./retrievePassPhrase'),
  savePassPhrase: require('./savePassPhrase'),
  setPageEncryptionStatus: require('./setPageEncryptionStatus'),
  storeCredentials: require('./storeCredentials'),
  transition: require('./transition'),
  updateQuery: require('./updateQuery'),
  updatePage: require('./updatePage'),
  updatePageContent: require('./updatePageContent'),
};

exports.applyOntoComponent = function(component, action, payload) {
  if (action.length < 2) {
    return action(payload);
  }
  else {
    return action({
      state: component.state,
      setState: function(nextState) {
        if (this.isMounted()) {
          this.setState(nextState)
        }
      }.bind(component)
    }, payload);
  }
};

exports.applyOntoNull = require('./applyOntoNull')