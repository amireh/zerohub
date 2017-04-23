import Promise from 'Promise';
import { request } from 'services/PageHub';
import {
  encryptPage,
  encryptPageContents,
  decryptPage,
  decryptPageContents,
} from 'services/PageEncryptionService';
import * as ErrorCodes from './ErrorCodes';
import { partial, either, } from 'ramda';

export function FETCH_PAGE(container, { passPhrase, pageId }) {
  const parsePage = payload => payload.pages[0];
  const emitError = errorCode => () => Promise.reject(errorCode);
  const passIfNotEncrypted = page => !page.encrypted && page;

  return (
    transitionState({ loading: true, loadError: null, page: null })(container)
    .then(
      partial(request, [{ url: `/api/v2/pages/${pageId}` }])
    )
    .then(
      parsePage,
      emitError(ErrorCodes.PAGE_FETCH_ERROR)
    )
    .then(
      either(
        passIfNotEncrypted,
        page => tryToDecryptPage({ passPhrase, page })
      )
    )
    .then(
      pass(page =>
        transitionState({ loading: false, loadError: null, page })(container)
      )
    )
    .catch(rethrow(errorCode => {
      transitionState({ loading: false, loadError: errorCode, page: null })(container)
    }))
  );
}

export function UPDATE_PAGE_CONTENT(container, { pageId, passPhrase, encrypted, content }) {
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

  return (
    transitionState({ saving: true, saveError: null, })(container)
    .then(
      either(
        passIfNotEncrypted,
        partial(encryptPageContents, [{ passPhrase, page: { content } }])
      )
    )
    .then(savePage)
    .then(
      partial(transitionState({ saving: false, saveError: null, }), [container])
    )
    .catch(
      rethrow(
        partial(transitionState({ saving: false, saveError: true, }), [container])
      )
    )
  );
}

export async function SET_PAGE_ENCRYPTION_STATUS(container, { passPhrase, page, encrypted }) {
  if (encrypted === page.encrypted) {
    return Promise.resolve();
  }

  container.setState({ saving: true });

  try {
    if (encrypted) {
      const encryptedPage = await encryptPage({ passPhrase, page });

      container.setState({
        saving: false,
        page: encryptedPage
      });
    }
    // decrypting
    else {
      const decryptedPage = await decryptPage({ passPhrase, page });

      container.setState({
        saving: false,
        page: decryptedPage
      });
    }
  }
  catch (e) {
    container.setState({
      saving: false,
      saveError: true
    })

    throw e;
  }
}

// async function encryptPage(container, { passPhrase, page }) {
//   if (!passPhrase) {
//     return Promise.reject(ErrorCodes.MISSING_PASS_PHRASE_ERROR);
//   }

//   try {
//     const result = await PageEncryptionService.encryptPageContents({ passPhrase, page });

//     return Object.assign({}, page, {
//       content: result.content,
//       digest: result.digest
//     });
//   }
//   catch (e) {
//     return Promise.reject(ErrorCodes.PAGE_CIPHER_ERROR);
//   }
// }

async function tryToDecryptPage({ passPhrase, page }) {
  if (!passPhrase) {
    return Promise.reject(ErrorCodes.MISSING_PASS_PHRASE_ERROR);
  }

  try {
    const result = await decryptPageContents({ passPhrase, page });

    if (page.digest && result.digest !== page.digest) {
      return Promise.reject(ErrorCodes.PAGE_DIGEST_MISMATCH_ERROR);
    }
    else {
      return Object.assign({}, page, { content: result.content });
    }
  }
  catch (e) {
    return Promise.reject(ErrorCodes.PAGE_CIPHER_ERROR);
  }
}

const rethrow = fn => error => { fn(error); throw error; };
const pass = fn => value => { fn(value); return value; };
const transitionState = partialState => container => {
  if (container.isMounted()) {
    container.setState(partialState);
  }

  return Promise.resolve();
};
