const React = require('react');
const Link = require('components/Link');
const { applyOntoComponent, actions } = require('actions');
const { PropTypes } = React;

const Spaces = React.createClass({
  contextTypes: {
    config: PropTypes.object,
  },

  getInitialState() {
    return {
      spaces: [],
      loadingSpaces: false,
      spaceLoadError: null,
    };
  },

  componentDidMount() {
    const { config } = this.context;

    applyOntoComponent(this, actions.fetchSpaces, { userId: config.userId });
  },

  render() {
    return (
      <div>
        {this.state.loadingSpaces && <p>Loading spaces...</p>}
        {this.state.spaceLoadError && (
          <p className="error-notification">
            Error loading spaces!
          </p>
        )}

        {this.state.spaces.map(this.renderSpace)}
      </div>
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
