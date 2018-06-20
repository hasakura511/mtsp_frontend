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
import Sound from 'react-sound';
import { toTitleCase, numberWithCommas } from "../../../../util";


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
const chipSource = {
  /**
   * @returns {Object} returns the Object representation of item being dragged
   * @param {Object} props Component's actual props without influence of DragSource Decorator
   */
  beginDrag(props, monitor, component) {
    //console.log(props);
    console.log("begin drag",props.chip.chip_id)
    props.showHeatmap(props.chip.chip_id+"");
    props.chip.isPlaying=true;
    props.chip.isDonePlaying=false;
    console.log("beginning")
    return props.chip;
  },
  canDrag(props) {
    const { chip } = props;
    if (chip.status == undefined || chip.status == 'locked')
      return false;
    
    return true;
  },
  endDrag(props,monitor, component) {
    const { chip  } = props;
    console.log("end drag",props.chip.chip_id)
    props.showHeatmap("");
    props.chip.isPlaying=false;
    props.chip.isDonePlaying=true;
    return props.chip;
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
@DragSource("Chip", chipSource,  collect)

export default class Chip extends PureComponent {
  static propTypes = {
    chip: PropTypes.object.isRequired,
    dragSource: PropTypes.func,
    isDragging: PropTypes.bool,
    canDrag: PropTypes.bool,
    dragPreview: PropTypes.any,
    isLive:PropTypes.bool.isRequired,
    showHeatmap:PropTypes.func.isRequired,
    accounts:PropTypes.array.isRequired,
    //heatmap_selection:PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state={
      chip:this.props.chip
    }

  }

  componentWillReceiveProps(newProps) {
    console.log("Chip Received New Props")
    console.log(newProps);
    var self=this;
    if (newProps.chip && newProps.chip != this.state.chip) {
      self.setState({chip:newProps.chip});
      
    }
    if (newProps.accounts) {
          var updated=false;
          newProps.accounts.map(account => {
              if (account.account_id == self.props.chip.account_id) {
                self.setState({chip:account});
                console.log("Chip Received new state for chip " + account.account_id);
                console.log(account);
                updated=true;
              }
          });
          if (updated) 
            self.forceUpdate();

      }
  }



  render() {
    const { dragSource, isDragging, dragPreview, canDrag, showHeatmap, isLive } = this.props;
    const {chip} = this.state;
    const img = new Image();
    img.style = {
      width: "48px",
      height: "48px"
    };
    var self=this;
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
      title="Tier: " + toTitleCase(chip.tier.toString()) + "\n"; 
      title+="Lockdown: " + chip.lockdown_text.toString() + "\n"; 
      title+="Unlock: " + chip.unlocktime_text.toString() + "\n"; 
      title+="Account Value: " + '$' + numberWithCommas(chip.account_value.toString()) + "\n"; 
      title+="Cum. % Chg: " + chip.pnl_cumpct.toString() + "%\n";
      title+="Markets in Portfolio: " + chip.num_markets.toString() + "\n"; 
      title+="Age: " + chip.age.toString() + "\n";
      title+="Current Bet: " +  toTitleCase(chip.last_selection.toString()) + "\n";
      title+="Status: " +  toTitleCase(chip.status.toString());
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
    var chipStyle2=chipStyle;
    if (chipImg)
      chipStyle={  "backgroundImage": "url(" + chipImg + ")" 
      ,
      "backgroundSize": "48px 48px",
      "backgroundPosition": "-3px -3px",
      zIndex: "100",
            
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

