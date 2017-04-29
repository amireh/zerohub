const React = require('react');
const Outlet = require('components/Outlet');
const OutletProvider = require('components/OutletProvider');
const UserMenu = require('components/UserMenu');

const MemberLayout = React.createClass({
  render() {
    return (
      <OutletProvider names={[ 'MEMBER_SIDEBAR', 'MEMBER_CONTENT', 'MEMBER_TRAY' ]}>
        <div className="member-layout">
          <div className="member-layout__sidebar">
            <UserMenu user={this.props.user} />

            <Outlet name="MEMBER_SIDEBAR" />
          </div>

          <div className="member-layout__content">
            {this.props.children}
          </div>

          <div className="member-layout__tray">
            <Outlet name="MEMBER_TRAY" />
          </div>
        </div>
      </OutletProvider>
    );
  }
});

module.exports = MemberLayout;
