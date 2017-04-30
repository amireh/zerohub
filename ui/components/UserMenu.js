const React = require('react');
const Link = require('components/Link');
const { Button } = require('components/Native');
const Icon = require('components/Icon');
const { PropTypes } = React;

const Menu = React.createClass({
  contextTypes: {
    router: PropTypes.object,
  },

  propTypes: {
    onClose: PropTypes.func.isRequired,
  },

  render() {
    const ClosableLink = props => <Link onClick={this.props.onClose} {...props} />;

    return (
      <div className="user-menu__menu">
        {this.props.links.map(link => {
          return (
            <div key={link.to} className="user-menu__menu-item">
              <ClosableLink to={link.to}>{link.label}</ClosableLink>
            </div>
          );
        })}

        {this.props.links.length > 0 && (
          <div className="user-menu__menu-separator" />
        )}

        <div className="user-menu__menu-item">
          <ClosableLink disabled to="/preferences">{I18n.t('Preferences')}</ClosableLink>
        </div>

        <div className="user-menu__menu-separator" />

        <div className="user-menu__menu-item">
          <ClosableLink to="/logout">{I18n.t('Sign out')}</ClosableLink>
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

        {this.state.menuOpen && (
          <Menu
            links={this.props.links || []}
            onClose={this.closeMenu}
          />
        )}
      </div>
    );
  },

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  },

  closeMenu() {
    this.setState({ menuOpen: false })
  }
});

module.exports = UserMenu;
