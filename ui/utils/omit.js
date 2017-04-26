module.exports = function omit(object, keys) {
  return Object.keys(object).reduce(function(map, key) {
    if (keys.indexOf(key) === -1) {
      map[key] = object[key];
    }

    return map;
  }, {});
}