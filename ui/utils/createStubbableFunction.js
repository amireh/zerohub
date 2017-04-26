module.exports = function createStubbableFunction(fn) {
  let impl;
  let proxy = function() {
    return (impl || fn).apply(null, arguments);
  };

  proxy.stub = function(newImpl) {
    impl = newImpl;
  };

  proxy.restore = function() {
    impl = null;
  };

  Object.defineProperty(proxy, '__original__', {
    enumerable: false,
    writeable: false,
    configurable: false,
    value: fn
  });

  return proxy;
}