const React = require('react');

const WarningMessage = React.createClass({
  render() {
    return (
      <div className="warning-message">
        {this.props.children}
      </div>
    );
  }
});

module.exports = WarningMessage;
