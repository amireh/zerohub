const React = require('react');
const Outlet = require('components/Outlet');
const OutletProvider = require('components/OutletProvider');
const classSet = require('classnames');

const MemberLayout = React.createClass({
  render() {
    return (
      <OutletProvider names={[ 'MEMBER_SIDEBAR', 'MEMBER_CONTENT', 'MEMBER_DRAWER' ]}>
        <div className={classSet("member-layout", {
          'member-layout--with-drawer': this.props.withDrawer
        })}>
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
