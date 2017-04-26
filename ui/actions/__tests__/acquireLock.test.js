const subject = require('../acquireLock');
const LockingService = require('services/LockingService');
const { assert, DummyContainer, sinonSuite } = require('test_utils');

describe('actions.acquireLock', function() {
  const sinon = sinonSuite(this);
  const createContainer = DummyContainer({
    locks: []
  });

  it('works', function() {
    sinon.spy(LockingService, 'acquireLock');

    subject(createContainer(), { lockableId: 'p1', lockableType: 'Resource' })

    assert.calledWith(LockingService.acquireLock, {
      lockableType: 'Resource',
      lockableId: 'p1'
    })
  });

  it('adds the lock to the container state if it acquired it', function(done) {
    const container = createContainer();

    sinon.stub(LockingService, 'acquireLock').callsFake(() => Promise.resolve());

    container.setState({ locks: [] })

    subject(container, { lockableId: 'p1', lockableType: 'Resource' }).then(() => {
      assert.deepEqual(container.state.locks, [ 'p1' ]);
      done();
    }).catch(done);
  });

  it('removes the lock from the container state if it failed to acquire it', function(done) {
    const container = createContainer();

    sinon.stub(LockingService, 'acquireLock').callsFake(() => Promise.reject());

    container.setState({ locks: [ 'p1' ] })

    subject(container, { lockableId: 'p1', lockableType: 'Resource' }).then(() => {
      assert.deepEqual(container.state.locks, []);
      done();
    }).catch(done);
  });
})