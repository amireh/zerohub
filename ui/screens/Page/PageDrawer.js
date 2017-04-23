import React, { PropTypes } from 'react';
import Toggle from 'react-toggle';
import { Button } from 'components/Native';

const PageDrawer = React.createClass({
  propTypes: {
    onChangeOfEncryptionStatus: PropTypes.func.isRequired,
  },

  render() {
    return (
      <div className="pure-u-1-1 space-page-drawer">
        <header className="space-page-drawer__header">
          Page Settings
        </header>

        <div className="space-page-drawer__content">
          <label className="form-toggle-label">
            Encrypt this page

            {' '}

            <Toggle
              checked={this.props.page.encrypted === true}
              onChange={this.setPageEncryptionStatus}
              disabled={!this.props.passPhrase}
            />
          </label>

          {this.props.page.encrypted && (
            this.renderEncryptionSettings()
          )}
        </div>
      </div>
    );
  },

  renderEncryptionSettings() {
    if (this.props.isRetrievingPassPhrase) {
      return (
        <p>Loading existing pass-phrase...</p>
      );
    }

    return (
      <div>
        {!this.props.passPhrase && this.isPageEncrypted() && (
          <div>
            <p>
              You must register an encryption pass-phrase for this space in order
              to encrypt its pages.
            </p>
            <p>
              <Button onClick={this.importPassPhrase}>Import pass-phrase from file</Button>
              <Button onClick={this.generatePassPhrase}>Generate a new pass-phrase</Button>
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

  importPassPhrase() {

  },

  generatePassPhrase() {
    this.props.dispatch('GENERATE_PASS_PHRASE', { spaceId: this.props.space.id})
  }
});

export default PageDrawer;
