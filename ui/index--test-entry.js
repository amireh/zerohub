require('./polyfills');
const { request } = require('services/PageHub');

const tap = (x, fn) => fn(x);
const testFiles = require.context('./', true, /\.test\.js$/);

window.addEventListener('unhandledrejection', function(data) {
  console.warn('Throwing unhandled promise rejection!');

  throw data.reason;
});

beforeEach(function() {
  request.stub(() => Promise.resolve());
})

tap(testFiles, context => {
  context.keys().forEach(context);
});

afterEach(function() {
  request.restore();
})
