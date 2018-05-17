import React from "react";
import classes from "./CancelButton.css";
import PropTypes from "prop-types";

const cancelButton = props => {
  return (
    <button {...props} className={classes.Button}>
      {props.children}
    </button>
  );
};

cancelButton.propTypes = {
  children: PropTypes.any
};

export default cancelButton;
