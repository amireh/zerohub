const React = require('react');
const Splash = React.createClass({
  render() {
    return (
      <div className="splash-container">
        <div className="splash">
          <div className="splash__logo">
            <h1>{I18n.t('0Hub')}</h1>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Splash;
