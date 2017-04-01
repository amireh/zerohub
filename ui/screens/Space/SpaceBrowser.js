import React, { PropTypes } from 'react';
import Link from 'components/Link';

const SpaceBrowser = React.createClass({
  propTypes: {
    space: PropTypes.shape({
      id: PropTypes.string.isRequired,
      folders: PropTypes.array.isRequired,
      pages: PropTypes.array.isRequired,
    }).isRequired,

    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
  },

  render() {
    return (
      <div className="space-browser">
        {this.props.space.folders.map(this.renderFolder)}
      </div>
    );
  },

  renderFolder(folder) {
    const pages = this.props.space.pages.filter(x => x.folder_id === folder.id);

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
