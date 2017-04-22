import { calculateDigest, encrypt, decrypt } from 'services/CoreDelegate';
import Promise from 'Promise';
import * as LockingService from 'services/LockingService';
import { request } from 'services/PageHub';

export async function encryptPage({ passPhrase }, page) {
  if (page.encrypted) {
    return Promise.reject(new Error('Page is already encrypted!'));
  }

  if (page.digest && page.digest !== await calculateDigest({ text: page.content })) {
    return Promise.reject(
      new Error(`Unexpected page content digest; perhaps it is already encrypted?`)
    );
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
  const { encryptedText, digest: encryptedTextDigest } = await encryptPageContents({
    passPhrase,
  }, page);

  // update page

  const withEncryptedContent = await request({
    url: `/api/folders/${page.folder_id}/pages/${page.id}`,
    method: 'PATCH',
    body: {
      page: {
        content: encryptedText,
        digest: encryptedTextDigest,
        encrypted: true
      }
    }
  });

  // release page lock
  await LockingService.releaseLock(lockingContext);

  return withEncryptedContent.pages[0];
}

export function decryptPage(page) {
  if (!page.encrypted) {
    // noop
  }
  else {
    // acquire page lock
    // decrypt contents
    // calculate plain digest
    // update page.content, page.digest, page.encrypted
    // release page lock
  }
}

export async function encryptPageContents({ passPhrase }, page) {
  const { value: encryptedText, digest } = await encrypt({
    passPhrase,
    plainText: page.content
  });

  return {
    content: encryptedText,
    digest
  };
}

export async function decryptPageContents({ passPhrase, page }) {
  const { value: plainText, digest } = await decrypt({
    passPhrase,
    encryptedText: page.content
  });

  return {
    content: plainText,
    digest
  };
}