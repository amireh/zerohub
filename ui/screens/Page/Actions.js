// const Promise = require('Promise');
// const PageEncryptionService = require('services/PageEncryptionService');
// const ErrorCodes = require('./ErrorCodes');
const { actions, applyOntoComponent } = require('actions');

exports.FETCH_PAGE = function(container, { passPhrase, pageId }) {
  return applyOntoComponent(container, actions.fetchPage, { passPhrase, pageId });
}

exports.UPDATE_PAGE_CONTENT = function(container, { pageId, passPhrase, encrypted, content }) {
  return applyOntoComponent(container, actions.updatePageContent, { pageId, passPhrase, encrypted, content });
}

exports.SET_PAGE_ENCRYPTION_STATUS = async function(container, { passPhrase, page, encrypted }) {
  return applyOntoComponent(container, actions.setPageEncryptionStatus, { passPhrase, page, encrypted });
}

// async function tryToDecryptPage({ passPhrase, page }) {
//   if (!passPhrase) {
//     return Promise.reject(ErrorCodes.MISSING_PASS_PHRASE_ERROR);
//   }

//   try {
//     const result = await PageEncryptionService.decryptPageContents({ passPhrase, page });

//     if (page.digest && result.digest !== page.digest) {
//       return Promise.reject(ErrorCodes.PAGE_DIGEST_MISMATCH_ERROR);
//     }
//     else {
//       return Object.assign({}, page, { content: result.content });
//     }
//   }
//   catch (e) {
//     return Promise.reject(ErrorCodes.PAGE_CIPHER_ERROR);
//   }
// }

// exports.tryToDecryptPage = tryToDecryptPage;
