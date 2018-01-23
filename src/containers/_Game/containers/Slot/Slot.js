import React, { Component } from "react";
import classes from "./Slot.css";
import Square from "../../components/Square/Square";
import PropTypes from "prop-types";
import Config from "../../Config";
import { DropTarget } from "react-dnd";

/**
 * Droptarget Spec
 */
const slotTarget = {
  drop(props) {
    debugger;
  },
  canDrop(props) {
    return true;
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
      topSystem
    } = this.props;
    const titleArray = [
      bottomSystem.display,
      topSystem.display,
      leftSystem.display,
      rightSystem.display
    ];
    return dropTarget(
      <div className={classes.Slot}>
        <Square
          colors={{
            borderBottomColor: bottomSystem.color,
            borderTopColor: topSystem.color,
            borderLeftColor: leftSystem.color,
            borderRightColor: rightSystem.color
          }}
          title={titleArray.join(", ")}
        >
          {this.props.position}
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
  position: PropTypes.number.isRequired,
  dropTarget: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool
};

export default DropTarget("chip", slotTarget, collect)(Slot);
