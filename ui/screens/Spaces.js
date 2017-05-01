const React = require('react');
const Link = require('components/Link');
const MemberLayout = require('components/MemberLayout');
const OutletOccupant = require('components/OutletOccupant');
const { applyOntoComponent, actions } = require('actions');
const SpaceBrowser = require('./Space/SpaceBrowser');
const UserMenu = require('components/UserMenu');
const { PropTypes } = React;

const Spaces = React.createClass({
  propTypes: {
    user: PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      spaces: [],
      loadingSpaces: false,
      spaceLoadError: null,
    };
  },

  componentDidMount() {
    applyOntoComponent(this, actions.fetchSpaces, { userId: this.props.user.id });
  },

  render() {
    return (
      <MemberLayout>
        <div>
          {this.state.loadingSpaces && <p>Loading spaces...</p>}
          {this.state.spaceLoadError && (
            <p className="error-notification">
              {I18n.t('Error loading spaces!')}
            </p>
          )}

          <OutletOccupant name="MEMBER_MENU">
            <UserMenu user={this.props.user} />
          </OutletOccupant>

          <OutletOccupant name="MEMBER_SIDEBAR">
            <SpaceBrowser spaces={this.state.spaces} />
          </OutletOccupant>
        </div>
      </MemberLayout>
    );
  },

  renderSpace(space) {
    return (
      <div key={space.id}>
        <Link to={`/spaces/${space.id}`}>{space.title}</Link>
      </div>
    )
  }
});

module.exports = Spaces;
