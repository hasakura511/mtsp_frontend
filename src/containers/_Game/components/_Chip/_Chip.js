import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classes from "./_Chip.css";
import { DragSource } from "react-dnd";
import imgSource_25K from "../../../../assets/images/chip-drag-25K.png";
import imgSource_50K from "../../../../assets/images/chip-drag-50K.png";
import imgSource_100K from "../../../../assets/images/chip-drag-0.1M.png";
import imgSource_blank from "../../../../assets/images/practice_chip.png";
import { replaceSymbols } from "../../ChipsConfig";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import { compose } from 'redux'
import Popover from 'react-tiny-popover'


const stateToProps = state => {
  return {
    //simulatedDate: state.betting.simulatedDate,
    //dashboard_totals:state.betting.dashboard_totals,
    isLive:state.betting.isLive,
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
const chipSource = {
  /**
   * @returns {Object} returns the Object representation of item being dragged
   * @param {Object} props Component's actual props without influence of DragSource Decorator
   */
  beginDrag(props, monitor, component) {
    //console.log(props);
    props.showHeatmap(props.chip.chip_id);
    return props.chip;
  },
  canDrag(props) {
    const { chip } = props;
    if (chip.status != undefined && chip.status == 'locked')
      return false;
    
    return props.canDrag;
  },
  endDrag(props,monitor, component) {
    const { chip  } = props;
    props.showHeatmap("");
    return chip;
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
@DragSource("chip", chipSource,  collect)

export default class Chip extends PureComponent {
  static propTypes = {
    chip: PropTypes.object.isRequired,
    dragSource: PropTypes.func,
    isDragging: PropTypes.bool,
    canDrag: PropTypes.bool,
    dragPreview: PropTypes.any,
    isLive:PropTypes.bool.isRequired,
    showHeatmap:PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isPopoverOpen:false,
  
    };
 

  }

  handleClick(e) {
    this.setState({ isPopoverOpen: !this.state.isPopoverOpen })

  }

  handleClose(e) {
    this.setState({ isPopoverOpen: !this.state.isPopoverOpen })
  }

  render() {
    const { dragSource, isDragging, dragPreview, canDrag, chip, showHeatmap, isLive } = this.props;
    const tooltipStyle = {
      display: this.state.isPopoverOpen ? 'block' : 'none'
    }
    const img = new Image();
    img.style = {
      width: "48px",
      height: "48px"
    };
    switch (chip.display) {
      case "25K":
        img.src = imgSource_25K;
        break;

      case "50K":
        img.src = imgSource_50K;
        break;

      case "0.1M":
        img.src = imgSource_100K;
        break;

      default:
        break;
    }


    var title="";
    if (chip.tier != undefined) {
      title=(
          <div style={{background:"white", 
                       color:"black", 
                       width:"150px", 
                       border: "1px solid black",
                       fontSize: "12px",
                       textAlign:"left",
                       lineHeight:"12px",
                       transform: "translate(-120%, 0%)",
                       position: "absolute",
                       overflow:"visible"

                       }}>
                <b>Tier</b>: {chip.tier}  <br/>
                <b>Lockdown</b>: {chip.lockdown_text}<br/>
                <b>Account Value</b>:  {chip.account_value.toString()} <br/>
                <b>Cum. % Chg</b>:  {chip.pnl_cumpct.toString()} <br/>
                <b>Markets in Portfolio</b>: {chip.num_markets.toString()} <br/>
                <b>Age</b>: {chip.age.toString()} <br/>
                <b>Current Bet</b>: {chip.last_selection.toString()} <br/>
                <b>Status</b>: {chip.status.toString()}
          </div>
      )
    }

    var status=chip.status;

    var chipImg="/images/unlocked_chip.png";
    if (chip.status != undefined) {
      if (status == 'locked')
        chipImg="/images/locked_chip.png";
      if (status == 'mixed')
        chipImg="/images/mixed_chip.png";
    }
    var chipStyle={ "backgroundImage": "linear-gradient(to top, #00468c 0%, #2a92fa 100%)" };
    if (chipImg)
      chipStyle={  "backgroundImage": "url(" + chipImg + ")" 
      ,
      "backgroundSize": "48px 48px",
      "backgroundPosition": "-3px -3px"
      };
    /*
    if (chip.status != undefined) {
      if (chip.status == 'locked') {
        chipStyle={ "backgroundImage": "linear-gradient(" + chip.chip_styles.locked.color_fill.toString() + ", " + chip.chip_styles.locked.color_fill.toString() + "," +  chip.chip_styles.locked.color_text.toString() + ")" };
      } else {
        chipStyle={ "backgroundImage": "linear-gradient(" + chip.chip_styles.unlocked.color_fill.toString() + ", " + chip.chip_styles.unlocked.color_fill.toString() + "," +  chip.chip_styles.unlocked.color_text.toString() + ")" };
        
      }
    }
    */
    dragPreview(

      <div className={classes.Chip} style={chipStyle}>
        <p>{chip.display}</p>
      </div>
    );
    return dragSource(
      <div className={classes.Chip} 
          style={chipStyle} 
          onMouseOver={this.handleClick.bind(this)} 
          onMouseOut={this.handleClose.bind(this)} 
          onClick={this.handleClick.bind(this)} 
          >
        
           <p>{chip.display}</p> <br/>
          <div style={tooltipStyle}>{title}</div>
      </div>
    );
  }
}

