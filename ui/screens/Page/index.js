const React = require('react');
const Page = require('./Page');
const { actions, applyOntoComponent } = require('actions');
const { PropTypes } = React;

const PageRouteHandler = React.createClass({
  propTypes: {
    space: PropTypes.shape({
      id: PropTypes.string.isRequired,
      encrypted: PropTypes.bool,
    }).isRequired,

    onUpdateQuery: PropTypes.func.isRequired,

    passPhrase: PropTypes.string,
    params: PropTypes.shape({
      pageId: PropTypes.string.isRequired,
    }).isRequired,

    query: PropTypes.shape({
      'drawer': PropTypes.oneOf([ '1', null ]),
      'page-settings': PropTypes.oneOf([ '1', null ]),
    }).isRequired,
  },

  getInitialState() {
    return {
      loading: false,
      loadError: null,
      page: null,
      locks: [],
    };
  },

  componentDidMount() {
    applyOntoComponent(this, actions.fetchPage, {
      pageId: this.props.params.pageId,
      passPhrase: this.props.passPhrase,
    });

    applyOntoComponent(this, actions.acquireLock, {
      lockableType: 'Page',
      lockableId: this.props.params.pageId,
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.pageId !== this.props.params.pageId) {
      applyOntoComponent(this, actions.releaseLock, {
        lockableType: 'Page',
        lockableId: this.props.params.pageId,
      });

      applyOntoComponent(this, actions.acquireLock, {
        lockableType: 'Page',
        lockableId: nextProps.params.pageId,
      });

      applyOntoComponent(this, actions.fetchPage, {
        pageId: nextProps.params.pageId,
        passPhrase: nextProps.passPhrase,
      });

      this.setState({ loadError: null, saveError: null });
    }
  },

  componentWillUnmount() {
    applyOntoComponent(this, actions.releaseLock, {
      lockableType: 'Page',
      lockableId: this.props.params.pageId,
    });
  },

  render() {
    return (
      <Page
        {...this.state}
        {...this.props}
        canEdit={this.state.locks.indexOf(this.props.params.pageId) > -1}
        onUpdateContent={this.updateContent}
        onUpdatePageEncryptionStatus={this.updatePageEncryptionStatus}
        onUpdateQuery={this.props.onUpdateQuery}
        onUpdateTitle={this.updateTitle}
      />
    );
  },

  updateContent(nextContent) {
    applyOntoComponent(this, actions.updatePageContent, {
      pageId: this.state.page.id,
      encrypted: this.state.page.encrypted,
      passPhrase: this.props.passPhrase,
      content: nextContent
    })
  },

  updatePageEncryptionStatus(nextStatus) {
    applyOntoComponent(this, actions.setPageEncryptionStatus, {
      page: this.state.page,
      encrypted: nextStatus,
      passPhrase: this.props.passPhrase,
    }).then(() => {
      this.props.onChangeOfPage(this.state.page);
    })
  },

  updateTitle(nextTitle) {
    if (nextTitle === this.state.page.title) {
      return;
    }

    applyOntoComponent(this, actions.updatePage, {
      pageId: this.state.page.id,
      attributes: {
        title: nextTitle
      }
    }).then(payload => {
      if (!this.isMounted()) {
        return;
      }

      Object.assign(this.state.page, {
        title: payload.pages[0].title
      });

      this.props.onChangeOfPage(this.state.page);
    })
  },
});

module.exports = PageRouteHandler;

