const React = require('react');
const { findDOMNode } = require('react-dom');
const { PropTypes } = React;

const AutosizingInput = React.createClass({
  propTypes: {
    children: PropTypes.node,
    fit: PropTypes.bool,
    minWidth: PropTypes.number,
  },

  getDefaultProps() {
    return {
      fit: true,
      minWidth: 10
    };
  },

  componentWillMount() {
  },

  componentDidMount() {
    this.getTextWidth = buildQueryTool(findDOMNode(this.refs.node));
    this.adjustSizeToFitContent();
  },

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.getTextWidth = buildQueryTool(findDOMNode(this.refs.node));
    }

    this.adjustSizeToFitContent();
  },

  componentWillUnmount() {
    this.getTextWidth = null;
  },

  render() {
    return React.cloneElement(React.Children.only(this.props.children), {
      ref: 'node',
      onChange: this.adjustSizeToFitContentOnChange,
    });
  },

  adjustSizeToFitContent() {
    setTimeout(() => {
      if (this.isMounted()) {
        const node = findDOMNode(this.refs.node);
        const width = Math.max(this.props.minWidth, this.getTextWidth(node.value));
        const characterAvgWidth = Math.round(width / node.value.length);
        const widthStyle = `${width + characterAvgWidth * 2}px`;

        node.style.minWidth = widthStyle;
        node.style.marginRight = `${-1 * characterAvgWidth * 2}px`;

        if (this.props.fit) {
          node.style.width = widthStyle;
        }
      }
    }, 5);
  },

  adjustSizeToFitContentOnChange(e) {
    const child = React.Children.only(this.props.children);

    if (child.props.onChange) {
      child.props.onChange(e);
    }

    this.adjustSizeToFitContent();
  }
});


function buildQueryTool(node) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const computedStyle = window.getComputedStyle(node, null);

  context.font = computedStyle.getPropertyValue('font');

  return function getTextWidth(text) {
    return context.measureText(text).width;
  }
}

module.exports = AutosizingInput;
