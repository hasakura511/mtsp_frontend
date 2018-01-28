import React from "react";
import PropTypes from "prop-types";
import Chip from "../_Chip/_Chip";
import classes from "./BettingChips.css";

const bettingChips = props => {
  return props.chips.length === 1 ? (
    <div className={classes.BettingChips}>
      <Chip chip={props.chips[0]} />
    </div>
  ) : null;
};

bettingChips.propTypes = {
  chips: PropTypes.array
};

export default bettingChips;
