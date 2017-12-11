import React from 'react';
import logoImg from '../../assets/images/logo.png';
import classes from './Logo.css';

const logo = () => {
  return (
    <div className={classes.Logo}>
      <img src={logoImg} alt="GSM"/>
    </div>
  );
};
export default logo;