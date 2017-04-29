const React = require('react');

const { node, bool, func, } = React.PropTypes;

/**
 * @module Components.KeyMapper
 */
const KeyMapper = React.createClass({
  statics: {
    keyNames: {
      13: 'Return',
      27: 'Escape',
      40: 'Down',
      38: 'Up',
      9: 'Tab',
      8: 'Backspace',
    },

    Modifiers: {
      Control:  1 << 0,
      Shift:    1 << 1,
      Alt:      1 << 2,
      Meta:     1 << 3,
    },

    consumeEvent: (e) => {
      e.preventDefault();
      e.stopPropagation();

      return e;
    },

    ModifierCommand(fn, modifiers) {
      return function(e) {
        // TODO: real mask support (e.g. Control | Meta)
        if ((modifiers & KeyMapper.Modifiers.Shift) && !e.shiftKey) {
          return;
        }
        else if ((modifiers & KeyMapper.Modifiers.Control) && !e.ctrlKey) {
          return;
        }
        else {
          return fn(e);
        }
      }
    }
  },

  propTypes: {
    children: node.isRequired,

    /**
     * Whether we should intercept and consume all other (unbound) key events.
     *
     * This will consume keyUp and keyPress events so that you can lock down
     * certain browser actions if you need to (like preventing navigating the
     * history when pressing Backspace, for example.)
     */
    consumeTheRest: bool,

    onKCReturn: func,
    onKCEscape: func,
    onKCDown: func,
    onKCUp: func,
    onKCTab: func,
    onKCBackspace: func,

    /**
     * A generic handler for the keys that were not bound to any handler.
     */
    onOtherKeys: func,
  },

  render() {
    const overrides = {
      onKeyDown: this.handleKeyPresses
    };

    if (this.props.consumeTheRest) {
      overrides.onKeyUp = this.constructor.consumeEvent;
      overrides.onKeyPress = this.constructor.consumeEvent;
    }

    return React.cloneElement(React.Children.only(this.props.children), overrides);
  },

  handleKeyPresses(e) {
    const keyName = this.constructor.keyNames[e.keyCode];
    const handler = this.props[`onKC${keyName}`];

    if (handler) {
      handler(e);
    }
    else if (this.props.onOtherKeys) {
      this.props.onOtherKeys(e);
    }
  }
});

module.exports = KeyMapper;
