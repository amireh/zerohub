import React from 'react';

const ErrorMessage = React.createClass({
  render() {
    return (
      <div className="error-message">
        {this.props.children}
      </div>
    );
  }
});

export default ErrorMessage;
