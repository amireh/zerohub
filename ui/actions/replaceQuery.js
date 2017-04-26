const queryString = require('query-string');

module.exports = function replaceQuery(container, nextQuery) {
  const { history } = container.refs.router;
  const withoutNulls = Object.keys(nextQuery).reduce(function(map, key) {
    if (nextQuery[key] !== null) {
      map[key] = nextQuery[key];
    }

    return map;
  }, {});

  history.push(`${history.location.pathname}?${queryString.stringify(withoutNulls)}`)
};