import React from 'react';
import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';
import PropTypes from 'prop-types';
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar= (props) => {
  return (
    <header className={classes.Toolbar}>
      <button onClick={props.toggleSideDrawer}>
        <i className="fa fa-bars fa-2x"></i>
      </button>
      <Logo />
      <nav>
        {/* ... */}
        <NavigationItems links={props.links} />
      </nav>
    </header>
  );
};

toolbar.propTypes = {
  links: PropTypes.array.isRequired,
  toggleSideDrawer: PropTypes.func.isRequired
}
export default toolbar;