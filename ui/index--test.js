if (!window.hasOwnProperty('electronRequire')) {
  window.electronRequire = require;
  delete window.require;
  delete window.exports;
  delete window.module;
}
