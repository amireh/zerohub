export default function pick(object, keys) {
  return keys.reduce(function(map, key) {
    map[key] = object[key];

    return map;
  }, {});
}