export function objectSet(map, key, value) {
  return Object.assign({}, map, { [key]: value });
}