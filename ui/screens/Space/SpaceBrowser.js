import React, { PropTypes } from 'react';
import Link from 'components/Link';

const SpaceBrowser = React.createClass({
  propTypes: {
    space: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,

    spaces: PropTypes.array.isRequired,
    folders: PropTypes.array.isRequired,
    pages: PropTypes.array.isRequired,

    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
  },

  render() {
    const { space } = this.props;

    return (
      <div className="space-browser">
        <div className="space-browser__current-space">
          <header className="space-browser__current-space-title">
            <Link to={`/spaces/${space.id}`}>{space.title}</Link>
          </header>

          {this.props.folders.map(this.renderFolder)}
        </div>

        <div className="space-browser__other-spaces">
          <header className="space-browser__other-spaces-header">
            <span>Spaces</span>
            <span className="space-browser__other-spaces-count">
              ({this.props.spaces.length})
            </span>
          </header>

          {this.props.spaces.map(this.renderSpace)}
        </div>
      </div>
    );
  },

  renderSpace(space) {
    return (
      <div key={space.id} className="space-browser__space">
        <Link
          to={`/spaces/${space.id}`}
          className="space-browser__folder-title"
        >
          {space.title}
        </Link>
      </div>
    )
  },

  renderFolder(folder) {
    const pages = this.props.pages.filter(x => x.folder_id === folder.id);

    return (
      <div key={folder.id} className="space-browser__folder">
        <span className="space-browser__folder-title">
          {folder.title}
        </span>

        <ul className="space-browser__folder-page-listing">
          {pages.map(this.renderPage)}
        </ul>
      </div>
    )
  },

  renderPage(page) {
    return (
      <li key={page.id}>
        <Link to={`${this.props.match.url}/pages/${page.id}`}>
          {page.title}
        </Link>
      </li>
    )
  }
});

export default SpaceBrowser;
