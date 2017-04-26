const React = require('react');
const queryString = require('query-string');

const withQueryFor = Component => withQuery(({ location, match, query }) => (
  <Component
    match={match}
    params={match.params}
    query={query}
    location={location}
  />
));

const withQuery = fn => ({ location, match }) => (
  fn({ location, match, query: queryString.parse(location.search) })
);

exports.withQuery = withQuery;
exports.withQueryFor = withQueryFor;