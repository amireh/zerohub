const React = require('react');
const Icon = require('./Icon');
const { Button } = require('./Native');
const classSet = require('classnames')

const ErrorMessage = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    dismissable: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      dismissed: false
    };
  },

  getDefaultProps() {
    return {
      dismissable: false
    };
  },

  render() {
    if (this.state.dismissed) {
      return null;
    }

    return (
      <div className={classSet(this.props.className, "error-message")}>
        <div className="error-message__emblem">
          <Icon className="icon-error_outline" />
        </div>

        <div className="error-message__content">
          {this.props.children}
        </div>

        {this.props.dismissable && (
          <p className="error-message__dismiss">
            <Button hint="link" onClick={this.dismiss}>{I18n.t('Dismiss')}</Button>
          </p>
        )}
      </div>
    );
  },

  dismiss() {
    this.setState({ dismissed: true });
  }
});

module.exports = ErrorMessage;
