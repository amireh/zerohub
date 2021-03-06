const React = require('react');
const { HashRouter, Route, memoryHistory, Switch } = require('react-router-dom');
const Home = require('./Home');
const NotFound = require('./NotFound');
const Spaces = require('./Spaces');
const Space = require('./Space');
const Login = require('./Login');
const Logout = require('./Logout');
const SpaceExport = require('./SpaceExport');
const Splash = require('components/Splash');
const { withQueryFor } = require('utils/routing');
const { partial } = require('lodash');
const { actions } = require('actions');
const createAuthenticatedRoute = require('components/createAuthenticatedRoute');
const ApplicationLoader = require('components/ApplicationLoader');

const { PropTypes } = React;

const RootWithRoutes = React.createClass({
  propTypes: {
    applicationData: PropTypes.shape({
      user: PropTypes.object,
    }),
  },

  getInitialState() {
    return {
      user: this.props.applicationData.user,
    };
  },

  render() {
    const { withRoutingShingles } = this;

    return (
      <HashRouter ref="router" history={memoryHistory}>
        <Switch>
          <Route
            exact
            path="/"
            render={withQueryFor(withRoutingShingles(Home))}
          />

          <Route
            exact
            path="/login"
            render={withQueryFor(withRoutingShingles(props => (
              <Login {...props} onChangeOfUser={this.trackUser} />
            )))}
          />

          <Route
            exact
            path="/logout"
            render={withQueryFor(withRoutingShingles(createAuthenticatedRoute(props => (
              <Logout {...props} onChangeOfUser={this.trackUser} />
            ))))}
          />

          <Route
            exact
            path="/spaces"
            render={withQueryFor(withRoutingShingles(createAuthenticatedRoute(Spaces)))}
          />

          <Route
            path="/spaces/:id/export"
            exact
            render={withQueryFor(withRoutingShingles(createAuthenticatedRoute(SpaceExport)))}
          />

          <Route
            path="/spaces/:id"
            render={withQueryFor(withRoutingShingles(createAuthenticatedRoute(Space)))}
          />

          <Route
            exact
            path="/splash"
            render={withQueryFor(withRoutingShingles(Splash))}
          />

          <Route
            exact
            path="/not-found"
            render={withQueryFor(withRoutingShingles(NotFound))}
          />

          <Route component={NotFound} />
        </Switch>
      </HashRouter>
    )
  },

  withRoutingShingles(Component) {
    return props => (
      <Component
        onUpdateQuery={partial(actions.updateQuery, this)}
        onReplaceQuery={partial(actions.replaceQuery, this)}
        onTransition={partial(actions.transition, this)}
        user={this.state.user}
        {...props}
      />
    );
  },

  trackUser(user) {
    this.setState({ user });
  }
})

module.exports = ApplicationLoader(RootWithRoutes);
