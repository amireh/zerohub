import Promise from 'Promise';
import debounce from 'utils/debounce';
import omit from 'utils/omit';
import { request } from 'services/PageHub';
import * as CoreDelegate from 'services/CoreDelegate';
import * as PageEncryptionService from 'services/PageEncryptionService';
import * as ErrorCodes from './ErrorCodes';

export function FETCH_PAGE(container, { passPhrase, pageId }) {
  container.setState({ loading: true, loadError: null, page: null });

  return request({ url: `/api/pages/${pageId}` }).then(payload => {
    return payload.pages[0];
  }, () => {
    return Promise.reject(ErrorCodes.PAGE_FETCH_ERROR);
  }).then(page => {
    if (!page.encrypted) {
      return page;
    }
    else {
      return decryptPage(container, { passPhrase, page });
    }
  }).then(page => {
    console.debug('setting page:', page)
    container.setState({
      loading: false,
      loadError: null,
      page
    });

    return page;
  }).catch(errorCode => {
    container.setState({
      loading: false,
      loadError: errorCode,
      page: null,
    });

    throw new Error(errorCode);
  });
}

export function UPDATE_PAGE_CONTENT(container, { pageId, content }) {
  container.setState({
    saving: true,
    saveError: null,
  });

  return request({
    url: `/api/pages/${pageId}`,
    method: 'PATCH',
    body: {
      page: {
        content
      }
    }
  }).then(payload => {
    container.setState({
      saving: false,
      saveError: null,
      page: payload.pages[0]
    })
  }, error => {
    console.error('unable to save page:', error);

    container.setState({
      saving: false,
      saveError: true,
    });
  })
}

export function SET_PAGE_ENCRYPTION_STATUS(container, { folderId, pageId, encrypted }) {
  return Promise.reject(new Error('Not Implemented'))
  // return request({
  //   url: `/api/pages/${pageId}`,
  //   method: 'PATCH',
  //   body: {
  //     page: {
  //       encrypted
  //     }
  //   }
  // }).then(payload => {
  //   container.setState({
  //     pages: container.state.pages.map(page => {
  //       if (page.id === pageId) {
  //         return payload.pages[0];
  //       }
  //       else {
  //         return page;
  //       }
  //     })
  //   })
  // });
}

async function decryptPage(container, { passPhrase, page }) {
  if (!passPhrase) {
    return Promise.reject(ErrorCodes.MISSING_PASS_PHRASE_ERROR);
  }

  try {
    const result = await PageEncryptionService.decryptPageContents({ passPhrase, page });

    if (result.digest !== page.digest) {
      return Promise.reject(ErrorCodes.PAGE_DIGEST_MISMATCH_ERROR);
    }
    else {
      return Object.assign({}, page, { content: result.value });
    }
  }
  catch (e) {
    return Promise.reject(ErrorCodes.PAGE_CIPHER_ERROR);
  }
}
