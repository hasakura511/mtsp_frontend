import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classes from "./RemoveContainer.css";
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
    props.removeStratFromSlot(monitor.getItem());
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
 * RemoveContainer react functional component
 * @function container
 * @param {Object} props
 * @returns {Object} ReactElement
 */
export default class RemoveContainer extends PureComponent {

  
  static propTypes = {
    dropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    removeStratFromSlot:PropTypes.func.isRequired,
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
    var { dropTarget, isOver, canDrop } = this.props;

     return dropTarget(
      <div
        className={classes.RemoveContainer}>

                

           
                 <div style={{width:"350px", marginTop: "0px", float:"left"}}>
                     <img src={"/images/remove_strategy.png"} height={30} style={{width:"350px"}}/>
                </div>
                <div style={{ marginLeft: '-290px', marginTop: '2px', fontSize: "18px", color:"#ffffff", float:"left"}}>Place here to Remove Strategy</div>
               

      </div>
    );
  }
}
