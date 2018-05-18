import React from 'react';
import PropTypes from 'prop-types';
import classes from './Backdrop.css'

const backdrop = (props) => {
  return (
    props.show ? <div className={classes.Backdrop} onClick={props.toggle}></div> : null
  );
};

backdrop.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func
}
export default backdrop;