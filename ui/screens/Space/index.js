const React = require('react');
const { ActionProvider } = require('cornflux');
const { Route } = require('react-router-dom');
const SpaceBrowser = require('./SpaceBrowser');
const PassPhraseModal = require('./PassPhraseModal');
const OutletProvider = require('components/OutletProvider');
const Outlet = require('components/Outlet');
const { withQuery } = require('utils/routing');
const classSet = require('classnames');
const Actions = require('./actions');
const PageRouteHandler = require('screens/Page');
const { PropTypes } = React;

const Space = React.createClass({
  contextTypes: {
    dispatch: PropTypes.func,
    config: PropTypes.object,
  },

  propTypes: {
    onUpdateQuery: PropTypes.func,
  },

  getInitialState() {
    return {
      space: null,
      spaces: [],
      pages: [],
      folders: [],
      decryptedContents: {},
      decryptedDigests: {},
      passPhrase: null,
      loadingSpace: false,
      spaceLoadError: null,
      // savingPage: false,
      pagesBeingSaved: {},
      pagesBeingDecrypted: {},
      pageSavingErrors: {},
      pageDecryptionErrors: {},
      // pageSaveError: false,
      retrievingPassPhrase: false,
      passPhraseRetrievalError: false,
    };
  },

  componentDidMount() {
    const { config } = this.context;

    this.context.dispatch('FETCH_SPACES', {
      userId: config.userId,
    });

    this.context.dispatch('FETCH_SPACE', {
      userId: config.userId,
      spaceId: this.props.params.id
    });

    this.props.dispatch('RETRIEVE_PASS_PHRASE', { spaceId: this.props.params.id });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      const { config } = this.context;

      this.context.dispatch('FETCH_SPACE', {
        userId: config.userId,
        spaceId: nextProps.params.id,
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
                const { params } = match;
                const pageId = params.id;

                return (
                  <PageRouteHandler
                    space={space}
                    params={{ pageId }}
                    query={query}
                    pageTitle={this.state.pages.filter(x => x.id === pageId)[0].title}
                    passPhrase={this.state.passPhrase && this.state.passPhrase.value}
                    isRetrievingPassPhrase={this.state.retrievingPassPhrase}
                    onUpdateQuery={this.props.onUpdateQuery}
                  />
                );

                // return (
                //   <Page
                //     query={query}
                //     params={match.params}
                //     space={this.state.space}
                //     page={this.state.pages.filter(x => x.id === params.id)[0]}
                //     decryptedContent={this.state.decryptedContents[pageId] || null}
                //     decryptedDigest={this.state.decryptedDigests[pageId] || null}
                //     isSaving={!!this.state.pagesBeingSaved[pageId]}
                //     isDecrypting={!!this.state.pagesBeingDecrypted[pageId]}
                //     hasSavingError={!!this.state.pageSavingErrors[pageId]}
                //     hasDecryptionError={!!this.state.pageDecryptionErrors[pageId]}
                //   />
                // );
              })}
            />
          </div>

          <Outlet name="SPACE_DRAWER" onChange={this.trackDrawer}>
            <div className="space__drawer-container" />
          </Outlet>
        </div>
      </OutletProvider>
    )
  }
});

module.exports = ActionProvider(Space, {
  actions: Actions
});
