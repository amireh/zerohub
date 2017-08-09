const { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } = require('./constants');

module.exports = x => (
  x &&
  x.length >= MIN_PASSWORD_LENGTH &&
  x.length <= MAX_PASSWORD_LENGTH
);