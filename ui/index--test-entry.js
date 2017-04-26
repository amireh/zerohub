require('./polyfills');
const { request } = require('services/PageHub');

const tap = (x, fn) => fn(x);
const testFiles = require.context('./', true, /\.test\.js$/);

// process.on('uncaughtException', function handleUncaughtException (err) {
//   console.warn('uncaughtException in karma process!')
//   throw err;
// });

window.addEventListener('unhandledrejection', function(data) {
  console.warn('Throwing unhandled promise rejection!');

  throw data.reason;
});

before(function() {
  request.stub(Function.prototype);
})

tap(testFiles, context => {
  context.keys().forEach(context);
});
