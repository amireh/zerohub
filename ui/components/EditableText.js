const React = require('react');
const { TextInput, TextArea } = require('components/Native');
const KeyMapper = require('components/KeyMapper');
const classSet = require('classnames');
const { PropTypes } = React;

const EditableText = React.createClass({
  propTypes: {
    value: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    autoFocus: PropTypes.bool,
    readOnly: PropTypes.bool,
    ignoreNullChanges: PropTypes.bool,
    multiline: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onCharacterChange: PropTypes.func,
  },

  getDefaultProps() {
    return {
      ignoreNullChanges: true,
      multiline: false,
    };
  },

  getInitialState() {
    return {
      value: this.props.value,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  },

  render() {
    return this.props.multiline ? this.renderMultiLineEditor() : this.renderSingleLineEditor();
  },

  renderSingleLineEditor() {
    return (
      <KeyMapper
        onKCReturn={this.emitChange}
        onKCEscape={this.discardChange}
      >
        <TextInput
          className={classSet(this.props.className, 'editable-text')}
          value={this.state.value}
          placeholder={this.props.placeholder}
          readOnly={this.props.readOnly}
          autoFocus={this.props.autoFocus}
          onBlur={this.emitChange}
          onChange={this.trackChange}
        />
      </KeyMapper>
    );
  },

  renderMultiLineEditor() {
    return (
      <KeyMapper
        onKCReturn={KeyMapper.ModifierCommand(this.emitChange, KeyMapper.Modifiers.Control)}
        onKCEscape={this.discardChange}
      >
        <TextArea
          className={classSet(this.props.className, 'editable-text')}
          value={this.state.value}
          placeholder={this.props.placeholder}
          readOnly={this.props.readOnly}
          autoFocus={this.props.autoFocus}
          onBlur={this.emitChange}
          onChange={this.trackChange}
        />
      </KeyMapper>
    );
  },

  emitChange(e) {
    if (this.props.onBlur) {
      this.props.onBlur();
    }

    if (e.target.value === this.props.value && this.props.ignoreNullChanges) {
      return;
    }

    Promise.resolve(this.props.onChange(e.target.value)).catch(this.discardChange);
  },

  trackChange(e) {
    if (this.props.onCharacterChange) {
      this.props.onCharacterChange(e.target.value);
    }

    this.setState({ value: e.target.value });
  },

  discardChange() {
    if (this.props.onCharacterChange) {
      this.props.onCharacterChange(this.props.value);
    }

    this.setState({ value: this.props.value });
  }
});

module.exports = EditableText;

const NativeEventEmitter = React.createClass({
  propTypes: {
    children: PropTypes.node,
  },

  render() {
    const child = React.Children.only(this.props.children);

    return React.cloneElement(child, {
      onChange: this.emitChange
    })
  },

  emitChange(value) {
    const child = React.Children.only(this.props.children);

    child.props.onChange({
      target: {
        name: child.props.name,
        tagName: child.props.multiline ? 'TEXTAREA' : 'INPUT',
        type: child.props.multiline ? undefined : 'text',
        value: value
      }
    });
  }
})

module.exports.NativeEventEmitter = NativeEventEmitter;