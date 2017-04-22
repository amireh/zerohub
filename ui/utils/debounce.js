/**
 * Debounce a function
 *
 * @param {Function} fn
 *        The function you wish to run a bit less frequently
 *
 * @param {Number} threshold
 *        The time in milliseconds to wait for no new calls before
 *        actually running the function. Defaults to 100
 *
 * @param {Boolean} parameterized
 *        If true, debounce each permutation of arguments individually
 *
 * @examples
 *
 *     debounced = debounce(console.log);
 *     debounced("Hi");
 *     debounced("Hi again");
 *
 *     // 100ms later...
 *     > Hi again
 *
 *     debounced = debounce(console.log, 100, true);
 *     debounced("Hi");
 *     debounced("Hi again");
 *     debounced("Hi");
 *     debounced("Hi");
 *
 *     // 100ms later...
 *     > Hi again
 *     > Hi
 *
 * @return {Function} debounced
 * @return {Function} debounced.cancel
 *         Cancel any and all pending future calls.
 */
export default function debounce(fn, threshold, parameterized) {
  const timeouts = {};

  const debounced = function() {
    var args = Array.prototype.slice.call(arguments);
    var timeoutKey = realizeKey(parameterized, args);

    clearTimeout(timeouts[timeoutKey]);

    timeouts[timeoutKey] = setTimeout(function() {
      fn.apply(null, args);
    }, threshold || 100);
  };

  debounced.cancel = function() {
    Object.keys(timeouts).forEach(function(key) {
      timeouts[key] = clearTimeout(timeouts[key]);
    });
  };

  return debounced;
}

function realizeKey(fn, args) {
  if (fn === true) {
    return JSON.stringify(args)
  }
  else if (typeof fn === 'function') {
    return fn(args);
  }
  else {
    return '_';
  }
}