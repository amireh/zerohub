const LockingService = require('services/LockingService');

module.exports = function acquireLock(container, { lockableType, lockableId }) {
  return LockingService.acquireLock({
    lockableType,
    lockableId
  }).then(() => {
    if (!container.isMounted()) {
      return;
    }

    container.setState({
      locks: container.state.locks.concat(lockableId)
    });
  }, () => {
    if (!container.isMounted()) {
      return;
    }

    container.setState({
      locks: container.state.locks.filter(x => x !== lockableId)
    });
  });
}