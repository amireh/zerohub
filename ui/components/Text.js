import React from 'react';

const Text = React.createClass({
  propTypes: {
    /**
     * The content you want to localize. May include text, child elements/
     * components, etc. ... placeholders and wrappers will be inferred.
     */
    children: React.PropTypes.any
  },

  render: function () {
    return <span {...this.props} />;
  }
});

export default Text;
