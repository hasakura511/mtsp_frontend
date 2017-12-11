import React from "react";
import PropTypes from "prop-types";
import classes from "./LeftRoundButton.css";

const leftRoundButton = props => {
  return (
    <button
      style={{
        ...props.style,
        width: props.width,
        borderBottomLeftRadius: props.rad,
        borderTopLeftRadius: props.rad,
        height: props.height
      }}
      className={classes.LeftRoundButton}
    >
      {props.children}
    </button>
  );
};
leftRoundButton.propTypes = {
  style: PropTypes.object,
  children: PropTypes.any,
  width: PropTypes.string,
  height: PropTypes.string,
  rad: PropTypes.string
};
export default leftRoundButton;
