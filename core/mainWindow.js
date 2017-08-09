const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 960,
    height: 600,
    icon: path.resolve(__dirname, '../www/icons/png/64x64.png'),
    webPreferences: {
      disableBlinkFeatures: 'CSSOMSmoothScroll'
    }
  })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: process.env.NODE_ENV === 'development' ?
      path.resolve(__dirname, '../www/index.development.html') :
      path.resolve(__dirname, '../www/index.html')
    ,
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

exports.createWindow = createWindow;
exports.getWindow = function() {
  return win;
}