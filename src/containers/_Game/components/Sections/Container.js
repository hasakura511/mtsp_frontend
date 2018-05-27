import React from "react";
import PropTypes from "prop-types";
import classes from "./Container.css";
import { DropTarget } from "react-dnd";

import BettingChips from "../BettingChips/BettingChips";

// DropTarget spec [specification] object for system's Tile.
const systemTarget = {
  /**
   * drop hook that is executed when the item is dropped
   * @function drop
   * @param {any} props
   * @param {any} monitor
   */
  drop(props, monitor) {
    props.moveChipToSlot(monitor.getItem(), props.column);
  },

  /**
   * canDrop hook executed to return if the item is droppable to this target
   * @function canDrop
   * @param {any} props
   * @param {any} monitor
   */
  canDrop(props, monitor) {
    return !props.heldChips.find(
      chip => chip.accountId === monitor.getItem().accountId
    );
  }
};

const collect = (connect, monitor) => {
  return {
    dropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
};

/**
 * Container react functional component
 * @function container
 * @param {Object} props
 * @returns {Object} ReactElement
 */
const container = props => {
  const { dropTarget, isOver, canDrop, heldChips, slotHeatmap } = props;
    var bgColor="#d0f4a6";
    var textColor="#000000";
    if (slotHeatmap != undefined && slotHeatmap.color_fill != undefined) {
      bgColor=slotHeatmap.color_fill;
    }
    if (slotHeatmap != undefined && slotHeatmap.color_text != undefined) {
      textColor=slotHeatmap.color_text;
    }

  return dropTarget(
    <div
      className={classes.Container}
      style={{
        backgroundColor: heldChips.length
          ? "#86dde0"
          : canDrop ? bgColor : "transparent",
        color: textColor,
        opacity: canDrop ? (isOver ? 0.9 : 0) : 1
      }}
    >
      <BettingChips chips={heldChips} />
    </div>
  );
};

container.propTypes = {
  dropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  moveChipToSlot: PropTypes.func.isRequired,
  column: PropTypes.string.isRequired,
  heldChips: PropTypes.array.isRequired
};

export default DropTarget("chip", systemTarget, collect)(container);
