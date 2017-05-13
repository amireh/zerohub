const React = require('react');
const classSet = require('classnames');
const Link = require('components/Link');
const Icon = require('components/Icon');
const unescapeHTML = require('utils/unescapeHTML');
const { Button } = require('components/Native');
const { PropTypes } = React;

const PageBrowser = React.createClass({
  propTypes: {
    space: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,

    folders: PropTypes.array,
    pages: PropTypes.array,
  },

  getInitialState() {
    return {
      collapsedFolders: {}
    };
  },

  render() {
    const [ rootFolder ] = this.props.folders.filter(x => !x.folder_id);

    return (
      <div className="page-browser">
        <div className="page-browser__current-space">
          {this.renderFolder(rootFolder)}
        </div>
      </div>
    );
  },

  renderFolder(folder) {
    const pages = this.props.pages.filter(x => x.folder_id === folder.id);
    const isRoot = !folder.folder_id;
    const isExpanded = this.isFolderExpanded(folder.id);
    const shouldDisplayTitle = !isRoot && this.props.folders.length > 1;
    const subFolders = this.props.folders.filter(x => x.folder_id === folder.id);

    return (
      <div
        key={folder.id}
        className={classSet("page-browser__folder", {
          'page-browser__folder--root': isRoot
        })}
      >
        {shouldDisplayTitle && (
          <Button
            hint="icon" onClick={this.toggleExpansionState(folder.id)}
            className="page-browser__folder-title" title={folder.title}
          >
            <Icon
              className={isExpanded ? "icon-keyboard_arrow_down" : "icon-keyboard_arrow_right"}
            />

            {unescapeHTML(folder.title)}
          </Button>
        )}

        {isExpanded && subFolders.length > 0 && (
          subFolders.map(this.renderFolder)
        )}

        {isExpanded && (
          <ul className="page-browser__folder-page-listing">
            {pages.map(this.renderPage)}
          </ul>
        )}
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
  },

  toggleExpansionState(folderId) {
    return () => {
      const isExpanded = this.isFolderExpanded(folderId);

      console.debug('toggling folder expansion state from', isExpanded, 'to', !isExpanded);

      this.setState({
        collapsedFolders: Object.assign({}, this.state.collapsedFolders, {
          [String(folderId)]: !!isExpanded
        })
      })
    }
  },

  isFolderExpanded(folderId) {
    return this.state.collapsedFolders[String(folderId)] !== true;
  }
});


module.exports = PageBrowser;
