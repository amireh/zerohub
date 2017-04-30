const React = require('react');
const Text = require('components/Text');
const Link = require('components/Link');
const { Button } = require('components/Native');
const { PropTypes } = React;

const DecryptionForm = React.createClass({
  propTypes: {
    encryptedPages: PropTypes.array.isRequired,
    space: PropTypes.object.isRequired,
    onDisable: PropTypes.func,
  },

  componentWillMount() {
    if (this.props.encryptedPages.length === 0) {
      this.props.onDisable();
    }
  },

  render() {
    const { encryptedPages } = this.props;

    return (
      <div className="margin-t-m">
        {encryptedPages.length === 0 ? (
          <div>
            <p><Text>As there are no encrypted pages in this space, encryption can be safely disabled.</Text></p>
          </div>
        ) : (
          <div>
            <p>
              <Text>
                Encryption can not be disabled for this space until the following pages have been decrypted first:
              </Text>
            </p>

            <ul>
              {this.props.encryptedPages.map(page => {
                return (
                  <li key={page.id}>
                    <Link to={`/spaces/${this.props.space.id}/pages/${page.id}`}>
                      {page.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <Button
          disabled={encryptedPages.length > 0}
          onClick={this.props.onDisable}
          children={I18n.t('Disable encryption')}
          hint="danger"
        />
        {' '}
        <Button
          onClick={this.props.onCancel}
          children={I18n.t('Cancel')}
        />
      </div>
    );
  },
});

module.exports = DecryptionForm;
