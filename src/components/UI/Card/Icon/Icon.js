import React from 'react';
import PropTypes from 'prop-types';
import classes from './Icon.css'

const icon = (props) => {
  return (
    <div className={classes.Icon}>
      <img src={props.src} alt=""/>
    </div>
  );
};
icon.propTypes = {
  src: PropTypes.string.isRequired
}
export default icon;