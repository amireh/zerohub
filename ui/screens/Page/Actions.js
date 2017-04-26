const Promise = require('Promise');
const { request } = require('services/PageHub');
const PageEncryptionService = require('services/PageEncryptionService');
const ErrorCodes = require('./ErrorCodes');
const { partial, either, } = require('ramda');

exports.FETCH_PAGE = function(container, { passPhrase, pageId }) {
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

exports.UPDATE_PAGE_CONTENT = function(container, { pageId, passPhrase, encrypted, content }) {
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
        partial(PageEncryptionService.encryptPageContents, [{ passPhrase, page: { content } }])
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

exports.SET_PAGE_ENCRYPTION_STATUS = async function(container, { passPhrase, page, encrypted }) {
  if (encrypted === page.encrypted) {
    return Promise.resolve();
  }

  container.setState({ saving: true });

  try {
    if (encrypted) {
      const encryptedPage = await PageEncryptionService.encryptPage({ passPhrase, page });

      container.setState({
        saving: false,
        page: Object.assign({}, page, {
          digest: encryptedPage.digest,
          encrypted: true,
        })
      });
    }
    // decrypting
    else {
      const decryptedPage = await PageEncryptionService.decryptPage({ passPhrase, page });

      container.setState({
        saving: false,
        page: Object.assign({}, page, {
          digest: null,
          encrypted: false,
          content: decryptedPage.content,
        })
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

async function tryToDecryptPage({ passPhrase, page }) {
  if (!passPhrase) {
    return Promise.reject(ErrorCodes.MISSING_PASS_PHRASE_ERROR);
  }

  try {
    const result = await PageEncryptionService.decryptPageContents({ passPhrase, page });

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

exports.tryToDecryptPage = tryToDecryptPage;

const rethrow = fn => error => { fn(error); throw error; };
const pass = fn => value => { fn(value); return value; };
const transitionState = partialState => container => {
  if (container.isMounted()) {
    container.setState(partialState);
  }

  return Promise.resolve();
};
