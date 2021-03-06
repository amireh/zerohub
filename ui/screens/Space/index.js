const React = require('react');
const { Route, Switch, Redirect } = require('react-router-dom');
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
const Modal = require('components/Modal');
const generatePasswordKey = require('utils/generatePasswordKey');

const { actions, applyOntoComponent } = require('actions');
const { PropTypes } = React;

const Space = React.createClass({
  propTypes: {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
    }).isRequired,

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

    onTransition: PropTypes.func,
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

      cancelBulkEncryption: Function.prototype,
      bulkEncryptionType: null,
      bulkEncryptionProgress: null,
      bulkEncryptionFailed: false,

      exportingAsJSON: false,
    };
  },

  componentDidMount() {
    const userId = this.props.user.id;
    const spaceId = this.props.params.id;

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
        {this.state.exportingAsJSON && (
          <Modal
            width={600}
            height={300}
            center
            url={`/spaces/${this.props.params.id}/export?type=json`}
            onClose={() => this.setState({ exportingAsJSON: false })}
          />
        )}

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
    const scope = this.getScopeFromPathname();

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
              {
                onClick: this.exportAsJSON,
                to: `/spaces/${this.props.params.id}/export?format=json`,
                label: I18n.t('Save as JSON')
              },
              {
                onClick: this.exportAsZIP,
                to: `/spaces/${this.props.params.id}/export?format=zip`,
                label: I18n.t('Save as ZIP')
              },
            ]}
            secondaryLinks={[
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
            {...scope}
          />
        </OutletOccupant>

        <OutletOccupant name="MEMBER_SIDE_STATUS_BAR">
          <SpaceActions
            space={space}
            {...scope}
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
                const [ page ] = this.state.pages.filter(x => x.id === pageId);

                if (!page) {
                  return <Redirect to={this.props.match.url} />
                }

                return (
                  <PageRouteHandler
                    location={this.props.location}
                    space={space}
                    params={{ pageId }}
                    query={query}
                    pageTitle={page.title}
                    passPhrase={this.state.passPhrase && this.state.passPhrase.value}
                    isRetrievingPassPhrase={this.state.retrievingPassPhrase}
                    onUpdateQuery={this.props.onUpdateQuery}
                    onChangeOfPage={this.trackUpdatedPage}
                    onRemovePage={this.removePage}
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
                    password={this.state.passPhrase && this.state.passPhrase.value}
                    isRetrievingPassPhrase={this.state.retrievingPassPhrase}
                    onClose={() => this.props.onTransition(query.origin || this.props.match.url)}
                    onChangeOfPassPhrase={this.trackUpdatedPassPhrase}
                    onEncryptAllPages={this.applyBulkEncryption.bind(null, { encrypted: true })}
                    onDecryptAllPages={this.applyBulkEncryption.bind(null, { encrypted: false })}
                    bulkEncryptionType={this.state.bulkEncryptionType}
                    bulkEncryptionProgress={this.state.bulkEncryptionProgress}
                    bulkEncryptionFailed={this.state.bulkEncryptionFailed}
                    onCancelBulkEncryption={this.state.cancelBulkEncryption}
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

  removePage({ pageId }) {
    actions.promptForPageRemoval().then(() => {
      actions.removePage({ pageId }).then(() => {
        this.setState({
          pages: this.state.pages.filter(x => x.id !== pageId)
        })
      })

    })
  },

  addFolder() {

  },

  getScopeFromPathname() {
    if (this.props.location.pathname.match(new RegExp(`${this.props.match.url}/pages/(\\d+)`))) {
      const currentPageId = RegExp.$1;
      const currentFolderId = this.state.pages
        .filter(x => x.id === currentPageId)
        .map(x => x.folder_id)
        [0]
      ;

      return { currentPageId, currentFolderId };
    }
  },

  applyBulkEncryption({ encrypted }) {
    if (!this.state.passPhrase) {
      return;
    }

    const { promise, cancel } = actions.bulkSetPageEncryptionStatus({
      pages: this.state.pages.filter(x => x.encrypted !== encrypted),
      encrypted,
      passPhrase: this.state.passPhrase.value,
      tickFn: ({ page, progress }) => {
        if (!this.isMounted()) {
          return;
        }

        this.setState({
          bulkEncryptionProgress: progress,
          pages: this.state.pages.map(x => x.id === page.id ? page : x)
        })
      }
    })

    this.setState({
      bulkEncryptionType: encrypted ? 'ENCRYPT' : 'DECRYPT',
      bulkEncryptionProgress: 0,
      bulkEncryptionFailed: false,
      cancelBulkEncryption: cancel,
    });

    promise.then(adjustedPages => {
      if (!this.isMounted()) {
        return;
      }

      const adjustedPageIds = adjustedPages.map(x => x.id);

      this.setState({
        bulkEncryptionProgress: null,
        bulkEncryptionFailed: false,
        bulkEncryptionType: null,
        cancelBulkEncryption: Function.prototype,
        pages: this.state.pages
          .filter(x => adjustedPageIds.indexOf(x.id) === -1)
          .concat(adjustedPages)
      })
    }).catch(error => {
      if (!this.isMounted()) {
        return;
      }

      console.error(error);

      this.setState({
        bulkEncryptionFailed: error !== actions.bulkSetPageEncryptionStatus.CANCELED,
        bulkEncryptionProgress: null,
        bulkEncryptionType: null,
        cancelBulkEncryption: Function.prototype,
      })
    });
  },

  exportAsJSON(e) {
    if (e) {
      e.preventDefault();
    }

    actions.exportSpace({
      format: actions.exportSpace.FORMAT_JSON,
      userId: this.props.user.id,
      spaceId: this.props.params.id,
      tickFn() {},
    })
  },

  exportAsZIP(e) {
    if (e) {
      e.preventDefault();
    }

    actions.exportSpace({
      format: actions.exportSpace.FORMAT_ZIP,
      userId: this.props.user.id,
      spaceId: this.props.params.id,
      tickFn() {},
    })
  }
});

module.exports = Space;
