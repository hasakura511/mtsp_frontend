import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classes from "./EditContainer.css";
import { DropTarget } from "react-dnd";

import BettingChips from "../BettingChips/BettingChips";
import StrategyButton from "../../containers/NewBoard/components/StrategyButton/StrategyButton"
// DropTarget spec [specification] object for system's Tile.
const systemTarget = {
  /**
   * drop hook that is executed when the item is dropped
   * @function drop
   * @param {any} props
   * @param {any} monitor
   */
  drop(props, monitor) {
    props.moveStratToSlot(monitor.getItem(), props.column, false, props.strategy, true, props);
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

@DropTarget("StrategyButton", systemTarget, collect)


/**
 * EditContainer react functional component
 * @function container
 * @param {Object} props
 * @returns {Object} ReactElement
 */
export default class EditContainer extends PureComponent {

  
  static propTypes = {
    dropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    moveChipToSlot: PropTypes.func,
    column: PropTypes.string,
    display: PropTypes.string,
    heldChips: PropTypes.array,
    slotHeatmap:PropTypes.any,
    bgColor:PropTypes.string,
    textColor:PropTypes.string,
    showOrderDialog:PropTypes.bool,
    heatmap_selection:PropTypes.string,
    moveStratToSlot:PropTypes.func,
    isEdit:PropTypes.bool,
    heldStrats:PropTypes.array,
    strategy:PropTypes.object
  
    
  };
  
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  
  render() {
    var { dropTarget, isOver, canDrop, heldChips, slotHeatmap, column, display, heldStrats, strategy } = this.props;
    var bgColor=this.props.bgColor;
    var textColor=this.props.textColor;
    var chipBgColor=this.props.bgColor;
    var rank="";
    var score="";
    var idx=0;
    if (strategy) {
      if (strategy.color_fill) {
        bgColor=strategy.color_fill;
        chipBgColor=strategy.color_fill;
      }
      if (strategy.color_text) {
        textColor=strategy.color_text;
      }
      if (strategy.rank) {
        rank=strategy.rank;
      }
    }
    /*
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
    */
     return dropTarget(
      <div
        className={classes.EditContainer}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          opacity: canDrop ? (isOver ? 0.2:1) : 1,
          textAlign: "center",
        }}
      >

              <span style={{
                "marginTop": "0px",
                "paddingTop": "5px",
                "paddingBottom": "5px",
                "marginLeft": "-50%",
                "whiteSpace": "nowrap",
                backgroundColor: canDrop ? bgColor : "transparent",
                color: textColor,
                opacity: canDrop ? (isOver ? 0.2:1) : 1,
                position:"absolute",
                textAlign: "center",
                height:"24px",
                width:"100%",
                lineHeight:"10px"
            }}>
                <br/>
                <font style={{opacity: canDrop ? (isOver ? 0.2:1) : 1}} color={textColor}>{display}</font>
                <br/>
                <span style={{ "fontSize":"9px" }}>{rank}</span>
          
            </span>
            {strategy.id != 'Required' && strategy.id != 'Optional' ?
                <StrategyButton viewMode={'tab'} strategy={strategy} isOver={isOver} />
                : 
                <span 
                className={strategy.id == 'Required' ? " required" : ""}
                style={{
                  "marginTop": "0px",
                  "paddingTop": "5px",
                  "paddingBottom": "5px",
                  "marginLeft": "-50%",
                  "whiteSpace": "nowrap",
                  backgroundColor: bgColor,
                  color: textColor,
                  opacity: 1,
                  position:"absolute",
                  textAlign: "center",
                  height:"100%",
                  width:"100%",

                  lineHeight:"10px"
              }}>
                  <br/>
                  <font style={{opacity: canDrop ? (isOver ? 0.2:1) : 1}} color={textColor}>{display}</font>
                  <br/>
                  <span style={{ "fontSize":"9px" }}>{rank}</span>
            
              </span>
              }

                  
           
           

      </div>
    );
  }
}
