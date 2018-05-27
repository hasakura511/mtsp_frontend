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
  const { dropTarget, isOver, canDrop, heldChips, slotHeatmap, column } = props;
    var bgColor="#d0f4a6";
    var textColor="#000000";
    var chipBgColor="#86dde0";
    var display=column;
    var rank="";
    var score="";

    if (slotHeatmap != undefined && slotHeatmap.color_fill != undefined) {
      bgColor=slotHeatmap.color_fill;
      chipBgColor=bgColor;
    }
    if (slotHeatmap != undefined && slotHeatmap.color_text != undefined) {
      textColor=slotHeatmap.color_text;
    }
    if (slotHeatmap != undefined && slotHeatmap.rank != undefined) {
      rank="Rank: " + slotHeatmap.rank.toString();
    }
    if (slotHeatmap != undefined && slotHeatmap.score != undefined) {
      score="Score: " + slotHeatmap.score.toString();
    }
     return dropTarget(
    <div
      className={classes.Container}
      style={{
        backgroundColor: heldChips.length
          ? chipBgColor
          : canDrop ? bgColor : "transparent",
        color: textColor,
        opacity: canDrop ? (isOver ? 1:1) : 1,
        textAlign: "center",
      }}
    >
        {rank ? (
            <span style={{
              "marginTop": "-15px",
              "paddingTop": "5px",
              "paddingBottom": "5px",
              "marginLeft": "-50%",
              backgroundColor: canDrop ? bgColor : "transparent",
              color: textColor,
              opacity: 1,
              position:"absolute",
              textAlign: "center",
              width:"100%"
          }}>
          <font size="1">{rank}</font>
          <br/>
          <font color={textColor}>{display}</font>
          <br/>
          <font size="1">{score}</font>
          </span>
          ) : null}

        {!rank && (canDrop || heldChips.length) ? 
              (
                <span style={{
                  "marginTop": "-5px",
                  "paddingBottom": "5px",
                  "marginLeft": "-50%",
                  opacity: 1,
                  position:"absolute",
                  textAlign: "center",
                  width:"100%"
              }}>
              <br/>
              <font color={textColor}>{display}</font>
              <br/>
              </span>
              ) : null
            }

        {canDrop ?
          null :
          (

          <BettingChips chips={heldChips} />
          )
        }

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
