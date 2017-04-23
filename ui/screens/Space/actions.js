import debounce from 'utils/debounce';
import * as PageHub from 'services/PageHub';
import * as CoreDelegate from 'services/CoreDelegate';

export function FETCH_SPACES(container, { userId }) {
  container.setState({ loadingSpaces: true });

  return PageHub.request({
    url: `/api/users/${userId}/spaces`
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

export function FETCH_SPACE(container, { userId, spaceId }) {
  container.setState({ loadingSpace: true });

  return PageHub.request({
    url: `/api/users/${userId}/spaces/${spaceId}`
  }).then(payload => {
    container.setState({
      space: payload.spaces[0],
      folders: payload.spaces[0].folders,
      pages: payload.spaces[0].pages,
    })
  }, error => {
    console.error('request failed:', error)
    container.setState({ spaceLoadError: true })
  }).then(() => {
    container.setState({ loadingSpace: false });
  })
}

// export function SET_PAGE_ENCRYPTION_STATUS(container, { folderId, pageId, encrypted }) {
//   return PageHub.request({
//     url: `/api/folders/${folderId}/pages/${pageId}`,
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
//     return PageHub.request({
//       url: `/api/folders/${folderId}/pages/${pageId}`,
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
