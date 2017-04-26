const queryString = require('query-string');

module.exports = function updateQuery(container, nextQuery) {
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
}