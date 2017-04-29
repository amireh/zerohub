module.exports = function discardUndefinedValues(object) {
  return Object.keys(object).reduce(function(map, key) {
    const value = object[key];

    if (value === undefined) {
      return map;
    }

    map[key] = value;

    return map;
  }, {});
}