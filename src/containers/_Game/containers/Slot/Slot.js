import React, { Component } from "react";
import classes from "./Slot.css";
import Square from "../../components/Square/Square";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import BettingChips from "../../components/BettingChips/BettingChips";
import { LongShortMap } from "../../Config";

import { connect } from "react-redux";
import * as actions from "../../../../store/actions";

const stateToProps = state => {
  return {
    //simulatedDate: state.betting.simulatedDate,
    //dashboard_totals:state.betting.dashboard_totals,
    isLive:state.betting.isLive,
    heatmap_selection:state.betting.heatmap_selection,
    //liveDate:state.betting.liveDate,
  };
};

const dispatchToProps = dispatch => {
  return {
    showHeatmap(id) {
      dispatch(actions.showHeatmap(id));
    },
  };
};


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
    return true;
    /*
    return !props.heldChips.find(
      chip => chip.accountId === monitor.getItem().accountId
    );
    */
  },

};

const collect = (connect, monitor) => {
  return {
    dropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
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

@connect(stateToProps, dispatchToProps)

class Slot extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.myRef = React.createRef();
  }

  render() {
    var {
      dropTarget,
      isOver,
      isOverCurrent,
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
      slotHeatmap,
      bgColor,
      textColor,
      isLive,
      heatmap_selection
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
    var rank="";
    var score="";
    var highlightTextColor=textColor;
    if (slotHeatmap != undefined && slotHeatmap.color_fill != undefined) {
      bgColor=slotHeatmap.color_fill;
    }
    if (slotHeatmap != undefined && slotHeatmap.color_text != undefined) {
      highlightTextColor=slotHeatmap.color_text;
    }
    if (slotHeatmap != undefined && slotHeatmap.rank != undefined) {
      rank="Rank: " + slotHeatmap.rank.toString();
    }
    if (slotHeatmap != undefined && slotHeatmap.score != undefined) {
      score="Score: " + slotHeatmap.score.toString();
    }

    var visible=1;
    var popoverVisible=this.state.isPopoverOpen;
    if (this.props.heatmap_selection) {
      popoverVisible=false;
      visible=0;
    }
    
    return dropTarget(
      <div className={classes.Slot}>
          {rank ? (
            <span style={{
              width: "60px",
              "marginTop": "-10px",
              backgroundColor: canDrop ? bgColor : "transparent",
              color: highlightTextColor,
              "whiteSpace": "nowrap",
              opacity: 1,
              textAlign: "center"
          }}
          >
              <span style={{ "fontSize":"9px" }}>{rank}</span>

          </span>
          ) : null}
        <Square
          style={{
            borderBottomColor: bottomSystem.color,
            borderTopColor: topSystem.color,
            borderLeftColor: leftSystem.color,
            borderRightColor: rightSystem.color,
            backgroundColor: canDrop ? bgColor : "transparent",
            color:  textColor,
            zIndex: "1",
            opacity: canDrop ? (isOver ? 0.99 : 0.8) : 1,
            width,
            fontSize
          }}
          title={name}
        >
           <BettingChips   
           parent={this.myRef} 
           chips={heldChips} 
           /> 
           
                            
          <span style={{
            "marginTop": "0px",
            minWidth: "60px",
            backgroundColor: canDrop ? bgColor : "transparent",
            color: canDrop ? highlightTextColor : textColor,
            opacity: isOver?0.5:1,
            textAlign: "center"

              }}>
            {LongShortMap[position] || position}
            {children}
          </span>
        </Square>
        {score ? (
            <span style={{
                          width: "60px",
                          "marginTop": "0px",
                          backgroundColor: canDrop ? bgColor : "transparent",
                          color: highlightTextColor,
                          opacity: 1,
                          "whiteSpace": "nowrap",
                          textAlign: "center"

            }}>
            <span style={{ "fontSize":"9px" }}>{score}</span>

            </span>
          ) : null}
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
  isOverCurrent: PropTypes.bool,
  canDrop: PropTypes.bool,
  children: PropTypes.any,
  moveChipToSlot: PropTypes.func,
  width: PropTypes.string,
  fontSize: PropTypes.string,
  slotHeatmap:PropTypes.object,
  bgColor:PropTypes.string,
  textColor:PropTypes.string,
  heatmap_selection:PropTypes.string,
  isLive:PropTypes.bool
};

export default DropTarget("chip", slotTarget, collect)(Slot);
