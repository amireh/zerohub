const React = require('react');
const Outlet = require('components/Outlet');
const OutletProvider = require('components/OutletProvider');
const classSet = require('classnames');

const MemberLayout = React.createClass({
  getDefaultProps() {
    return {
      withUserMenu: true,
      withDrawer: false,
    };
  },

  render() {
    return (
      <OutletProvider names={[
        'MEMBER_BANNER',
        'MEMBER_SIDEBAR',
        'MEMBER_MENU',
        'MEMBER_CONTENT',
        'MEMBER_DRAWER'
        ]}
      >
        <div className={classSet("member-layout", {
          'member-layout--with-drawer': this.props.withDrawer,
          'member-layout--with-user-menu': this.props.withUserMenu,
        })}>
          <div className="member-layout__banner">
            <Outlet name="MEMBER_BANNER" />
          </div>

          <div className="member-layout__menu">
            <Outlet name="MEMBER_MENU" />
          </div>

          <div className="member-layout__sidebar">
            <Outlet name="MEMBER_SIDEBAR" />
          </div>

          <div className="member-layout__content">
            {this.props.children}
          </div>

          <div className="member-layout__drawer">
            <Outlet name="MEMBER_DRAWER" />
          </div>
        </div>
      </OutletProvider>
    );
  }
});

module.exports = MemberLayout;
