import React, { Component } from 'react';
import PropTypes from "prop-types";
import Chip from "../_Chip/_Chip";
import classes from "./BettingChips.css";
import Popover from 'react-tiny-popover'
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";

/*
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

@connect(stateToProps, dispatchToProps)
*/
export default class BettingChips extends Component {
  static propTypes = {
    chips: PropTypes.array.isRequired,
    parent:PropTypes.any,
    heatmap_selection: PropTypes.string,
    isLive:PropTypes.bool,
    showOrderDialog:PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      isPopoverOpen:false,

    };
    this.myRef = React.createRef();

  }

  handleEnter(e) {
    this.setState({ isPopoverOpen: true });
    
  }

  handleClick(e) {
    this.setState({ isPopoverOpen: this.props.heatmap_selection ? false : !this.state.isPopoverOpen })

  }
 
  handleClose(e) {
    this.setState({ isPopoverOpen: !this.state.isPopoverOpen })
  }

  render() {
    const {chips} = this.props;
    var bgColor="#FFF2CC";
    var textColor="#000000";
    var totalBoxColor="#FFFFFF";
    var self=this;
    
    var visible=1;
    var popoverVisible=this.state.isPopoverOpen;
    if (this.props.heatmap_selection || this.props.showOrderDialog) {
      popoverVisible=false;
      visible=0;
    }
    if (chips.length == 0) { 
      return null;
    } else if (chips.length == 1) {
      return (
        <div className={classes.BettingChips}
            style={{"overflowX": "visible",
                    "opacity": !visible ? 0.3 : 1}}>
          <Chip  key={"chip-" + chips[0].chip_id } chip={chips[0]} canDrag={true} />
        </div>
      );

    } else {
      bgColor=this.props.chips[0].chip_styles.multiple.background;
      textColor=this.props.chips[0].chip_styles.multiple.text;
      totalBoxColor=this.props.chips[0].chip_styles.multiple.total_box;
      var chipHtml=[]
      var status="";
      var margin=-24 * (this.props.chips.length - 1)
      var total=0;
      chips.map(row => {
        if (row != undefined) {
          if (!status)
            status=row.status;
          else if (row.status == 'locked') {
            if (status == 'unlocked') {
              status="mixed";
            } else if (status != "mixed") {
              status="locked";
            }
          } else if (row.status == "unlocked") {
            if (status == 'locked') {
              status="mixed";
            } else if (status != "mixed") {
              status="unlocked";
            }
          }
          total+=row.account_value;
          chipHtml.push(
            <span key={"chiploc-" + row.chip_id }
                  style={{ "position":"absolute",
                          
                          "marginLeft": margin + "px" 
                          }}><Chip chip={row} key={"chip-" + row.chip_id } canDrag={true} /></span>
          );
          margin += 48;
        }
      });
      
      //alert(this.props.chips[0].chip_styles.multiple.background);
    
      margin += this.props.chips.length * 24;

      var chipImg="/images/unlocked_multi.png";
      if (status == 'locked')
        chipImg="/images/locked_multi.png";
        if (status == 'mixed')
        chipImg="/images/mixed_multi.png";
    
  
      return (
        <div className={classes.BettingChips}
            style={{"overflowX": "visible",
                    "overflowY": "visible",
                    "overflow":"visible",
                    "opacity": visible,

                   }}>
             
             
        <Popover
          position='right'

          content={
            (          
              <div className={classes.MSquare}
                    onMouseOver={self.handleEnter.bind(this)}
                    //onMouseLeave={self.handleClick.bind(this)}
                    onMouseOut={self.handleClick.bind(this)}
                    style={{
                      "width":margin + "px",
                      "height": "60px",
                      /*
                      "marginTop": "-12px",
                     "marginLeft": "-50%",
                     "transform": "translate(-50%, 0%)",
                      */   

                     "zIndex":10000000,          
                     background: bgColor,
                      color:textColor,
                  }}
                          
                    >  { chipHtml  } </div>
              )
          }
          
          isOpen={popoverVisible}
          onClickOutside={this.handleClose.bind(this)} 
          >
          <a
          className={classes.MSquare}
          //ref={this.myRef.target}
          style={{
            "zIndex":500,                   
            background: bgColor,
            color:textColor,
          }}
          href={"#"}
          onMouseEnter={this.handleClick.bind(this)}
          
          
          onClick={this.handleClick.bind(this)}>
              <span style={{"position":"absolute","marginTop":"-15px", "marginLeft":"-15px", 
                "background":"transparent",
                "fontSize":"12px",
                "color":textColor}}>{chips.length} x </span>
              <span style={{"position":"absolute","marginTop":"-15px", "marginLeft":"15px",  "background":"transparent", 
                "color":textColor}}><img width="25" height="25" src={chipImg} /></span>
              <br/>
              <span style={{"position":"absolute","marginTop":"15px",  
                          "fontSize":"12px",
                          "width": "50px",
                          "border": "0px solid black",
                          "textAlign":"center",
                          "backgroundColor": totalBoxColor,
                          color:textColor,              
              }}>
              {Math.round(total/1000)}K
              </span>
          </a>
        </Popover>

        </div>
      );
    }
  }  
}




