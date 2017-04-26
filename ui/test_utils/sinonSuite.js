const sinon = require('sinon');
const { assert } = require('chai');

sinon.assert.expose(assert, { prefix: "" });
sinon.config = {
  useFakeServer: false,
  useFakeTimers: false,
};

module.exports = sinonSuite;

function sinonSuite(mochaSuite, options = {}) {
  let api = {};
  let sandbox;

  mochaSuite.beforeEach(function() {
    sandbox = sinon.sandbox.create({
      injectInto: api,
      properties: [ 'stub', 'spy', 'match' ],
      useFakeServer: false,
      useFakeTimers: false,
    });
  });

  if (options.autoRestore === false) {
    api.restore = function() {
      sandbox.restore();
    };
  }
  else {
    mochaSuite.afterEach(function() {
      sandbox.restore();
    });
  }

  return api;
}
