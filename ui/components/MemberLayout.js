const React = require('react');
const Outlet = require('components/Outlet');
const OutletProvider = require('components/OutletProvider');
const classSet = require('classnames');
const { PropTypes } = React;

const MemberLayout = React.createClass({
  contextTypes: {
    hasOutletOccupant: PropTypes.func,
  },

  propTypes: {
    children: PropTypes.node,
    withDrawer: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      withUserMenu: true,
      withDrawer: false,
    };
  },

  render() {
    return (
      <div className={classSet("member-layout", {
        'member-layout--with-drawer': this.props.withDrawer || this.context.hasOutletOccupant('MEMBER_DRAWER'),
        'member-layout--with-banner': this.context.hasOutletOccupant('MEMBER_BANNER'),
        'member-layout--with-user-menu': this.context.hasOutletOccupant('MEMBER_MENU'),
        'member-layout--with-side-status-bar': this.context.hasOutletOccupant('MEMBER_SIDE_STATUS_BAR'),
        'member-layout--with-status-bar': this.context.hasOutletOccupant('MEMBER_STATUS_BAR'),
        'member-layout--with-sticky-notice': this.context.hasOutletOccupant('MEMBER_STICKY_NOTICE'),
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

        <Outlet name="MEMBER_SIDE_STATUS_BAR">
          <div className="member-layout__side-status-bar" />
        </Outlet>

        <div className="member-layout__content">
          {this.props.children}
        </div>

        <Outlet name="MEMBER_STATUS_BAR">
          <div className="member-layout__status-bar" />
        </Outlet>

        <Outlet name="MEMBER_STICKY_NOTICE">
          <div className="member-layout__sticky-notice" />
        </Outlet>

        <div className="member-layout__drawer">
          <Outlet name="MEMBER_DRAWER" />
        </div>
      </div>
    );
  }
});

module.exports = props => (
  <OutletProvider names={[
    'MEMBER_BANNER',
    'MEMBER_SIDEBAR',
    'MEMBER_SIDE_STATUS_BAR',
    'MEMBER_STATUS_BAR',
    'MEMBER_STICKY_NOTICE',
    'MEMBER_MENU',
    'MEMBER_CONTENT',
    'MEMBER_DRAWER'
    ]}
  >
    <MemberLayout {...props} />
  </OutletProvider>
);
