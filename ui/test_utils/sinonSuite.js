import sinon from 'sinon';
import { assert } from 'chai';

sinon.assert.expose(assert, { prefix: "" });
sinon.config = {
  useFakeServer: false,
  useFakeTimers: false,
};

export default sinonSuite;

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
