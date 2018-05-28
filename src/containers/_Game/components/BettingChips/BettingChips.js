import React, { Component } from 'react';
import PropTypes from "prop-types";
import Chip from "../_Chip/_Chip";
import classes from "./BettingChips.css";
import Popover from 'react-simple-popover';


export default class BettingChips extends Component {
  static propTypes = {
    chips: PropTypes.array.isRequired,
    parent:PropTypes.any
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
    var bgColor="#FFF2CC";
    var textColor="#000000";
    var totalBoxColor="#FFFFFF";

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
            <span style={{ "position":"absolute",
                         
                          "marginLeft": margin + "px" 
                          }}><Chip chip={row} canDrag={true} /></span>
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
                   }}>
             <a
          href="#"
          className={classes.MSquare}
          ref={this.myRef.target}
          style={{
            background: bgColor,
            color:textColor,
          }}
          onClick={this.handleClick.bind(this)}>
              <span style={{"position":"absolute","marginTop":"-15px", "marginLeft":"-15px", 
                "background":"transparent",
                "fontSize":"1em",
                "color":textColor}}>{chips.length} x </span>
              <span style={{"position":"absolute","marginTop":"-15px", "marginLeft":"15px",  "background":"transparent", 
                "color":textColor}}><img width="25" height="25" src={chipImg} /></span>
              <br/>
              <span style={{"position":"absolute","marginTop":"15px",  
                          "fontSize":"1em",
                          "width": "50px",
                          "border": "0px solid black",
                          "textAlign":"center",
                          "backgroundColor": totalBoxColor,
                          color:textColor,              
              }}>
              {Math.round(total/1000)}K
              </span>
          </a>
        <Popover
          placement='bottom'
          
          container={this}
          target={this.myRef.target}
          show={this.state.open}
          onHide={this.handleClose.bind(this)} 
          hideWithOutsideClick={true}
          style={{
            "position":"absolute",
            "transform": "translate(-25%, 0%)",
            "height":'60px',
            "width":margin+"px"}}
          >
          <div className={classes.MultiChips}
          style={{"width":margin + "px",
          "marginTop": "-12px",
          "marginLeft": "-12px",
          background: bgColor,
          color:textColor,
        }}
                
          > { chipHtml  }</div>
        </Popover>

        </div>
      );
    }
  }  
}




