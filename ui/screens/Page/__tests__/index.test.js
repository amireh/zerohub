import PageRouteHandler from '../';
import reactSuite from 'test_utils/reactSuite';
import { assert } from 'chai';
import sinonSuite from 'test_utils/sinonSuite';

describe('Screens::Page::PageRouteHandler', function() {
  const sinon = sinonSuite(this);
  const suite = reactSuite(this, PageRouteHandler, () => {
    return {
      dispatch: sinon.stub(),
      space: {
        id: 'space1',
        encrypted: false,
      },
      params: {
        pageId: 'page1',
      },
      query: {}
    }
  });

  it('fetches the page upon load', function() {
    assert.calledWith(suite.subject.props.dispatch, 'FETCH_PAGE', sinon.match({
      pageId: 'page1',
    }))
  });

  it('fetches the page upon navigation', function() {
    suite.setProps({
      params: {
        pageId: 'page2',
      }
    });

    assert.calledWith(suite.subject.props.dispatch, 'FETCH_PAGE', sinon.match({
      pageId: 'page2',
    }))
  });

});