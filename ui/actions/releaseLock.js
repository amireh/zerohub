const LockingService = require('services/LockingService');

module.exports = function releaseLock(container, { lockableType, lockableId }) {
  return LockingService.releaseLock({
    lockableType,
    lockableId
  }).then(() => {
    console.debug('hoi?')
    container.setState({
      locks: container.state.locks.filter(x => x !== lockableId)
    });
  });
}