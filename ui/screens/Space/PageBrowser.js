const React = require('react');
const classSet = require('classnames');
const Link = require('components/Link');
const Icon = require('components/Icon');
const unescapeHTML = require('utils/unescapeHTML');
const { PropTypes } = React;

const PageBrowser = React.createClass({
  propTypes: {
    space: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,

    folders: PropTypes.array,
    pages: PropTypes.array,
  },

  render() {
    const [ rootFolder ] = this.props.folders.filter(x => !x.folder_id);
    const folders = this.props.folders.filter(x => x !== rootFolder);

    return (
      <div className="page-browser">
        <div className="page-browser__current-space">
          {folders.map(this.renderFolder)}
          {this.renderFolder(rootFolder)}
        </div>
      </div>
    );
  },

  renderFolder(folder) {
    const pages = this.props.pages.filter(x => x.folder_id === folder.id);
    const isRoot = !folder.folder_id;
    const shouldDisplayTitle = this.props.folders.length > 1;

    return (
      <div key={folder.id} className={classSet("page-browser__folder", {
        'page-browser__folder--root': isRoot
      })}>
        {shouldDisplayTitle && isRoot && (
          <span className="page-browser__folder-title">
            {I18n.t('Uncategorized')}
          </span>
        )}

        {shouldDisplayTitle && !isRoot && (
          <span className="page-browser__folder-title" title={folder.title}>
            <Icon className="icon-folder" /> {folder.title}
          </span>
        )}

        <ul className="page-browser__folder-page-listing">
          {pages.map(this.renderPage)}
        </ul>
      </div>
    )
  },

  renderPage(page) {
    return (
      <li key={page.id}>
        <Link
          activeClassName="page-browser__page--active"
          className="page-browser__page"
          to={`/spaces/${this.props.space.id}/pages/${page.id}`}
        >
          {unescapeHTML(page.title)}
        </Link>
      </li>
    )
  }
});


module.exports = PageBrowser;
