import { calculateDigest, encrypt, decrypt } from 'services/CoreDelegate';
import Promise from 'Promise';
import * as LockingService from 'services/LockingService';
import { request } from 'services/PageHub';

export async function encryptPage({ passPhrase, page }) {
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

  // release page lock
  await LockingService.releaseLock(lockingContext);

  return withEncryptedContent.pages[0];
}

export async function decryptPage({ passPhrase, page }) {
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
    decryptedPage = await decryptPageContents({ passPhrase, page });
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
    return LockingService.releaseLock(lockingContext).then(() => {
      return withDecryptedContent.pages[0];
    });
  });
}

export async function encryptPageContents({ passPhrase, page }) {
  const encryptedText = await encrypt({
    passPhrase,
    plainText: page.content
  });

  return {
    content: encryptedText,
    digest: await calculateDigest({ text: page.content })
  };
}

export async function decryptPageContents({ passPhrase, page }) {
  const plainText = await decrypt({
    passPhrase,
    encryptedText: page.content
  });

  return {
    content: plainText,
    digest: await calculateDigest({ text: plainText }),
  };
}