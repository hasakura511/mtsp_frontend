import React from 'react';
import PropTypes from 'prop-types';
// import classes from './.css'
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';

const sideDrawer = (props) => {
  //props.show
  const showClass = props.show ? classes.Open : classes.Close
  
  return (
    <div className={classes.SideDrawer + ' ' + showClass} onClick={props.toggle}>
      <div className={classes.Logo}>
        <Logo />
      </div>
      <nav>
        <NavigationItems links={props.links} />
      </nav>
    </div>
  );
};

sideDrawer.propTypes = {
  links: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
}

export default sideDrawer;