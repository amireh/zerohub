import Page from '../Page';
import reactSuite from 'test_utils/reactSuite';
import { assert } from 'chai';
import sinonSuite from 'test_utils/sinonSuite';
import wrapCornflux from 'test_utils/wrapCornflux';
import LoadingIndicator from '../LoadingIndicator';
import { drill, m } from 'react-drill';
import * as ErrorCodes from '../ErrorCodes';
import ErrorMessage from 'components/ErrorMessage';

describe('Screens::Page::Component', function() {
  const sinon = sinonSuite(this);
  const suite = reactSuite(this, wrapCornflux(Page), () => ({
    dispatch: sinon.stub(),
    page: {
      id: 'page1',
      folder_id: 'folder1',
      content: 'Hello World!',
    },
    space: {
      id: 'space1',
      encrypted: false,
    },
    query: {}
  }));

  it('renders', function() {
    assert(suite.subject.isMounted());
  });

  it('renders the editor for the initial page', function() {
    assert(drill(suite.subject).has('textarea', m.hasText('Hello World!')))
  });

  it('renders a loading indicator', function() {
    suite.setProps({ page: null, loading: true });
    drill(suite.subject).find(LoadingIndicator);
  })

  const ErrorMessages = [
    {
      code: ErrorCodes.PAGE_FETCH_ERROR,
      message: `Sorry! We were unable to load the page.`,
    },

    {
      code: ErrorCodes.PAGE_CIPHER_ERROR,
      message: `It seems this page was encrypted using a different pass-phrase`,
    },

    {
      code: ErrorCodes.PAGE_DIGEST_MISMATCH_ERROR,
      message: `We've encountered a likely internal error while decrypting`,
    },
    {
      code: ErrorCodes.MISSING_PASS_PHRASE_ERROR,
      message: `This page is encrypted but you have not supplied`,
    },
  ];

  ErrorMessages.forEach(function({ code, message }) {
    it(`renders loading error "${code}"`, function() {
      suite.setProps({ loadError: code });

      assert.include(drill(suite.subject).find(ErrorMessage).node.textContent,
        message
      );
    });
  })

  it('renders the editor', function() {
    suite.setProps({
      page: {
        id: 'page1',
        content: '# Hello World!'
      }
    })
  })
});