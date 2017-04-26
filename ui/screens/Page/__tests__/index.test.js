const PageRouteHandler = require('../');
const reactSuite = require('test_utils/reactSuite');
const { assert } = require('chai');
const sinonSuite = require('test_utils/sinonSuite');
const assertChange = require('test_utils/assertChange');
const { actions } = require('actions');

describe('Screens::Page::PageRouteHandler', function() {
  const sinon = sinonSuite(this);

  beforeEach(function() {
    sinon.stub(actions, 'fetchPage')
  })

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
    assert.calledWith(actions.fetchPage, sinon.match.any, sinon.match({
      pageId: 'page1',
    }))
  });

  it('fetches the page upon navigation', function() {
    suite.setProps({
      params: {
        pageId: 'page2',
      }
    });

    assert.calledWith(actions.fetchPage, sinon.match.any, sinon.match({
      pageId: 'page2',
    }))
  });

  describe('locking', function() {
    beforeEach(function() {
      sinon.stub(actions, 'acquireLock')
      sinon.stub(actions, 'releaseLock')
    });

    it('attempts to acquire the lock upon load', function() {
      suite.mount();

      assert.calledWith(actions.acquireLock, sinon.match.any, sinon.match({
        lockableType: 'Page',
        lockableId: 'page1'
      }));
    })

    it('releases the previous page lock on transition', function() {
      const props = {
        params: { pageId: 'page2' },
      };

      assertChange({
        fn: () => suite.setProps(props),
        of: () => actions.releaseLock.callCount,
        by: 1
      });

      assert.calledWith(actions.releaseLock, sinon.match.any, {
        lockableType: 'Page',
        lockableId: 'page1'
      })
    })

    it('attempts to acquire the lock of the next page on transition', function() {
      const props = {
        params: { pageId: 'page2' },
      };

      assertChange({
        fn: () => suite.setProps(props),
        of: () => actions.acquireLock.callCount,
        by: 1
      });

      assert.calledWith(actions.acquireLock, sinon.match.any, {
        lockableType: 'Page',
        lockableId: 'page2'
      })
    })

    it('releases the lock on unmount', function() {
      assertChange({
        fn: () => suite.unmount(),
        of: () => actions.releaseLock.callCount,
        by: 1
      });

      assert.calledWith(actions.releaseLock, sinon.match.any, {
        lockableType: 'Page',
        lockableId: 'page1'
      })
    })
  });
});