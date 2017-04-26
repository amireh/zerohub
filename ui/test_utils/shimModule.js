module.exports = function shimModule(injector, modules) {
  const shims = Object.keys(modules).reduce(function(map, path) {
    const [ receiver, fn ] = modules[path];

    map[path] = function() {
      return receiver[fn].apply(receiver, arguments);
    }

    return map;
  }, {});

  return injector(shims)
}