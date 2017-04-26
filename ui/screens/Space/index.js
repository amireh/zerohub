const React = require('react');
const { Route } = require('react-router-dom');
const SpaceBrowser = require('./SpaceBrowser');
const PassPhraseModal = require('./PassPhraseModal');
const OutletProvider = require('components/OutletProvider');
const Outlet = require('components/Outlet');
const { withQuery } = require('utils/routing');
const classSet = require('classnames');
const PageRouteHandler = require('screens/Page');
const { actions, applyOntoComponent } = require('actions');
const { PropTypes } = React;

const Space = React.createClass({
  contextTypes: {
    config: PropTypes.object,
  },

  propTypes: {
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,

    onUpdateQuery: PropTypes.func,

    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,

    query: PropTypes.shape({
      drawer: PropTypes.oneOf([ '1', null ])
    }).isRequired,
  },

  getInitialState() {
    return {
      space: null,
      spaces: [],
      pages: [],
      folders: [],
      passPhrase: null,
      loadingSpace: false,
      spaceLoadError: null,
      retrievingPassPhrase: false,
      passPhraseRetrievalError: false,
    };
  },

  componentDidMount() {
    const { config } = this.context;

    applyOntoComponent(this, actions.fetchSpaces, {
      userId: config.userId,
    });

    applyOntoComponent(this, actions.fetchSpace, {
      userId: config.userId,
      spaceId: this.props.params.id
    });

    applyOntoComponent(this, actions.retrievePassPhrase, {
      spaceId: this.props.params.id
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      const { config } = this.context;

      applyOntoComponent(this, actions.fetchSpace, {
        userId: config.userId,
        spaceId: nextProps.params.id
      });

      applyOntoComponent(this, actions.retrievePassPhrase, {
        spaceId: nextProps.params.id
      });
    }
  },

  render() {
    return (
      <div>
        {this.state.loadingSpace && <p>Loading space data...</p>}

        {this.state.spaceLoadError && (
          <p className="error-notification">
            Error loading space data!
          </p>
        )}

        {this.state.space && this.renderSpace(this.state.space)}
      </div>
    );
  },

  renderSpace(space) {
    return (
      <OutletProvider names={[ 'SPACE_DRAWER' ]}>
        <div
          className={classSet("pure-g space", {
            'space--with-drawer': this.props.query.drawer === '1'
          })}
        >
          {this.state.showingGeneratedPassPhrase && (
            <PassPhraseModal passPhrase={this.state.passPhrase} />
          )}

          <div className="pure-u-1-1 space__sidebar-container">
            <SpaceBrowser
              space={space}
              spaces={this.state.spaces}
              folders={this.state.folders}
              pages={this.state.pages}
              match={this.props.match}
            />
          </div>

          <div className="pure-u-1-1 space__content-container">
            <Route
              exact
              path={`${this.props.match.url}/pages/:id`}
              render={withQuery(({ match, query }) => {
                const pageId = match.params.id;

                return (
                  <PageRouteHandler
                    space={space}
                    params={{ pageId }}
                    query={query}
                    pageTitle={this.state.pages.filter(x => x.id === pageId)[0].title}
                    passPhrase={this.state.passPhrase && this.state.passPhrase.value}
                    isRetrievingPassPhrase={this.state.retrievingPassPhrase}
                    onUpdateQuery={this.props.onUpdateQuery}
                    onGeneratePassPhrase={this.generatePassPhrase.bind(null, space.id)}
                  />
                );
              })}
            />
          </div>

          <Outlet name="SPACE_DRAWER" onChange={this.trackDrawer}>
            <div className="space__drawer-container" />
          </Outlet>
        </div>
      </OutletProvider>
    )
  },

  generatePassPhrase(spaceId) {
    applyOntoComponent(this, actions.generatePassPhrase, {
      spaceId
    });
  }
});

module.exports = Space;
