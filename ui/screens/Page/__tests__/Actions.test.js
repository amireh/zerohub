import * as Actions from '../Actions';
import * as ErrorCodes from '../ErrorCodes';
import * as PageEncryptionService from 'services/PageEncryptionService';
import sinonSuite from 'test_utils/sinonSuite';
import propagateAsyncErrors from 'utils/propagateAsyncErrors';
import { request } from 'services/PageHub';
import { assert } from 'chai';

describe('Screens::Page::Actions', function() {
  const sinon = sinonSuite(this);

  beforeEach(function() {
  })

  afterEach(function() {
    request.restore();
  })

  describe('.FETCH_PAGE', function() {
    const subject = Actions.FETCH_PAGE;
    const passPhrase = 'speak friend and enter';
    let container;

    beforeEach(function() {
      container = {
        isMounted() { return true; },
        setState(nextState) {
          Object.assign(container.state, nextState)
        },
        state: {
          page: null,
          loading: false,
          loadError: null,
        },
      }
    })

    it('retrieves the page', function(done) {
      request.stub(function(params) {
        assert.include(params, {
          url: '/api/v2/pages/page1'
        })

        done();
      });

      subject(container, { pageId: 'page1' });
    });

    it('decrypts the page contents if it is encrypted', propagateAsyncErrors(async function(done) {
      const page = {
        id: 'page1',
        content: 'ce6ec0e11195b8ff82b39f67c602d4a0',
        digest: 'c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2',
        encrypted: true
      };

      request.stub(function(params) {
        assert.include(params, {
          url: '/api/v2/pages/page1'
        })

        return Promise.resolve({ pages: [ page ] })
      });

      sinon.spy(PageEncryptionService, 'decryptPageContents');

      await subject(container, { pageId: 'page1', passPhrase });

      assert.calledWith(PageEncryptionService.decryptPageContents, { passPhrase, page });

      done();
    }));

    it('raises an error if fetch fails', function(done) {
      request.stub(function() {
        return Promise.reject()
      });

      subject(container, { pageId: 'page1', passPhrase }).then(function() {
        done('should not succeed!!!')
      }).catch(function() {
        assert.equal(container.state.loadError, ErrorCodes.PAGE_FETCH_ERROR)
        done();
      });
    });

    it('raises an error if page is encrypted and there is no pass-phrase', function(done) {
      request.stub(function() {
        return Promise.resolve({ pages: [{ id: 'page1', content: 'asdf', encrypted: true }] })
      });

      subject(container, { pageId: 'page1' }).then(function() {
        done('should not succeed!!!')
      }).catch(function() {
        assert.equal(container.state.loadError, ErrorCodes.MISSING_PASS_PHRASE_ERROR)
        done();
      });
    });

    it('raises an error if decryption fails', function(done) {
      request.stub(function() {
        return Promise.resolve({ pages: [{ id: 'page1', content: 'asdf', encrypted: true }] })
      });

      sinon.stub(PageEncryptionService, 'decryptPageContents').callsFake(() => {
        return Promise.reject();
      });

      subject(container, { pageId: 'page1', passPhrase }).then(function() {
        done('should not succeed!!!')
      }).catch(function() {
        assert.equal(container.state.loadError, ErrorCodes.PAGE_CIPHER_ERROR)
        done();
      });
    });

    it('raises an error if decrypted digest does not match', function(done) {
      request.stub(function() {
        return Promise.resolve({ pages: [{ id: 'page1', content: 'asdf', encrypted: true, digest: 'fake' }] })
      });

      sinon.stub(PageEncryptionService, 'decryptPageContents').callsFake(() => {
        return Promise.resolve({
          value: 'xoxo',
          digest: 'wahahah'
        });
      });

      subject(container, { pageId: 'page1', passPhrase }).then(function() {
        done('should not succeed!!!')
      }).catch(function() {
        assert.equal(container.state.loadError, ErrorCodes.PAGE_DIGEST_MISMATCH_ERROR)
        done();
      });
    })
  });
})