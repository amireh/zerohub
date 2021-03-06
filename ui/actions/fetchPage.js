const Promise = require('Promise');
const { request } = require('services/PageHub');
const ErrorCodes = require('ErrorCodes');
const { rethrow, pass } = require('./asyncUtils');
const decryptPageContents = require('./decryptPageContents');

module.exports = function fetchPage({ setState }, { passPhrase, pageId }) {
  const parsePage = payload => payload.pages[0];
  const emitError = errorCode => () => Promise.reject(errorCode);
  const passIfNotEncrypted = page => !page.encrypted && page;

  setState({ loading: true, loadError: null, page: null });

  return (
    request({ url: `/api/v2/pages/${pageId}` })
    .then(
      parsePage,
      emitError(ErrorCodes.PAGE_FETCH_ERROR)
    )
    .then(page => (
      passIfNotEncrypted(page) || tryToDecryptPage({ passPhrase, page })
    ))
    .then(
      pass(page =>
        setState({ loading: false, loadError: null, page })
      )
    )
    .catch(rethrow(errorCode => {
      setState({ loading: false, loadError: errorCode, page: null })
    }))
  );
}

async function tryToDecryptPage({ passPhrase, page }) {
  if (!passPhrase) {
    return Promise.reject(ErrorCodes.MISSING_PASS_PHRASE_ERROR);
  }

  try {
    const result = await decryptPageContents(null, { passPhrase, page });

    if (page.digest && result.digest !== page.digest) {
      return Promise.reject(ErrorCodes.PAGE_DIGEST_MISMATCH_ERROR);
    }
    else {
      return Object.assign({}, page, { content: result.content });
    }
  }
  catch (e) {
    console.warn('unexpected error:', e)
    return Promise.reject(ErrorCodes.PAGE_CIPHER_ERROR);
  }
}
