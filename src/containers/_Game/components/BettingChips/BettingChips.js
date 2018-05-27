import React, { Component } from 'react';
import PropTypes from "prop-types";
import Chip from "../_Chip/_Chip";
import classes from "./BettingChips.css";
import Popover from 'react-simple-popover';


export default class BettingChips extends Component {
  static propTypes = {
    chips: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.myRef = React.createRef();

  }
  
  handleClick(e) {
    this.setState({open: !this.state.open});
  }
 
  handleClose(e) {
    this.setState({open: false});
  }

  render() {
    const {chips} = this.props;
    if (chips.length == 0) { 
      return null;
    } else if (chips.length == 1) {
      return (
        <div className={classes.BettingChips}
            style={{"overflowX": "visible"}}>
          <Chip chip={chips[0]} canDrag={true} />
        </div>
      );

    } else {
      var chipHtml=[]
      var status="";
      var margin=-24;
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
            <span style={{ "position":"absolute",
                         
                          "marginLeft": margin + "px" 
                          }}><Chip chip={row} canDrag={true} /></span>
          );
          margin += 48;
        }
      });
    
    
      margin += 48;
      
      return (
        <div className={classes.BettingChips}
            style={{"overflowX": "visible",
                    "overflowY": "visible",
                   }}>
             <a
          href="#"
          className={classes.MSquare}
          ref={this.myRef}
          onClick={this.handleClick.bind(this)}>
              <span style={{"position":"absolute","marginTop":"-15px", "marginLeft":"-15px", "background":"transparent","color":"white"}}>{chips.length} x </span>
              <span style={{"position":"absolute","marginTop":"-15px", "marginLeft":"15px",  "background":"transparent", "color":"white"}}><img src="/images/chip-icon.png" /></span>
              <br/>
              <span style={{"position":"absolute","marginTop":"15px",  "background":"transparent", "color":"white"}}>
              {Math.round(total/1000)}K
              </span>
          </a>
        <Popover
          placement='top'
          
          container={this}
          target={this.myRef.target}
          show={this.state.open}
          onHide={this.handleClose.bind(this)} 
          hideWithOutsideClick={true}
          style={{
            "position":"absolute",
            "transform": "translate(-50%, -100%)",
            "height":'60px',
            "width":margin+"px"}}
          >
          <div className={classes.MultiChips}
          style={{"width":margin + "px",
          "marginTop": "-12px",
          "marginLeft": "-12px"
        }}
                
          > { chipHtml  }</div>
        </Popover>

        </div>
      );
    }
  }  
}




