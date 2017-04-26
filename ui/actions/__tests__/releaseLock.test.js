const subject = require('../releaseLock');
const LockingService = require('services/LockingService');
const { assert, DummyContainer, sinonSuite } = require('test_utils');

describe('actions.releaseLock', function() {
  const sinon = sinonSuite(this);
  const createContainer = DummyContainer({
    locks: []
  });

  it('works', function() {
    sinon.spy(LockingService, 'releaseLock');

    subject(createContainer(), { lockableType: 'Resource', lockableId: 'p1' });

    assert.calledWith(LockingService.releaseLock, {
      lockableType: 'Resource',
      lockableId: 'p1'
    })
  });

  it('removes the lock from the container state', function(done) {
    const container = createContainer();

    sinon.stub(LockingService, 'releaseLock').callsFake(() => Promise.resolve());

    container.setState({
      locks: [ 'p1' ]
    })

    subject(container, { lockableType: 'Resource', lockableId: 'p1' }).then(() => {
      assert.deepEqual(container.state.locks, []);
      done();
    }).catch(done);
  })
})