const React = require('react');
const Link = require('components/Link');
const { Button } = require('components/Native');
const Icon = require('components/Icon');
const { PropTypes } = React;

const Menu = React.createClass({
  render() {
    return (
      <div className="user-menu__menu">
        <div className="user-menu__menu-item">
          <Button>
            <Link to="/settings">{I18n.t('Settings')}</Link>
          </Button>
        </div>

        <div className="user-menu__menu-item">
          <Button>
            <Link to="/logout">{I18n.t('Sign out')}</Link>
          </Button>
        </div>
      </div>
    )
  }
})

const UserMenu = React.createClass({
  propTypes: {
    user: PropTypes.object,
  },

  getInitialState() {
    return {
      menuOpen: false
    };
  },

  render() {
    const { user } = this.props;

    if (!user) {
      return null;
    }

    return (
      <div className="user-menu">

        <Button hint="icon" onClick={this.toggleMenu}>
          {user.name}

          <Icon className="icon-keyboard_arrow_down" />
        </Button>

        {this.state.menuOpen && (<Menu />)}
      </div>
    );
  },

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }
});

module.exports = UserMenu;
