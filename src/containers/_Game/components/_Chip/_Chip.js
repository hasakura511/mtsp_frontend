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
import ChipPreview from './ChipPreview'
var moment = require('moment-timezone');

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
    if (props.dragNotice)
      props.dragNotice(true, props.chip);
    return props.chip;
  },
  canDrag(props) {
    const { chip } = props;
    if (chip.status == undefined || chip.status == 'locked' || chip.isReadOnly)
      return false;
    
    return true;
  },
  endDrag(props,monitor, component) {
    const { chip  } = props;
    console.log("end drag",props.chip.chip_id)
    props.showHeatmap("");
    props.chip.isPlaying=false;
    props.chip.isDonePlaying=true;
    if (props.dragNotice)
      props.dragNotice(false, props.chip);
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
    isReadOnly:PropTypes.bool,
    dragNotice:PropTypes.func,
    isNewBoard:PropTypes.bool,
    isAccount:PropTypes.bool
    //heatmap_selection:PropTypes.string
  };

  constructor(props) {
    super(props);
    var chip=this.props.chip;
    if (props.isReadOnly) {
      chip.isReadOnly=true;
      if (chip.locktime && chip.unlocktime) {      
        var date = new moment().tz("US/Eastern");
        const liveDate = date;

        var locktime=new moment.tz(chip.locktime.replace(' EST',''),"US/Eastern");
        var unlocktime=new moment.tz(chip.unlocktime.replace(' EST',''),"US/Eastern");
        chip['lockdown']=locktime;
        chip['lockdown_text']=locktime.format('MM/DD HH:mm:ss A') + " EST";
        chip['unlock']=unlocktime;
        chip['unlocktime_text']=unlocktime.format('MM/DD HH:mm:ss A') + " EST";
        if ( liveDate < locktime  || liveDate > unlocktime) {
          chip['status']='unlocked';
        } else {
          chip['status']='locked';
        }
      }
    }

    this.state={
      chip:chip
    }

  }

  componentWillReceiveProps(newProps) {
    //console.log("Chip Received New Props")
    //console.log(newProps);
    var self=this;
    if (!this.state.chip.isReadOnly) {
      if (newProps.accounts) {
        var updated=false;
        newProps.accounts.map(account => {
            if (account.account_id == self.props.chip.account_id) {
              self.setState({chip:account});
              //console.log("Chip Received new state for chip " + account.account_id);
              //console.log(account);
              updated=true;
            }
        });
        if (updated) 
          self.forceUpdate();

      }
    
    }
      if (newProps.chip && JSON.stringify(newProps.chip) != JSON.stringify(this.state.chip)) {
        var chip=newProps.chip;
        //if (newProps.isReadOnly || newProps.isAccountChip) {
          if (newProps.accounts) {
            newProps.accounts.map(account => {
                if (account.account_id == chip.account_id) {
                  chip=Object.assign(chip, account);                  
                }
            });
          }
          if (newProps.isReadOnly)
            chip.isReadOnly=true;
          if (newProps.isAccountChip) {
            chip.isAccountChip=true;
          }
          if (newProps.isAccount) {
            chip.isAccount=true;
          }
        
          if (chip.locktime && chip.unlocktime) {      
            var date = new moment().tz("US/Eastern");
            const liveDate = date;
      
            var locktime=new moment.tz(chip.locktime.replace(' EST',''),"US/Eastern");
            var unlocktime=new moment.tz(chip.unlocktime.replace(' EST',''),"US/Eastern");
            chip['lockdown']=locktime;
            chip['lockdown_text']=locktime.format('MM/DD HH:mm:ss A') + " EST";
            chip['unlock']=unlocktime;
            chip['unlocktime_text']=unlocktime.format('MM/DD HH:mm:ss A') + " EST";
            if ( liveDate < locktime  || liveDate > unlocktime) {
              chip['status']='unlocked';
            } else {
              chip['status']='locked';
            }
          //}
        }

        self.setState({chip:chip});
        
      }
    
  }


  getChipStyle = () => {
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
    //chip.status="locked";
    if (chip.display != undefined) {
      if (chip.tier)
        title="Tier: " + toTitleCase(chip.tier.toString()) + "\n"; 
      if (chip.lockdown_text && !chip.simulate_dates)
        title+="Lockdown: " + chip.lockdown_text.toString() + "\n"; 
      if (chip.unlocktime_text)
        title+="Unlock: " + chip.unlocktime_text.toString() + "\n"; 
      if (chip.account_value)
        title+="Account Value: " + '$' + numberWithCommas(chip.account_value.toString()) + "\n"; 
      if (chip.last_selection) {
        if (chip.isReadOnly || chip.isAccount || chip.isAccountChip)
          title+="Next Bet: " +  toTitleCase(chip.last_selection.toString()) + "\n";
        else
          title+="Current Bet: " +  toTitleCase(chip.last_selection.toString()) + "\n";
      }
  
      if (chip.pnl_cumpct)
        title+="Cumulative % Chg: " + chip.pnl_cumpct.toString() + "%\n";
      if (chip.num_markets)
        title+="Markets in Portfolio: " + chip.num_markets.toString() + "\n"; 
      if (chip.age)
        title+="Age: " + chip.age.toString() + "\n";
      if (chip.status && !chip.isReadOnly && !chip.simulate_dates)
        title+="Status: " +  toTitleCase(chip.status.toString());
    }
    //console.log("chip info")
    console.log(chip)

    if (chip.locktime && chip.unlocktime) {      
      var date = new moment().tz("US/Eastern");
      const liveDate = date;

      var locktime=new moment.tz(chip.locktime.replace(' EST',''),"US/Eastern");
      var unlocktime=new moment.tz(chip.unlocktime.replace(' EST',''),"US/Eastern");
      chip['lockdown']=locktime;
      chip['lockdown_text']=locktime.format('MM/DD HH:mm:ss A') + " EST";
      chip['unlock']=unlocktime;
      chip['unlocktime_text']=unlocktime.format('MM/DD HH:mm:ss A') + " EST";
      if ( liveDate < locktime  || liveDate > unlocktime) {
        chip['status']='unlocked';
      } else {
        chip['status']='locked';
      }
    }

    var status=chip.status;

    var chipImg="/images/unlocked_chip.png";
    if (chip.status != undefined) {
      if (status == 'locked')
        chipImg="/images/locked_chip.png";
      if (status == 'mixed')
        chipImg="/images/mixed_chip.png";
    }
    if (chip.account_chip_png) {
      chipImg="/images/" + chip.account_chip_png;
    }
    if (chip.simulate_dates) {
      chipImg="/images/practice_chip.png";      
    }
    var chipStyle={ "backgroundImage": "linear-gradient(to top, #00468c 0%, #2a92fa 100%)" };
    var chipStyle2=chipStyle;
    if (chipImg)
      chipStyle={  "backgroundImage": "url(" + chipImg + ")" 
      ,
      "backgroundSize": "48px 48px",
      "backgroundPosition": "-3px -3px",
      zIndex: "1000",
            
      };
    
      if (chip.isReadOnly) {
        chipStyle['border'] = "3px solid transparent";
        chipStyle["borderRadius"]= "32px";
      }
      
      return {chipStyle, title};
  }
  render() {
    const { dragSource, isDragging, dragPreview, canDrag, showHeatmap, isLive } = this.props;
    const {chip} = this.state;
    const {chipStyle, title}=this.getChipStyle();
    /*
    if (chip.status != undefined) {
      if (chip.status == 'locked') {
        chipStyle={ "backgroundImage": "linear-gradient(" + chip.chip_styles.locked.color_fill.toString() + ", " + chip.chip_styles.locked.color_fill.toString() + "," +  chip.chip_styles.locked.color_text.toString() + ")" };
      } else {
        chipStyle={ "backgroundImage": "linear-gradient(" + chip.chip_styles.unlocked.color_fill.toString() + ", " + chip.chip_styles.unlocked.color_fill.toString() + "," +  chip.chip_styles.unlocked.color_text.toString() + ")" };
        
      }
    }
    */
    if (isDragging) {
      return  <ChipPreview {...this.props} getChipStyle={this.getChipStyle} chip={chip} />
    } else {
      return dragSource(
            <div className={classes.Chip} style={chipStyle} title={title}>
          
            <p style={{fontWeight:800, fontSize:"12px", marginTop: 
            chip.isAccountChip || 
            this.props.isNewBoard || 
            this.props.isAccount ? "-10px":"0px" }}><b>{chip.display}
            
            </b></p>
            
            </div>
      );
    }
  }
}

