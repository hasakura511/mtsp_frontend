import React from "react";
import classes from "./ChipsPanel.css";
import Chip from "../_Chip/_Chip";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";

const offTarget = {
  drop({ moveChipToSlot }, monitor) {
    moveChipToSlot(monitor.getItem(), "off");
  },
  canDrop({ balanceChips }, monitor) {
    return (
      balanceChips.find(chip => chip.accountId === monitor.getItem().accountId)
        .count === 0
    );
  }
};

const collect = (connect, monitor) => {
  return {
    dropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver()
  };
};

const chipsPanel = props => {
  const emptyChipSlots = [];
  const { dropTarget, balanceChips, canDrop, isOver } = props;
  for (let i = 0; i < 6 - balanceChips.length; i++) {
    emptyChipSlots.push(
      <div key={"empty-chip-" + i} className={classes.ChipContainer} />
    );
  }
  return dropTarget(
    <div
      className={classes.ChipsPanel}
      style={{
        backgroundColor: canDrop ? "#d0f4a6" : "transparent",
        opacity: canDrop ? (isOver ? 0.8 : 0.5) : 1
      }}
      title="Place your chip here to exit any positions at the next market close and hold your account value in cash."
    >
      <div className={classes.Left}>
        <p>Off: </p>
      </div>
      <div className={classes.Right}>
        {balanceChips.map(chip => {
          return chip.count > 0 ? (
            <Chip
              key={"panel-chip-" + chip.accountId}
              chip={chip}
              //Allow only 5k chip to be draggable in tier 0
              // canDrag={chip.accountValue === 5000}
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
  balanceChips: PropTypes.array.isRequired,
  moveChipToSlot: PropTypes.func.isRequired,
  canDrop: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired
};

export default DropTarget("chip", offTarget, collect)(chipsPanel);
