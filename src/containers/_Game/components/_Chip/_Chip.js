import React from "react";
import PropTypes from "prop-types";
import classes from "./_Chip.css";
import ChipConfig from "./ChipConfig.js";

const chip = props => {
  return (
    <div className={classes.Chip}>
      <p>{ChipConfig[props.chip].display}</p>
    </div>
  );
};
chip.propTypes = {
  chip: PropTypes.string.isRequired
};
export default chip;
