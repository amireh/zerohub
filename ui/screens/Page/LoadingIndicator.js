import React from 'react';

const LoadingIndicator = React.createClass({
  render() {
    return (
      <div>
        {I18n.t('Loading page... please wait.')}
      </div>
    );
  }
});

export default LoadingIndicator;
