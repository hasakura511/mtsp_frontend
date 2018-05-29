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

  }

  toTitleCase= (str) => {
    return str.replace(/\w[^\ ^-]*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
 }
  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    const { dragSource, isDragging, dragPreview, canDrag, chip, showHeatmap, isLive } = this.props;
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

    var title = "";

    if (chip.tier != undefined) {
      title="Tier: " + this.toTitleCase(chip.tier.toString()) + "\n"; 
      title+="Lockdown: " + chip.lockdown_text.toString() + "\n"; 
      title+="Unlock: " + chip.unlocktime_text.toString() + "\n"; 
      title+="Account Value: " + '$' + this.numberWithCommas(chip.account_value.toString()) + "\n"; 
      title+="Cum. % Chg: " + chip.pnl_cumpct.toString() + "%\n";
      title+="Markets in Portfolio: " + chip.num_markets.toString() + "\n"; 
      title+="Age: " + chip.age.toString() + "\n";
      title+="Current Bet: " + chip.last_selection.toString() + "\n";
      title+="Status: " + chip.status.toString();
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
      <div className={classes.Chip} style={chipStyle} title={title}>
        <p>{chip.display}</p>
      </div>
    );
    return dragSource(
      <div className={classes.Chip} style={chipStyle} title={title}>
        <p>{chip.display}</p>
      </div>
    );
  }
}

