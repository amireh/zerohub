module.exports = function discardNullValues(object) {
  return Object.keys(object).reduce(function(map, key) {
    const value = object[key];

    if (typeof value === 'string' && value.length === 0) {
      return map;
    }
    else if (value === undefined || value === null) {
      return map;
    }

    map[key] = value;

    return map;
  }, {});
}