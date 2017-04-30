const React = require('react');
const Toggle = require('components/Toggle');
const Text = require('components/Text');
const Link = require('components/Link');
const { PropTypes } = React;

const PageDrawer = React.createClass({
  propTypes: {
    onChangeOfEncryptionStatus: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
    }).isRequired,
  },

  render() {
    return (
      <div className="pure-u-1-1 space-page-drawer">
        <header className="space-page-drawer__header">
          Page Settings
        </header>

        <div className="space-page-drawer__content">
          <label className="form-toggle-label">
            {I18n.t('Encrypt this page')}

            {' '}

            <Toggle
              checked={this.props.page.encrypted === true}
              onChange={this.setPageEncryptionStatus}
              disabled={!this.props.passPhrase}
            />
          </label>

          {this.renderEncryptionSettings()}
        </div>
      </div>
    );
  },

  renderEncryptionSettings() {
    const { space } = this.props;
    const origin = `${this.props.location.pathname}${this.props.location.search}`

    return (
      <div>
        {!this.props.passPhrase && (
          <div>
            <p>
              <Text>
                You must first {(
                  <Link to={`/spaces/${space.id}/settings?origin=${origin}`}>
                    set up encryption for this space
                  </Link>
                )} in order to encrypt its pages.
              </Text>
            </p>
          </div>
        )}
      </div>
    )
  },

  isPageEncrypted() {
    return (
      this.props.page.encrypted ||
      this.props.space.encrypted
    );
  },

  setPageEncryptionStatus(e) {
    this.props.onChangeOfEncryptionStatus(e.target.checked);
  },
});

module.exports = PageDrawer;
