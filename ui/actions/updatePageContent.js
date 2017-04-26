const { either, partial } = require('ramda');
const { request } = require('services/PageHub');
const PageEncryptionService = require('services/PageEncryptionService');
const { rethrow } = require('./asyncUtils');

module.exports = function updatePageContent({ setState }, { pageId, passPhrase, encrypted, content }) {
  const passIfNotEncrypted = () => !encrypted && { content };
  const savePage = pageToCommit => request({
    url: `/api/v2/pages/${pageId}`,
    method: 'PATCH',
    body: {
      page: {
        content: pageToCommit.content,
        digest: pageToCommit.digest,
      }
    }
  });

  setState({ saving: true, saveError: null, })

  return (
    Promise.resolve().then(
      either(
        passIfNotEncrypted,
        partial(PageEncryptionService.encryptPageContents, [{ passPhrase, page: { content } }])
      )
    )
    .then(savePage)
    .then(
      partial(setState, [{ saving: false, saveError: null, }])
    )
    .catch(
      rethrow(
        partial(setState, [{ saving: false, saveError: true, }])
      )
    )
  );
}