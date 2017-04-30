const React = require('react');
const classSet = require('classnames');
const omit = require('../utils/omit');
const AutosizeTextarea = require('react-textarea-autosize').default;

const { bool, func, string, oneOf, } = React.PropTypes;

exports.TextInput = React.createClass({
  propTypes: {
    className: string,
  },

  render() {
    return (
      <input
        type="text"
        {...this.props}
        className={classSet("text-input", this.props.className)}
      />
    );
  }
});

exports.TextArea = React.createClass({
  propTypes: {
    className: string,
  },

  render() {
    return (
      <AutosizeTextarea
        {...this.props}
        className={classSet("text-area", this.props.className)}
      />
    );
  }
});

exports.Button = React.createClass({
  propTypes: {
    className: string,
    type: string,
    hint: oneOf([ 'default', 'icon', 'danger', 'link' ]),
  },

  getDefaultProps() {
    return {
      type: 'button',
      hint: 'default',
    };
  },

  render() {
    return (
      <button
        type={this.props.type}
        {...omit(this.props, 'hint')}
        className={classSet(this.props.className, {
          'button': !this.props.hint || this.props.hint === 'default',
          'icon-button': this.props.hint === 'icon',
          'link-button': this.props.hint === 'link',
          'danger-button': this.props.hint === 'danger',
        })}
      />
    );
  }
});

exports.Checkbox = React.createClass({
  propTypes: {
    className: string,
    type: string,
    checked: bool,
    onChange: func
  },

  getDefaultProps() {
    return {
      checked: false,
      className: ''
    };
  },

  render() {
    return (
      <input
        {...this.props}
        checked={this.props.checked || false}
        type="checkbox"
        className={classSet("checkbox", this.props.className)}
      />
    );
  },
});


exports.Radio = React.createClass({
  propTypes: {
    className: string,
    type: string,
    checked: bool,
    onChange: func
  },

  getDefaultProps() {
    return {
      checked: false,
      className: ''
    };
  },

  render() {
    return (
      <input
        {...this.props}
        checked={this.props.checked || false}
        type="radio"
        className={classSet("radio", this.props.className)}
      />
    );
  },
});

