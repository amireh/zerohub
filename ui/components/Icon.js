const React = require('react');
const classSet = require('classnames');
const omit = require('utils/omit');
const { PropTypes } = React;

const DISPLAY_GRID_STYLE = {
  fontSize: '24px',
  verticalAlign: 'middle'
};

const LARGE_GRID_STYLE = {
  fontSize: '42px',
  verticalAlign: 'middle'
};

const Icon = React.createClass({
  propTypes: {
    className: PropTypes.string,
    sizeHint: PropTypes.oneOf([ 'display', 'large' ]),
    styleHint: PropTypes.oneOf([ 'default', 'danger', 'secondary' ]),
    style: PropTypes.object,
  },

  render() {
    let style;
    const classNames = [ 'icon' ];

    if (this.props.sizeHint === 'display') {
      style = DISPLAY_GRID_STYLE;
    }
    else if (this.props.sizeHint === 'large') {
      style = LARGE_GRID_STYLE;
    }

    if (this.props.styleHint === 'danger') {
      classNames.push('icon--danger');
    }
    else if (this.props.styleHint === 'secondary') {
      classNames.push('icon--secondary');
    }

    return (
      <span
        {...omit(this.props, [ 'sizeHint', 'styleHint' ])}
        className={classSet(this.props.className, classNames)}
        style={Object.assign({}, this.props.style, style)}
      />
    );
  }
});

module.exports = Icon;
