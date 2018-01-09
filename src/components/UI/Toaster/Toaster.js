import React from "react";
import PropTypes from "prop-types";
import classes from "./Toaster.css";

const toaster = props => {
  const focusedClass = props.isFocused ? classes.Focused : "";
  return (
    <div
      onMouseEnter={() => props.onFocusHandler(props.id)}
      onMouseLeave={() => props.onUnfocusHandler(props.id)}
      className={classes.Toaster + " " + focusedClass}
    >
      <div className={classes.Text}>
        <p>
          {props.text
            .replace(/\[|\]|u'|'/g, "")
            .replace(/^[a-z]/, $1 => $1.toUpperCase())}
        </p>
      </div>
      <button onClick={() => props.closeClick(props.id)}>X</button>
    </div>
  );
};
toaster.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  closeClick: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  onFocusHandler: PropTypes.func.isRequired,
  onUnfocusHandler: PropTypes.func.isRequired
};
export default toaster;
