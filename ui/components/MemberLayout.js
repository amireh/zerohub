const React = require('react');
const Outlet = require('components/Outlet');
const OutletProvider = require('components/OutletProvider');

const MemberLayout = React.createClass({
  render() {
    return (
      <OutletProvider names={[ 'MEMBER_SIDEBAR', 'MEMBER_CONTENT', 'MEMBER_DRAWER' ]}>
        <div className="member-layout">
          <div className="member-layout__sidebar">
            <Outlet name="MEMBER_SIDEBAR" />
          </div>

          <div className="member-layout__content">
            {this.props.children}
          </div>

          <Outlet name="MEMBER_DRAWER">
            <div className="member-layout__drawer" />
          </Outlet>
        </div>
      </OutletProvider>
    );
  }
});

module.exports = MemberLayout;
