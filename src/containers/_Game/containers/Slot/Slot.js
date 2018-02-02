import React, { Component } from "react";
import classes from "./Slot.css";
import Square from "../../components/Square/Square";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import BettingChips from "../../components/BettingChips/BettingChips";
import { getAbbrevation } from "../../../../util";
/**
 * Droptarget Spec
 */
const slotTarget = {
  drop(props, monitor) {
    // monitor.getItem() gives the item
    // props.moveChipToSlot(); is the method we can call to update the position of the chip
    // console.log(
    //   "item\n",
    //   JSON.stringify(monitor.getItem()),
    //   "dropped at tile\n",
    //   JSON.stringify(props)
    // );
    props.moveChipToSlot(monitor.getItem(), props.position);
  },
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

// const getColorsObject = systems => {
//   const colors = {};
//   systems.forEach(system => {
//     let borderKey =
//       "border" +
//       Config[system]["position"].replace(/^./, $1 => $1.toUpperCase()) +
//       "Color";
//     colors[borderKey] = Config[system]["color"];
//   });
//   return colors;
// };

class Slot extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      dropTarget,
      isOver,
      canDrop,
      leftSystem,
      rightSystem,
      bottomSystem,
      topSystem,
      position,
      heldChips,
      children,
      width
    } = this.props;
    const titleArray = [
      bottomSystem.display,
      topSystem.display,
      leftSystem.display,
      rightSystem.display
    ].filter(s => s);
    return dropTarget(
      <div className={classes.Slot}>
        <Square
          style={{
            borderBottomColor: bottomSystem.color,
            borderTopColor: topSystem.color,
            borderLeftColor: leftSystem.color,
            borderRightColor: rightSystem.color,
            backgroundColor: canDrop ? "#d0f4a6" : "transparent",
            opacity: canDrop ? (isOver ? 0.8 : 0.5) : 1,
            width: width
          }}
          title={titleArray.join(", ")}
        >
          <BettingChips chips={heldChips} />
          {getAbbrevation(position)}
          {children}
        </Square>
      </div>
    );
  }
}

Slot.propTypes = {
  topSystem: PropTypes.any,
  bottomSystem: PropTypes.any,
  leftSystem: PropTypes.any,
  rightSystem: PropTypes.any,
  heldChips: PropTypes.array,
  position: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  dropTarget: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
  children: PropTypes.any,
  moveChipToSlot: PropTypes.func,
  width: PropTypes.string
};

export default DropTarget("chip", slotTarget, collect)(Slot);
