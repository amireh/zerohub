require('./boot');
const { request } = require('services/PageHub');

window.addEventListener('unhandledrejection', function(data) {
  console.warn('Throwing unhandled promise rejection!');

  throw data.reason;
});

beforeEach(function() {
  request.stub(() => Promise.resolve());
})

afterEach(function() {
  request.restore();
})
