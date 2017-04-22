import React from 'react';

const WarningMessage = React.createClass({
  render() {
    return (
      <div className="warning-message">
        {this.props.children}
      </div>
    );
  }
});

export default WarningMessage;
