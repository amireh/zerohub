const React = require('react');
const { ActionProvider } = require('cornflux');
const Page = require('./Page');
const Actions = require('./Actions');
const actions = require('actions');
const { PropTypes } = React;

const PageRouteHandler = React.createClass({
  contextTypes: {
    config: PropTypes.object,
  },

  propTypes: {
    dispatch: PropTypes.func.isRequired,

    space: PropTypes.shape({
      id: PropTypes.string.isRequired,
      encrypted: PropTypes.bool,
    }).isRequired,

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
    this.props.dispatch('FETCH_PAGE', {
      pageId: this.props.params.pageId,
      passPhrase: this.props.passPhrase,
    });

    actions.applyOntoComponent(this, actions.acquireLock, {
      lockableType: 'Page',
      lockableId: this.props.params.pageId,
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.pageId !== this.props.params.pageId) {
      actions.applyOntoComponent(this, actions.releaseLock, {
        lockableType: 'Page',
        lockableId: this.props.params.pageId,
      });

      actions.applyOntoComponent(this, actions.acquireLock, {
        lockableType: 'Page',
        lockableId: nextProps.params.pageId,
      });

      this.props.dispatch('FETCH_PAGE', {
        pageId: nextProps.params.pageId,
        passPhrase: nextProps.passPhrase,
      });
    }
  },

  componentWillUnmount() {
    actions.applyOntoComponent(this, actions.releaseLock, {
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
      />
    );
  },
});

module.exports = ActionProvider(PageRouteHandler, {
  actions: Actions,
  verbose: true,
});

