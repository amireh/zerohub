const React = require('react');
const { Route, Switch } = require('react-router-dom');
const PageBrowser = require('./PageBrowser');
const PassPhraseModal = require('./PassPhraseModal');
const OutletOccupant = require('components/OutletOccupant');
const MemberLayout = require('components/MemberLayout');
const { withQuery } = require('utils/routing');
const classSet = require('classnames');
const PageRouteHandler = require('screens/Page');
const SpaceSettings = require('screens/SpaceSettings');
const SpaceActions = require('./SpaceActions');
const UserMenu = require('components/UserMenu');
const ErrorMessage = require('components/ErrorMessage');
const generatePasswordKey = require('utils/generatePasswordKey');

const { actions, applyOntoComponent } = require('actions');
const { PropTypes } = React;

const Space = React.createClass({
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

    user: PropTypes.shape({
      id: PropTypes.string,
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
    const userId = this.props.user.id;
    const spaceId = this.props.params.id;

    applyOntoComponent(this, actions.fetchSpaces, {
      userId,
    });

    applyOntoComponent(this, actions.fetchSpace, {
      userId,
      spaceId
    });

    applyOntoComponent(this, actions.retrievePassPhrase, {
      key: generatePasswordKey({ userId, spaceId }),
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      const userId = nextProps.user.id;
      const spaceId = nextProps.params.id;

      applyOntoComponent(this, actions.fetchSpace, {
        userId,
        spaceId
      });

      applyOntoComponent(this, actions.retrievePassPhrase, {
        key: generatePasswordKey({ userId, spaceId }),
      });
    }
  },

  render() {
    return (
      <MemberLayout>
        {this.state.loadingSpace && <p>Loading...</p>}

        {this.state.spaceLoadError && (
          <ErrorMessage>
            {I18n.t('Oops! There was an error loading space data.')}
          </ErrorMessage>
        )}

        {this.state.space && this.renderSpace(this.state.space)}
      </MemberLayout>
    );
  },

  renderSpace(space) {
    const origin = `${this.props.location.pathname}${this.props.location.search}`;

    return (
      <div
        className={classSet("pure-g space", {
          'space--with-drawer': this.props.query.drawer === '1'
        })}
      >
        {this.state.showingGeneratedPassPhrase && (
          <PassPhraseModal passPhrase={this.state.passPhrase} />
        )}

        <OutletOccupant name="MEMBER_MENU">
          <UserMenu
            user={this.props.user}
            title={space.title}
            links={[
              {
                to: `${this.props.match.url}/settings?origin=${origin}`,
                label: I18n.t('Space settings')
              },
              { to: '/spaces', label: I18n.t('Switch space') },
            ]}
          />
        </OutletOccupant>

        <OutletOccupant name="MEMBER_SIDEBAR">
          <PageBrowser
            space={space}
            folders={this.state.folders}
            pages={this.state.pages}
            match={this.props.match}
          />
        </OutletOccupant>

        <OutletOccupant name="MEMBER_SIDE_STATUS_BAR">
          <SpaceActions
            space={space}
            currentPageId={this.state.currentPageId}
            currentFolderId={this.state.currentFolderId}
            onAddPage={this.addPage}
            onAddFolder={this.addFolder}
          />
        </OutletOccupant>

        <div className="pure-u-1-1 space__content-container">
          <Switch>
            <Route
              exact
              path={`${this.props.match.url}/pages/:id`}
              render={withQuery(({ match, query }) => {
                const pageId = match.params.id;

                return (
                  <PageRouteHandler
                    location={this.props.location}
                    space={space}
                    params={{ pageId }}
                    query={query}
                    pageTitle={this.state.pages.filter(x => x.id === pageId)[0].title}
                    passPhrase={this.state.passPhrase && this.state.passPhrase.value}
                    isRetrievingPassPhrase={this.state.retrievingPassPhrase}
                    onUpdateQuery={this.props.onUpdateQuery}
                    onChangeOfPage={this.trackUpdatedPage}
                    onEnter={this.trackPageAndFolder}
                  />
                );
              })}
            />

            <Route
              exact
              path={`${this.props.match.url}/settings`}
              render={withQuery(({ query }) => {
                return (
                  <SpaceSettings
                    space={space}
                    user={this.props.user}
                    query={query}
                    pages={this.state.pages}
                    passPhrase={this.state.passPhrase && this.state.passPhrase.value}
                    isRetrievingPassPhrase={this.state.retrievingPassPhrase}
                    onClose={() => this.props.onTransition(query.origin || this.props.match.url)}
                    onChangeOfPassPhrase={this.trackUpdatedPassPhrase}
                  />
                );
              })}
            />
          </Switch>
        </div>
      </div>
    )
  },

  trackUpdatedPage(nextPage) {
    this.setState({
      pages: this.state.pages.map(page => {
        if (page.id === nextPage.id) {
          return nextPage;
        }
        else {
          return page
        }
      })
    })
  },

  trackUpdatedPassPhrase(nextPassPhrase) {
    this.setState({
      passPhrase: nextPassPhrase
    });
  },

  trackPageAndFolder({ pageId, folderId }) {
    this.setState({
      currentPageId: pageId,
      currentFolderId: folderId,
    })
  },

  addPage() {
    const [ rootFolder ] = this.state.folders.filter(x => !x.folder_id);
    const folderId = this.state.currentFolderId || rootFolder && rootFolder.id;

    if (!folderId) {
      console.warn('Can not create a page with no folder!')
      return;
    }

    actions.createPage({
      folderId,
      spaceId: this.state.space.id,
    }).then(page => {
      this.setState({
        pages: this.state.pages.concat(page)
      });

      this.props.onTransition(`${this.props.match.url}/pages/${page.id}`)
    })
  },

  addFolder() {

  }
});

module.exports = Space;
