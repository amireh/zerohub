const { calculateDigest } = require('services/CoreDelegate');
const Promise = require('Promise');
const LockingService = require('services/LockingService');
const { request } = require('services/PageHub');
const encryptPageContents = require('actions/encryptPageContents');
const decryptPageContents = require('actions/decryptPageContents');

exports.encryptPage = function({ passPhrase, page }) {
  if (page.encrypted) {
    return Promise.reject(new Error('Page is already encrypted!'));
  }

  const lockingContext = {
    lockableType: 'Page',
    lockableId: page.id,
  };

  // TODO: transactionalize

  // acquire page lock
  return LockingService.acquireLock(lockingContext).then(() => {
    return calculateDigest({ text: page.content || '' });
  }).then(plainDigest => {
    return encryptPageContents({
      passPhrase,
      page,
    }).then(({ content: encryptedText }) => {
      return { plainDigest, encryptedText }
    });
  }).then(({ plainDigest, encryptedText }) => {
    return request({
      url: `/api/v2/pages/${page.id}`,
      method: 'PATCH',
      body: {
        page: {
          content: encryptedText,
          digest: plainDigest,
          encrypted: true
        }
      }
    })
  }).then(withEncryptedContent => {
    return withEncryptedContent.pages[0];
  })
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
