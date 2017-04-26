const LockingService = require('services/LockingService');

module.exports = function acquireLock(container, { lockableType, lockableId }) {
  return LockingService.acquireLock({
    lockableType,
    lockableId
  }).then(() => {
    container.setState({
      locks: container.state.locks.concat(lockableId)
    });
  }, () => {
    container.setState({
      locks: container.state.locks.filter(x => x !== lockableId)
    });
  });
}