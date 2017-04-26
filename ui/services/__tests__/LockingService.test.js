import * as LockingService from '../LockingService';
import { request } from 'services/PageHub';
import { assert } from 'chai';

describe('Services::LockingService', function() {
  afterEach(function() {
    request.restore();
  });

  describe('.acquireLock', function() {
    it('works', function(done) {
      request.stub(params => {
        assert.equal(params.url, `/api/v2/locks`);
        assert.equal(params.method, 'POST');
        assert.deepEqual(params.body, {
          resource_type: 'Page',
          resource_id: 'p1'
        });

        done();
      })

      LockingService.acquireLock({
        lockableType: 'Page',
        lockableId: 'p1'
      }).catch(done);
    })
  })

  describe('.releaseLock', function() {
    it('works', function(done) {
      request.stub(params => {
        assert.equal(params.url, `/api/v2/locks`);
        assert.equal(params.method, 'DELETE');
        assert.deepEqual(params.body, {
          resource_type: 'Page',
          resource_id: 'p1'
        });

        done();
      })

      LockingService.releaseLock({
        lockableType: 'Page',
        lockableId: 'p1'
      }).catch(done);
    })
  })
})