const React = require('react');
const { HashRouter, Route, memoryHistory, Switch } = require('react-router-dom');
const Home = require('./Home');
const NotFound = require('./NotFound');
const Spaces = require('./Spaces');
const Space = require('./Space');
const { withQueryFor } = require('utils/routing');
const { partial } = require('ramda');
const { actions } = require('actions');
const { PropTypes } = React;

const APP_ENV = electronRequire('electron').remote.getGlobal('APP_ENV');

const RootWithRoutes = React.createClass({
  childContextTypes: {
    config: PropTypes.object,
  },

  getChildContext() {
    return {
      config: this.getConfig()
    }
  },

  render() {
    const { withRoutingShingles } = this;

    return (
      <HashRouter ref="router" history={memoryHistory}>
        <Switch>
          <Route
            exact
            path="/"
            render={({ location }) => (
              <Home location={location} {...this.props} />
            )}
          />

          <Route
            exact
            path="/spaces"
            render={withQueryFor(withRoutingShingles(Spaces))}
          />

          <Route
            path="/spaces/:id"
            render={withQueryFor(withRoutingShingles(Space))}
          />

          <Route
            exact
            path="/not-found"
            render={withQueryFor(NotFound)}
          />

          <Route component={NotFound} />
        </Switch>
      </HashRouter>
    )
  },

  getConfig() {
    return {
      apiHost: APP_ENV.API_HOST,
      apiToken: APP_ENV.API_TOKEN,
      userId: APP_ENV.API_USER_ID,
    };
  },

  withRoutingShingles(Component) {
    return props => (
      <Component
        onUpdateQuery={partial(actions.updateQuery, [this])}
        onReplaceQuery={partial(actions.updateQuery, [this])}
        onTransition={partial(actions.updateQuery, [this])}
        {...props}
      />
    );
  }
})

module.exports = RootWithRoutes;
