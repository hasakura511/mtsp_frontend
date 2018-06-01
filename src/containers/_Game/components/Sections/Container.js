import React, { PureComponent } from "react";
import { connect } from "react-redux";
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
    return true; 
    /*!props.heldChips.find(
      chip => chip.accountId === monitor.getItem().accountId
    );
    */
  }
};

const collect = (connect, monitor) => {
  return {
    dropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
};

@DropTarget("chip", systemTarget, collect)


/**
 * Container react functional component
 * @function container
 * @param {Object} props
 * @returns {Object} ReactElement
 */
export default class Container extends PureComponent {

  
  static propTypes = {
    dropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    moveChipToSlot: PropTypes.func.isRequired,
    column: PropTypes.string.isRequired,
    heldChips: PropTypes.array.isRequired,
    slotHeatmap:PropTypes.any,
    bgColor:PropTypes.string,
    textColor:PropTypes.string,
    showOrderDialog:PropTypes.bool,
    heatmap_selection:PropTypes.string
    
  };
  
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  
  render() {
    const { dropTarget, isOver, canDrop, heldChips, slotHeatmap, column } = this.props;
    var bgColor=this.props.bgColor;
    var textColor=this.props.textColor;
    var chipBgColor=this.props.bgColor;
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
                "marginTop": "-10px",
                "paddingTop": "10px",
                "paddingBottom": "5px",
                "marginLeft": "-50%",
                "whiteSpace": "nowrap",
                backgroundColor: canDrop ? bgColor : "transparent",
                color: textColor,
                opacity: 1,
                position:"absolute",
                textAlign: "center",
                height:"24px",
                width:"100%",
                lineHeight:"10px"
            }}>
            
            <font style={{opacity: canDrop ? (isOver ? 0.2:1) : 1}} color={textColor}>{display}</font>
            <br/>
            <span style={{ "fontSize":"9px" }}>{rank}</span>
            <br/>
            <span style={{ "fontSize":"9px" }}>{score}</span>
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
                    width:"100%",
                }}>
                <br/>
                <font color={textColor}>{display}</font>
                <br/>
                </span>
                ) : null
              }

          <BettingChips   
           parent={this.myRef} 
           chips={heldChips} 
           style={{opacity: canDrop ? 0.01 : 1 }}
           showOrderDialog={this.props.showOrderDialog}
           heatmap_selection={this.props.heatmap_selection}

           /> 
           
           

      </div>
    );
  }
}
