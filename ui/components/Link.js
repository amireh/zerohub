const React = require('react');
const { NavLink } = require('react-router-dom');
const classSet = require('classnames');

module.exports = props => (
  <NavLink
    activeClassName="link--active"
    {...props}
    onClick={props.disabled ? consume : props.onClick}
    className={classSet(props.className, 'link')}
  />
);

function consume(e) {
  e.preventDefault();
}