const path = require('path');

require(path.resolve(__dirname, '../core/messageHandlers'));

process.on('uncaughtException', function handleUncaughtException (err) {
  console.warn('uncaughtException in renderer process...?!')
  throw err;
});
