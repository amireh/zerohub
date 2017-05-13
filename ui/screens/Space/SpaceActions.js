const React = require('react');
const { Button, Icon, Link } = require('components');
const { flow } = require('lodash');

const AddMenu = React.createClass({
  render() {
    const ClosableLink = props => (
      <Button
        className="user-menu__menu-item"
        hint="link"
        {...props}
      />
    );

    return (
      <div className="space-actions__add-menu user-menu__menu">
        <ClosableLink onClick={this.props.onAddPage}>
          <Icon className="icon-insert_drive_file" /> {I18n.t('New Page')}
        </ClosableLink>

        {false && (
          <ClosableLink onClick={this.props.onAddFolder}>
            <Icon className="icon-create_new_folder" /> {I18n.t('New Folder')}
          </ClosableLink>
        )}
      </div>
    )
  }
})
const SpaceActions = React.createClass({
  getInitialState() {
    return {
      showingAddMenu: false
    };
  },

  render() {
    return (
      <div className="space-actions">
        {this.state.showingAddMenu && (
          <AddMenu
            onClose={this.hideAddMenu}
            onAddPage={flow(this.hideAddMenu, this.props.onAddPage)}
            onAddFolder={flow(this.hideAddMenu, this.props.onAddFolder)}
          />
        )}

        <Button hint="icon" onClick={this.toggleAddMenu} className="padding-trbl-0 margin-trbl-0">
          <Icon className="icon-add" />
        </Button>
      </div>
    );
  },

  showAddMenu() {
    this.setState({ showingAddMenu: true });
  },

  hideAddMenu() {
    this.setState({ showingAddMenu: false });
  },

  toggleAddMenu() {
    if (this.state.showingAddMenu) {
      this.hideAddMenu();
    }
    else {
      this.showAddMenu();
    }
  }
});

module.exports = SpaceActions;
