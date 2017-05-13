const LockingService = require('services/LockingService');

module.exports = function acquireLock(container, { lockableType, lockableId }) {
  container.setState({
    acquiringLock: true
  });

  return LockingService.acquireLock({
    lockableType,
    lockableId
  }).then(() => {
    container.setState({
      acquiringLock: false,
      locks: container.state.locks.concat(lockableId)
    });
  }, () => {
    container.setState({
      acquiringLock: false,
      locks: container.state.locks.filter(x => x !== lockableId)
    });
  });
}