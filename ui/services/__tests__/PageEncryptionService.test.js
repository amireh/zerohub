const PageEncryptionService = require('../PageEncryptionService');
const { request } = require('services/PageHub');

describe('Services::PageEncryptionService', function() {
  const passPhrase = 'speak friend and enter';

  describe('.encryptPage', function() {
    afterEach(function() {
      request.restore();
    });

    it('works', function() {
      const page = {
        id: 'page1',
        folder_id: 'folder1',
        content: 'foobar',
        encrypted: false,
        digest: null,
      }

      request.stub(() => {
        return { pages: [ page ] };
      })

      return PageEncryptionService.encryptPage({ passPhrase, page });
      // TODO: what now :D
    })
  })
})