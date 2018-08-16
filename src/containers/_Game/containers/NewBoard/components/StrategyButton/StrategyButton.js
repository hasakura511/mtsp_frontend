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
import StrategyPreview from './StrategyPreview'

const stateToProps = state => {
  return {
    //simulatedDate: state.betting.simulatedDate,
    //dashboard_totals:state.betting.dashboard_totals,
    isLive:state.betting.isLive,
    accounts:state.betting.accounts,
    dictionary_strategy:state.betting.dictionary_strategy,
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
    $('.dropdown').trigger('blur');

    console.log("beginning")
    return props.strategy;
  },
  canDrag(props) {
    const { strategy } = props;
    if (props.dontDrag)
      return false;
    
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


@DragSource("StrategyButton", strategySource,  collect)
@connect(stateToProps, dispatchToProps)

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
    viewMode:PropTypes.string,
    dictionary_strategy:PropTypes.object.isRequired,
    dontDrag:PropTypes.bool,
    //heatmap_selection:PropTypes.string
  };

  constructor(props) {
    super(props);
    var strategy=this.props.strategy;
    var dictionary_strategy=this.props.dictionary_strategy;
    if (strategy.strategy in dictionary_strategy) {
      const desc=dictionary_strategy[strategy.strategy];
      strategy.short=desc.board_name;
      strategy.description=desc.description;
      strategy.type=desc.type;
      strategy.display=strategy.strategy;
      strategy.id=strategy.strategy;
        
    }
    this.state={
      strategy:strategy,
      zIndex: 0
    }

  }

  componentWillReceiveProps(newProps) {
    //console.log("StrategyButton Received New Props")
    //console.log(newProps);
    var self=this;
    
  }


  getChipStyle = () => {
    const { dragSource, isDragging, dragPreview, canDrag, showHeatmap, isLive, strategy, dictionary_strategy } = this.props;
    
    if (strategy.strategy in dictionary_strategy) {
      const desc=dictionary_strategy[strategy.strategy];
      strategy.id=strategy.strategy;
      strategy.display=strategy.strategy;
      
      strategy.short=desc.board_name;
      strategy.description=desc.description;
      strategy.type=desc.type;
    }
    
    var mesg=" Name: " + strategy.id + "\n Full Name: " + strategy.short + "\n Type: " + strategy.type + "\n Description: " + strategy.description + "\n " + strategy.rank;

    var title=mesg;
    var chipStyle={borderColor:strategy.color_border, 
                   background:strategy.color_fill,
                   color:strategy.color_text,
                   zIndex: this.state.zIndex,
                };
      
      return {chipStyle, title};
  }

  render() {
    var self=this;
    const { dragSource, isDragging, dragPreview, canDrag, showHeatmap, isLive, strategy, dictionary_strategy } = this.props;
    var {chipStyle, title}=this.getChipStyle();
   
    var score="";
    var idx=0;
    var bgColor=strategy.color_fill;
    var chipBgColor=strategy.color_fill;
    var textColor=strategy.color_text;
    var rank=strategy.rank;

    
    //console.log(chipStyle);
    if (isDragging) {
      return  <StrategyPreview {...this.props} viewMode={this.props.viewMode} getChipStyle={this.getChipStyle} strategy={strategy} />
    } else {
      if (this.props.viewMode && this.props.viewMode=='tab') {
        return dragSource (

          <div
        className={classes.TabContainer}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          opacity: 1,
          textAlign: "center",
          cursor:'pointer'
        }}
      >
              <span style={{
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
                height:"24px",
                width:"100%",
                lineHeight:"10px"
            }}>
                <br/>
                <font style={{opacity: 1}} color={textColor}>{strategy.display}</font>
                <br/> 
                <span style={{ "fontSize":"9px" }}>{strategy.rank}</span>
            </span>
            </div>
        )
      } else {
        return dragSource(
          <div className={classes.StrategyButton} style={chipStyle}

        title={title}>
          <span style={{fontSize:"15px"}}>{strategy.strategy}
            <div style={{marginTop:"-10px", fontSize:"9px"}}>
            <br/>
            {strategy.rank}
            </div>
            
          </span>

          </div>
        );
      }
    }
  }

 
}

