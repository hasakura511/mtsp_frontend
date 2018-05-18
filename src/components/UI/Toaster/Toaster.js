import React from "react";
import PropTypes from "prop-types";
import classes from "./Toaster.css";

const toaster = props => {
  const focusedClass = props.isFocused ? classes.Focused : "";
  const {
    onUnfocusHandler,
    onFocusHandler,
    id,
    text,
    closeClick,
    success
  } = props;
  return (
    <div
      onMouseEnter={() => onFocusHandler(id)}
      onMouseLeave={() => onUnfocusHandler(id)}
      className={classes.Toaster + " " + focusedClass}
    >
      <div className={classes.Text}>
        <p>
          <i
            className={`fa fa-${success ? "check" : "warning"}`}
            style={{ marginRight: "10px" }}
          />
          {text
            .replace(/\[|\]|u'|'/g, "")
            .replace(/^[a-z]/, $1 => $1.toUpperCase())}
        </p>
      </div>
      {
        // below is the depricated close button
      }
      {/* <button className={classes.CloseIcon} onClick={() => closeClick(id)}>X</button> */}
      <button className={classes.Close} onClick={() => closeClick(id)}>
        Close
      </button>
    </div>
  );
};
toaster.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  closeClick: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  onFocusHandler: PropTypes.func.isRequired,
  onUnfocusHandler: PropTypes.func.isRequired,
  success: PropTypes.bool
};
export default toaster;
