const React = require('react');
const { NavLink } = require('react-router-dom');
const classSet = require('classnames');

module.exports = props => (
  <NavLink
    activeClassName="link--active"
    {...props}
    className={classSet(props.className, 'link')}
  />
);