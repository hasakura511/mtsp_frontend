import React from 'react';
import PropTypes from 'prop-types';
import classes from './FormatModal.css'

const formatModal = (props) => {
  return (
    <div className={classes.FormatModal}>
      <div className={classes.Title}>
        <h2>{props.title}</h2>
      </div>
      <div className={classes.Content}>
        {props.children}
      </div>
    </div>
  );
};
formatModal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any
}
export default formatModal;