import React from 'react';
import PropTypes from 'prop-types';
import classes from './Error.css'

const error = (props) => {
  return (
    <div className={classes.Error}>
      {props.children}
    </div>
  );
};

error.propTypes = {
  children: PropTypes.any
}

export default error;