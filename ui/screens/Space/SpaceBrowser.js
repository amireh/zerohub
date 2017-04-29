const React = require('react');
const Link = require('components/Link');
const Icon = require('components/Icon');
const { PropTypes } = React;

const SpaceBrowser = React.createClass({
  propTypes: {
    spaces: PropTypes.array.isRequired,
  },

  render() {
    return (
      <div className="space-browser">
        <header className="space-browser__header">
          <span>{I18n.t('Spaces')}</span>
          <span className="space-browser__header-count">
            ({this.props.spaces.length})
          </span>
        </header>

        <div className="space-browser__listing">
          {this.props.spaces.map(this.renderSpace)}
        </div>
      </div>
    );
  },

  renderSpace(space) {
    return (
      <div key={space.id}>
        <Link
          to={`/spaces/${space.id}`}
          className="space-browser__space"
        >
          <Icon className="icon-folderx" />
          {' '}
          {space.title}
        </Link>
      </div>
    )
  },
});

module.exports = SpaceBrowser;
