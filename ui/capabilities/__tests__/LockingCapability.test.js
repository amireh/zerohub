// const Subject, { createActions } = require('../LockingCapability');
// const React = require('react');
// const * as LockingService = require('services/LockingService');
// const sinonSuite = require('test_utils/sinonSuite');
// const reactSuite = require('test_utils/reactSuite');
// const { assert } = require('chai');
// const { request } = require('services/PageHub');

describe('Capabilities::LockingCapability', function() {
  // beforeEach(function() {
  //   request.stub(Function.prototype);
  // });

  // const { ACQUIRE_LOCK, RELEASE_LOCK } = createActions({ lockableType: 'Resource' });

  // describe('decorator', function() {
  //   const Locker = React.createClass({
  //     render() {
  //       return <div />
  //     }
  //   });

  //   const LockingLocker = Subject(Locker, { lockableType: 'Resource' });

  //   const suite = reactSuite(this, LockingLocker, () => {
  //     return {}
  //   });

  //   it('passes @locks as a prop', function() {
  //     assert.deepEqual(suite.scope.find(Locker).component.props.locks, []);
  //   })
  // })

  // describe('actions', function() {
  //   const sinon = sinonSuite(this);
  //   let container;

  //   beforeEach(function() {
  //     container = {
  //       isMounted() { return true; },
  //       setState(nextState) {
  //         Object.assign(container.state, nextState)
  //       },
  //       state: {
  //         page: null,
  //         loading: false,
  //         loadError: null,
  //       },
  //     };
  //   })

  //   describe('.ACQUIRE_LOCK', function() {
  //     it('works', function() {
  //       sinon.spy(LockingService, 'acquireLock');

  //       ACQUIRE_LOCK(container, { lockableId: 'p1' })

  //       assert.calledWith(LockingService.acquireLock, {
  //         lockableType: 'Resource',
  //         lockableId: 'p1'
  //       })
  //     });

  //     it('adds the lock to the container state if it acquired it', function(done) {
  //       sinon.stub(LockingService, 'acquireLock').callsFake(() => Promise.resolve());

  //       container.setState({ locks: [] })

  //       ACQUIRE_LOCK(container, { lockableId: 'p1' }).then(() => {
  //         assert.deepEqual(container.state.locks, [ 'p1' ]);
  //         done();
  //       }).catch(done);
  //     });

  //     it('removes the lock from the container state if it failed to acquire it', function(done) {
  //       sinon.stub(LockingService, 'acquireLock').callsFake(() => Promise.reject());

  //       container.setState({ locks: [ 'p1' ] })

  //       ACQUIRE_LOCK(container, { lockableId: 'p1' }).then(() => {
  //         assert.deepEqual(container.state.locks, []);
  //         done();
  //       }).catch(done);
  //     });
  //   });

  //   describe('.RELEASE_LOCK', function() {
  //     it('works', function() {
  //       sinon.spy(LockingService, 'releaseLock');

  //       RELEASE_LOCK(container, { lockableId: 'p1' });

  //       assert.calledWith(LockingService.releaseLock, {
  //         lockableType: 'Resource',
  //         lockableId: 'p1'
  //       })
  //     });

  //     it('removes the lock from the container state', function(done) {
  //       sinon.stub(LockingService, 'releaseLock').callsFake(() => Promise.resolve());

  //       container.setState({
  //         locks: [ 'p1' ]
  //       })

  //       RELEASE_LOCK(container, { lockableId: 'p1' }).then(() => {
  //         assert.deepEqual(container.state.locks, []);
  //         done();
  //       }).catch(done);
  //     })
  //   });
  // })
})