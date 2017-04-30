const { calculateDigest } = require('services/CoreDelegate');
const Promise = require('Promise');
const LockingService = require('services/LockingService');
const { request } = require('services/PageHub');
const encryptPageContents = require('actions/encryptPageContents');
const decryptPageContents = require('actions/decryptPageContents');

exports.encryptPage = async function({ passPhrase, page }) {
  if (page.encrypted) {
    return Promise.reject(new Error('Page is already encrypted!'));
  }

  const lockingContext = {
    lockableType: 'Page',
    lockableId: page.id,
  };

  // TODO: transactionalize

  // acquire page lock
  await LockingService.acquireLock(lockingContext);

  // encrypt page contents
  // calculated encrypted contents digest
  const plainDigest = await calculateDigest({ text: page.content });
  const { content: encryptedText } = await encryptPageContents({
    passPhrase,
    page,
  });

  // update page

  const withEncryptedContent = await request({
    url: `/api/v2/pages/${page.id}`,
    method: 'PATCH',
    body: {
      page: {
        content: encryptedText,
        digest: plainDigest,
        encrypted: true
      }
    }
  });

  return withEncryptedContent.pages[0];
}

exports.decryptPage = async function({ passPhrase, page }) {
  if (!page.encrypted) {
    return Promise.reject(new Error('Page is already decrypted!'));
  }

  const lockingContext = {
    lockableType: 'Page',
    lockableId: page.id,
  };

  const currentDigest = await calculateDigest({ text: page.content });

  let decryptedPage;

  if (currentDigest !== page.digest) {
    decryptedPage = await decryptPageContents(null, { passPhrase, page });
  }
  else {
    decryptedPage = page;
  }

  // TODO: transactionalize

  // acquire page lock
  return LockingService.acquireLock(lockingContext).then(() => {
    return request({
      url: `/api/v2/pages/${page.id}`,
      method: 'PATCH',
      body: {
        page: {
          content: decryptedPage.content,
          digest: null,
          encrypted: false
        }
      }
    });
  }).then(withDecryptedContent => {
    // release page lock
    return withDecryptedContent.pages[0];
  });
}
