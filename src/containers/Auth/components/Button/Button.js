import React from "react";
import classes from "./Button.css";
import PropTypes from "prop-types";

const Button = props => {
  return <button {...props} className={classes.Button}>{props.children}</button>;
};

Button.propTypes = {
  children: PropTypes.any
};

export default Button;