import { request } from 'services/PageHub';
import * as CoreDelegate from 'services/CoreDelegate';

export function FETCH_SPACES(container, {}) {
  container.setState({ loadingSpaces: true });

  return request({
    url: `/api/v2/spaces`
  }).then(payload => {
    container.setState({ spaces: payload.spaces })
  }, error => {
    console.error('request failed:', error)
    container.setState({ spacesLoadError: true })
  }).then(() => {
    container.setState({ loadingSpaces: false });
  })

  // return Promise.resolve();
}

export function FETCH_SPACE(container, { spaceId }) {
  container.setState({ loadingSpace: true });

  return Promise.all([
    request({ url: `/api/v2/spaces/${spaceId}` }),
    request({ url: `/api/spaces/${spaceId}/folders` }),
    request({ url: `/api/v2/pages?space_id=${spaceId}` }),
  ]).then(payloads => {
    container.setState({
      loadingSpace: false,
      space: payloads[0].spaces[0],
      folders: payloads[1].folders,
      pages: payloads[2].pages,
    })
  }).catch(error => {
    container.setState({ loadingSpace: false, spaceLoadError: true })

    throw error;
  });
}

// export function SET_PAGE_ENCRYPTION_STATUS(container, { folderId, pageId, encrypted }) {
//   return request({
//     url: `/api/v2/folders/${folderId}/pages/${pageId}`,
//     method: 'PATCH',
//     body: {
//       page: {
//         encrypted
//       }
//     }
//   }).then(payload => {
//     container.setState({
//       pages: container.state.pages.map(page => {
//         if (page.id === pageId) {
//           return payload.pages[0];
//         }
//         else {
//           return page;
//         }
//       })
//     })
//   });
// }

// export function ENCRYPT_PAGE(container, { passPhrase, folderId, pageId, content }) {
//   return CoreDelegate.encrypt({
//     passPhrase: passPhrase,
//     plainText: content
//   }).then(({ value, digest }) => {
//     return request({
//       url: `/api/v2/folders/${folderId}/pages/${pageId}`,
//       method: 'PATCH',
//       body: {
//         page: {
//           content: value,
//           digest: digest,
//         }
//       }
//     })
//   }).catch(error => {
//     console.error('unable to generate pass phrase');

//     throw error;
//   })
// }

export function RETRIEVE_PASS_PHRASE(container, { spaceId }) {
  container.setState({ retrievingPassPhrase: true, passPhraseRetrievalError: false });

  return CoreDelegate.retrievePassPhrase({ spaceId }).then(passPhrase => {
    container.setState({
      passPhrase: passPhrase || null,
      retrievingPassPhrase: false,
      passPhraseRetrievalError: false,
    });
  }, error => {
    console.error('unable to generate pass phrase');

    container.setState({
      retrievingPassPhrase: false,
      passPhraseRetrievalError: true,
    });
  })
}

export function GENERATE_PASS_PHRASE(container, { spaceId }) {
  container.setState({ generatingPassPhrase: true });

  return CoreDelegate.generatePassPhrase({ spaceId }).then(passPhrase => {
    container.setState({
      passPhrase: passPhrase || null,
      generatingPassPhrase: false
    });
  }, error => {
    console.error('unable to generate pass phrase');

    container.setState({ generatingPassPhrase: false });

    throw error;
  })
}

// export function DECRYPT_PAGE(container, { pageId, passPhrase, content }) {
//   container.setState({
//     pagesBeingDecrypted: Object.assign({}, container.state.pagesBeingDecrypted, { [pageId]: true })
//   });

//   return CoreDelegate.decrypt({
//     encryptedText: content,
//     passPhrase: passPhrase.value,
//   }).then(plainText => {
//     return CoreDelegate.digest({
//       passPhrase: passPhrase.value,
//       plainText,
//     }).then(digest => {
//       return { plainText, digest };
//     });
//   }).then(({ plainText, digest }) => {
//     container.setState({
//       pagesBeingDecrypted: Object.assign({}, container.state.pagesBeingDecrypted, { [pageId]: false }),
//       decryptedContents: Object.assign({}, container.state.decryptedContents, { [pageId]: plainText }),
//       decryptedDigests: Object.assign({}, container.state.decryptedDigests, { [pageId]: digest }),
//     });
//   }).catch(error => {
//     console.error('unable to decrypt page:', error);

//     container.setState({
//       pageDecryptionErrors: Object.assign({}, container.state.pageDecryptionErrors, { [pageId]: true }),
//       pagesBeingDecrypted: Object.assign({}, container.state.pagesBeingDecrypted, { [pageId]: false }),
//     });
//   });
// }

// export function VALIDATE_PAGE_INTEGRITY(container, { passPhrase, pageId, content }) {
//   return CoreDelegate.digest({
//     passPhrase: passPhrase,
//     plainText: content
//   }).then(digest => {
//     container.setState({
//       localDigests: Object.assign({}, container.state.localDigests, {
//         [pageId]: digest
//       })
//     });

//   }).catch(error => {
//     console.error('unable to calculate digest for page');

//     throw error;
//   })
// }
