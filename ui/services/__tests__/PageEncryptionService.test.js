const PageEncryptionService = require('../PageEncryptionService');
const propagateAsyncErrors = require('utils/propagateAsyncErrors');
const { request } = require('services/PageHub');

describe('Services::PageEncryptionService', function() {
  const passPhrase = 'speak friend and enter';

  describe('.encryptPage', function() {
    afterEach(function() {
      request.restore();
    });

    it('works', propagateAsyncErrors(async function() {
      const page = {
        id: 'page1',
        folder_id: 'folder1',
        content: 'foobar',
        encrypted: false,
        digest: null,
      }

      request.stub(params => {
        return {
          pages: [
            page
          ]
        };
      })

      const nextPage = await PageEncryptionService.encryptPage({ passPhrase, page });
      // TODO: wtf?
    }))
  })
})