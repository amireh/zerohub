module.exports = function applyOntoNull(action, payload) {
  if (action.length === 1) {
    return action(payload);
  }
  else if (action.length === 2) {
    return action({
      state: {},
      setState: Function.prototype
    }, payload);
  }
};
