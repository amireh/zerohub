const { assert } = require('chai');
const invariant = require('invariant');

/**
 * Perform an assertion against a side-effect caused by a function.
 *
 * @param  {Object} context
 * @param  {Object} context.fn
 *         The function that causes side-effects.
 *
 * @param  {Object} context.of
 *         A function that queries the side-effects and returns a number that
 *         quantifies the effect.
 *
 * @param  {Number} context.by
 *         The expected change.
 *
 * @example
 *
 *     assertChange({
 *       fn() { ajax({ url: '/foo' }) },
 *       of() { return sinon.server.requests.length; },
 *       by: 1
 *     });
 */
module.exports = function assertChange(context) {
  invariant(typeof context.fn === 'function',
    "Must define 'fn' to perform side-effects.");

  invariant(context.hasOwnProperty('of'),
    "Must define 'of' to query side-effects.");

  const oldValue = evaluate(context.of);
  context.fn();
  const newValue = evaluate(context.of);

  if (context.hasOwnProperty('from') && context.hasOwnProperty('to')) {
    assert(oldValue === context.from,
      `Expected value to have been ${context.from} but was ${oldValue}`);

    assert(newValue === context.to,
      `Expected value to become ${context.to} but instead became ${newValue}`);
  }
  else if (context.hasOwnProperty('by')) {
    assert.equal(oldValue + context.by, newValue,
      `Expected value to change from ${oldValue} to ${oldValue + context.by} but it now is ${newValue}`
    );
  }
  else {
    assert.notEqual(oldValue, newValue);
  }

  function evaluate(x) {
    return typeof x === 'function' ? x() : x;
  }
}