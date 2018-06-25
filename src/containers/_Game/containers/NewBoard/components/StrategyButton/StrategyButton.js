import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classes from "./StrategyButton.css";
import { DragSource } from "react-dnd";
import { connect } from "react-redux";
import * as actions from "../../../../../../store/actions";
import { compose } from 'redux'
import Popover from 'react-tiny-popover'
import Sound from 'react-sound';
import { toTitleCase, numberWithCommas } from "../../../../../../util";


const stateToProps = state => {
  return {
    //simulatedDate: state.betting.simulatedDate,
    //dashboard_totals:state.betting.dashboard_totals,
    isLive:state.betting.isLive,
    accounts:state.betting.accounts,
    //heatmap_selection:state.betting.heatmap_selection,
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
 * @type {Object} Dragsource Spec.
 */
const strategySource = {
  /**
   * @returns {Object} returns the Object representation of item being dragged
   * @param {Object} props Component's actual props without influence of DragSource Decorator
   */
  beginDrag(props, monitor, component) {
    //console.log(props);
    console.log("begin drag",props.strategy.strategy)
    //props.showHeatmap(props.strategy.strategy+"");
    props.strategy.isPlaying=true;
    props.strategy.isDonePlaying=false;
    console.log("beginning")
    return props.strategy;
  },
  canDrag(props) {
    const { strategy } = props;
    
    return true;
  },
  endDrag(props,monitor, component) {
    const { strategy  } = props;
    console.log("end drag",props.strategy.strategy)
    //props.showHeatmap("");
    props.strategy.isPlaying=false;
    props.strategy.isDonePlaying=true;
    return props.strategy;
  },

};


/**
 * Drag properties, returns source where dragging started and returns true/false if the item is still being dragged
 * @function collect DragSource's collector function
 * @param {any} connect
 * @param {any} monitor
 * @returns {Object} Object of {connectDragSource, isDragging, connectDragPreview and canDrag}
 */
const collect = (connect, monitor) => {
  return {
    dragSource: connect.dragSource(),
    dragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    canDrag: monitor.canDrag()
  };
};


@connect(stateToProps, dispatchToProps)
@DragSource("StrategyButton", strategySource,  collect)

export default class StrategyButton extends PureComponent {
  static propTypes = {
    dragSource: PropTypes.func,
    isDragging: PropTypes.bool,
    canDrag: PropTypes.bool,
    dragPreview: PropTypes.any,
    isLive:PropTypes.bool.isRequired,
    showHeatmap:PropTypes.func.isRequired,
    accounts:PropTypes.array.isRequired,
    isReadOnly:PropTypes.bool,
    strategy:PropTypes.object.isRequired,
    //heatmap_selection:PropTypes.string
  };

  constructor(props) {
    super(props);
    var strategy=this.props.strategy;
   
    this.state={
      strategy:strategy
    }

  }

  componentWillReceiveProps(newProps) {
    //console.log("StrategyButton Received New Props")
    //console.log(newProps);
    var self=this;
 
  }



  render() {
    var self=this;
    const { dragSource, isDragging, dragPreview, canDrag, showHeatmap, isLive, strategy } = this.props;
    var title=strategy.rank;
    var strategyStyle={borderColor:strategy.color_border, 
                   background:strategy.color_fill,
                   color:strategy.color,
                };
    console.log(strategy);
    dragPreview(
        <div className={classes.StrategyButton} style={strategyStyle} title={title}>
        <p>
         <span style={{fontSize:"15px"}}>{strategy.strategy}<br/>
         </span>
         <span style={{fontSize:"9px"}}>
           {strategy.rank}
         </span>
        </p>
        </div>
    );

    return dragSource(
        <div className={classes.StrategyButton} style={strategyStyle} title={title}>
         <p>
          <span style={{fontSize:"15px"}}>{strategy.strategy}<br/>
          </span>
          <span style={{fontSize:"9px"}}>
            {strategy.rank}
          </span>
         </p>
         </div>
    );
  }
}

