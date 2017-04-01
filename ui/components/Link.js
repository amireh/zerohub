import React from 'react';
import { NavLink } from 'react-router-dom';
import classSet from 'classnames';

export default props => (
  <NavLink
    activeClassName="link--active"
    {...props}
    className={classSet(props.className, 'link')}
  />
);