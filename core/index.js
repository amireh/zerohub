require('dotenv').config();

const { app } = require('electron')
const mainWindow = require('./mainWindow');
const createMainMenu = require('./createMainMenu');
const config = require('./config');

app.commandLine.appendSwitch('disable-smooth-scrolling');

let setup;

global.APP_ENV = config;

if (process.env.NODE_ENV === 'development') {
  const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
  setup = () => {
    return installExtension(REACT_DEVELOPER_TOOLS)
  }
}
else {
  setup = () => Promise.resolve();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  setup().then(function() {
    createMainMenu();
    mainWindow.createWindow();
  });
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow.getWindow() === null) {
    mainWindow.createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
require('./messageHandlers');