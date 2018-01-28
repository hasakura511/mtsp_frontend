import React from "react";
import classes from "./ChipsPanel.css";
import Chip from "../_Chip/_Chip";
import PropTypes from "prop-types";

const chipsPanel = props => {
  const emptyChipSlots = [];
  for (let i = 0; i < 6 - props.balanceChips.length; i++) {
    emptyChipSlots.push(
      <div key={"empty-chip-" + i} className={classes.ChipContainer} />
    );
  }
  return (
    <div className={classes.ChipsPanel}>
      <div className={classes.Left}>
        <p>Off: </p>
      </div>
      <div className={classes.Right}>
        {props.balanceChips.map(chip => {
          return chip.count > 0 ? (
            <Chip
              key={"panel-chip-" + chip.accountId}
              chip={chip}
              canDrag={true}
            />
          ) : (
            <div
              key={"blank-chip-" + chip.accountId}
              className={classes.ChipContainer}
            />
          );
        })}
        {emptyChipSlots}
      </div>
    </div>
  );
};

chipsPanel.propTypes = {
  balanceChips: PropTypes.array.isRequired
};

export default chipsPanel;
