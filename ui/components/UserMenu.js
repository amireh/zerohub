const React = require('react');
const Link = require('components/Link');
const { Button } = require('components/Native');
const Icon = require('components/Icon');
const { PropTypes } = React;

const Menu = React.createClass({
  render() {
    return (
      <div className="user-menu__menu">
        {this.props.links.map(link => {
          return (
            <div key={link.to} className="user-menu__menu-item">
              <Link to={link.to}>{link.label}</Link>
            </div>
          );
        })}

        {this.props.links.length > 0 && (
          <div className="user-menu__menu-separator" />
        )}

        <div className="user-menu__menu-item">
          <Link to="/settings">{I18n.t('Settings')}</Link>
        </div>

        <div className="user-menu__menu-item">
          <Link to="/vault">{I18n.t('Vault')}</Link>
        </div>

        <div className="user-menu__menu-separator" />

        <div className="user-menu__menu-item">
          <Link to="/logout">{I18n.t('Sign out')}</Link>
        </div>
      </div>
    )
  }
})

const UserMenu = React.createClass({
  propTypes: {
    user: PropTypes.object,
    title: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.shape({
      to: PropTypes.string,
      label: PropTypes.string,
    }))
  },

  getInitialState() {
    return {
      menuOpen: false
    };
  },

  render() {
    const { user, title } = this.props;

    if (!user) {
      return null;
    }

    return (
      <div className="user-menu">
        <div className="user-menu__caption">
          <Button hint="icon" onClick={this.toggleMenu}>

            <span className="user-menu__caption-primary">
              {title || user.name}
              <Icon className="icon-keyboard_arrow_down" />
            </span>

            {title && (
              <span className="user-menu__caption-secondary">
                {user.name}
              </span>
            )}
          </Button>
        </div>

        {this.state.menuOpen && (<Menu links={this.props.links || []} />)}
      </div>
    );
  },

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }
});

module.exports = UserMenu;
