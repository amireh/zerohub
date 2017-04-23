require('./polyfills');

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

tap(testFiles, context => {
  context.keys().forEach(context);
});
