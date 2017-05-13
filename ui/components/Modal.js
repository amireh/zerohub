const React = require('react');
const { remote } = electronRequire('electron');
const { BrowserWindow } = remote;
const { PropTypes } = React;

const Modal = React.createClass({
  propTypes: {
    width: PropTypes.number,
    height: PropTypes.number,
    url: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  },

  componentDidMount() {
    // Create the browser window.
    this.wh = new BrowserWindow({
      parent: remote.getCurrentWindow(),
      width: this.props.width,
      height: this.props.height,
      show: false,
      modal: true,
      center: this.props.center,
      resizable: false,
      icon: 'icons/png/64x64.png',
      webPreferences: {
        disableBlinkFeatures: 'CSSOMSmoothScroll'
      }
    })

    this.wh.on('closed', this.props.onClose);
    this.wh.webContents.once('dom-ready', () => {
      if (this.isMounted()) {
        this.wh.webContents.executeJavaScript(`window.location.hash = "#${this.props.url}";`);
        this.wh.show();
      }
    });

    this.wh.loadURL(process.env.NODE_ENV === 'development' ?
      `file://${__dirname}/index.development.html` :
      `file://${__dirname}/index.html`
    );
  },

  componentWillUnmount() {
    this.wh.destroy();
  },

  render() {
    return (
      null
    );
  }
});

module.exports = Modal;
