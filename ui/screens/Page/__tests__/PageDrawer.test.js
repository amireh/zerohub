const PageDrawer = require('../PageDrawer');
const reactSuite = require('test_utils/reactSuite');
const { assert } = require('chai');
const sinonSuite = require('test_utils/sinonSuite');
const { m } = require('react-drill');
const Toggle = require('components/Toggle');

describe('Screens::Page::PageDrawer', function() {
  const sinon = sinonSuite(this);
  const suite = reactSuite(this, PageDrawer, () => ({
    onChangeOfEncryptionStatus: sinon.stub(),
    page: {
      id: 'page1',
      folder_id: 'folder1',
      content: 'Hello World!',
    },
    space: {
      id: 'space1',
      encrypted: false,
    },
    query: {},
    location: {
      pathname: '',
      search: ''
    }
  }));

  it('renders', function() {
    assert(suite.subject.isMounted());
  });

  it('renders a checkbox for setting page encryption status', function() {
    assert.ok(suite.scope.find('label', m.hasText('Encrypt this page')).has(Toggle))
  });

  it('disables the encryption control if there is no passphrase', function() {
    assert.ok(
      suite.scope
        .find('label', m.hasText('Encrypt this page'))
          .find(Toggle)
            .component.props.disabled
    );
  })

  it('emits a change to encryption status', function() {
    suite.setProps({ passPhrase: 'foo' });
    suite.scope.find('label', m.hasText('Encrypt this page'))
      .find(Toggle)
        .click()
    ;

    assert.calledWith(suite.component.props.onChangeOfEncryptionStatus, true);
  });
});