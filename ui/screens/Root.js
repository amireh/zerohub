import React, { PropTypes } from 'react';
import { HashRouter, Route, memoryHistory, Switch } from 'react-router-dom';
import { ActionProvider } from 'cornflux';
import queryString from 'query-string';
import Home from './Home';
import NotFound from './NotFound';
import Spaces from './Spaces';
import Space from './Space';
import { withQueryFor } from 'utils/routing';

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
            render={withQueryFor(Spaces)}
          />

          <Route
            path="/spaces/:id"
            render={withQueryFor(Space)}
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
  }
})

export default ActionProvider(RootWithRoutes, {
  actions: {
    UPDATE_QUERY: (container, nextQuery) => {
      const { history } = container.refs.router;
      const baseQuery = queryString.parse(history.location.search);
      const withoutNulls = Object.keys(nextQuery).reduce(function(map, key) {
        if (nextQuery[key] !== null) {
          map[key] = nextQuery[key];
        }
        else {
          delete map[key];
        }

        return map;
      }, baseQuery);

      history.push(`${history.location.pathname}?${queryString.stringify(withoutNulls)}`)
    },

    REPLACE_QUERY: (container, nextQuery) => {
      const { history } = container.refs.router;
      const withoutNulls = Object.keys(nextQuery).reduce(function(map, key) {
        if (nextQuery[key] !== null) {
          map[key] = nextQuery[key];
        }

        return map;
      }, {});

      history.push(`${history.location.pathname}?${queryString.stringify(withoutNulls)}`)
    },

    TRANSITION(container, nextPathname) {
      const { history } = container.refs.router;
      history.push(nextPathname)
    }
  }
});
