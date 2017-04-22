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

export const UPDATE_PAGE_CONTENT = debounce((container, { pageId, content }) => {
  container.setState({
    pagesBeingSaved: Object.assign({}, container.state.pagesBeingSaved, { [pageId]: true })
  });

  return request({
    url: `/api/folders/${folderId}/pages/${pageId}`,
    method: 'PATCH',
    body: {
      page: {
        content
      }
    }
  }).then(payload => {
    container.setState({
      pagesBeingSaved: Object.assign({}, container.state.pagesBeingSaved, { [pageId]: false }),

      pages: container.state.pages.map(page => {
        if (page.id === pageId) {
          return payload.pages[0];
        }
        else {
          return page;
        }
      })
    })
  }, error => {
    console.error('unable to save page:', error);

    container.setState({
      pageSavingErrors: Object.assign({}, container.state.pageSavingErrors, { [pageId]: true }),
      pagesBeingSaved: Object.assign({}, container.state.pagesBeingSaved, { [pageId]: false }),
    });
  })
}, 250, (args) => JSON.stringify([ args.folderId, args.pageId ]));

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
