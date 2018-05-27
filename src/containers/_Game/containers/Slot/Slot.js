import React, { Component } from "react";
import classes from "./Slot.css";
import Square from "../../components/Square/Square";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import BettingChips from "../../components/BettingChips/BettingChips";
import { LongShortMap } from "../../Config";

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
      width,
      fontSize,
      dictionary_strategy,
      slotHeatmap
    } = this.props;
    const titleArray = [
      bottomSystem.display,
      topSystem.display,
      leftSystem.display,
      rightSystem.display
    ].filter(s => s);
    var ps=(LongShortMap[position] || position);
    var name="";
    if (ps.toString().match(/^\d+$/)) {
      name="Name: " + ps + "\nFull Name: " + ps + "\nType: Child\nParents: " + titleArray.join(", ")
    } else {
      var fullname=ps;
      var desc=titleArray.join(", ");
      var type="Parent";
      if ( dictionary_strategy !== undefined) {
        if (ps in dictionary_strategy) {
            fullname=dictionary_strategy[ps].board_name;
            desc=dictionary_strategy[ps].description;
            type=dictionary_strategy[ps].type;
            
        }
      }
      name="Name: " + ps + "\nFull Name: " + fullname + "\nType: " + type + "\nDescription: " + desc;

    }    
    var bgColor="#d0f4a6";
    var textColor="#000000";
    if (slotHeatmap != undefined && slotHeatmap.color_fill != undefined) {
      bgColor=slotHeatmap.color_fill;
    }
    if (slotHeatmap != undefined && slotHeatmap.color_text != undefined) {
      textColor=slotHeatmap.color_text;
    }
    return dropTarget(
      <div className={classes.Slot}>
        <Square
          style={{
            borderBottomColor: bottomSystem.color,
            borderTopColor: topSystem.color,
            borderLeftColor: leftSystem.color,
            borderRightColor: rightSystem.color,
            backgroundColor: canDrop ? bgColor : "transparent",
            color: textColor,
            opacity: canDrop ? (isOver ? 0.99 : 0.8) : 1,
            width,
            fontSize
          }}
          title={name}
        >
          <BettingChips chips={heldChips} />
          {LongShortMap[position] || position}
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
  position: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  dictionary_strategy:PropTypes.object,
  dropTarget: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
  children: PropTypes.any,
  moveChipToSlot: PropTypes.func,
  width: PropTypes.string,
  fontSize: PropTypes.string,
  slotHeatmap:PropTypes.object
};

export default DropTarget("chip", slotTarget, collect)(Slot);
