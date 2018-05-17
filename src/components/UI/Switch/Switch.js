import React from "react";
import classes from "./Switch.css";
import PropTypes from "prop-types";

const _switch = props => {
  return (
    <label className={classes.switch}>
      <input type="checkbox" onChange={props.toggle} />
      <span className={classes.slider + " " + classes.round} />
    </label>
  );
};

_switch.propTypes = {
  toggle: PropTypes.func.isRequired
};

export default _switch;
