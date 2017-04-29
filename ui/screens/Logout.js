const React = require('react');
const { applyOntoComponent, actions } = require('actions');

const Logout = React.createClass({
  getInitialState() {
    return {
      loggedOut: false
    };
  },

  componentWillMount() {
    applyOntoComponent(this, actions.logout).then(() => {
      if (this.isMounted()) {
        this.props.onChangeOfUser(null);
      }
    })
  },

  render() {
    return <p>{I18n.t('Logging out...')}</p>
  }
});

module.exports = Logout;
