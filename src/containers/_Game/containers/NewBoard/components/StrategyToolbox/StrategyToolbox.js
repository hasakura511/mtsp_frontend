import React, { Component } from 'react';
import PropTypes from "prop-types";
import Chip from "../../../../components/_Chip/_Chip";
import classes from "./StrategyToolbox.css";
import Popover from 'react-tiny-popover'
import StrategyButton from '../StrategyButton/StrategyButton'
import StrategySelector from '../StrategySelector/StrategySelector'
import ChipSelector from '../ChipSelector/ChipSelector'
import { connect } from "react-redux";
import * as actions from "../../../../../../store/actions";

const stateToProps = state => {
  return {
    //simulatedDate: state.betting.simulatedDate,
    //dashboard_totals:state.betting.dashboard_totals,
    isLive:state.betting.isLive,
    heatmap_selection:state.betting.heatmap_selection,
    themes: state.betting.themes,
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

export default class StrategyToolbox extends Component {
  static propTypes = {
    chips: PropTypes.array,
    parent:PropTypes.any,
    heatmap_selection: PropTypes.string,
    isLive:PropTypes.bool,
    showOrderDialog:PropTypes.bool,
    themes:PropTypes.object.isRequired,
    editData:PropTypes.object.isRequired
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
    var themes_bg="linear-gradient(90deg," + this.props.themes.live.heatmap.heatmap_cold + ", " + this.props.themes.live.heatmap.heatmap_hot + ")";
    var board_bg="linear-gradient(180deg," + this.props.themes.live.background.top + ", " + this.props.themes.live.background.middle + ", " + this.props.themes.live.background.bottom + ")";
    //console.log(themes_bg);
    var actionBg="white";
    var heatmapTxt="black";
    var switchBg="purple";
    var switchTxt="white";
    if (this.props.themes.live.action_row != undefined) {
      actionBg=this.props.themes.live.action_row.background;
      heatmapTxt=this.props.themes.live.heatmap.text;
      switchBg=this.props.themes.live.action_row.switch_fill;
      switchTxt=this.props.themes.live.action_row.switch_text;

    }
    var strat_dict=this.props.editData.strat_dict;
    var editThemes=this.props.editData.themes;
    var optimized_board=this.props.editData.optimized_board;
    
      return (
        <div className={classes.StrategyToolbox}
           
                   >
           <span style={{fontSize: 14}}>
            <img src={'/images/chip_selector.png'} height={20} /> Chip Selector - Place one account chip here to heatmap the strategies and sort by performance for that specific chip.
           </span>
           <br/>
           <div style={{ border: "1px solid black", padding:"10px"}}>
                <div style={{width:"120px", float:"left"}}>
                    <ChipSelector  />
                </div>
                <div style={{width:"200px", marginTop: "25px", float:"left"}}>
                    <img src={'/images/optimize_disabled.png'} height={60} />
                </div>
                <div style={{ marginLeft: '-115px', marginTop: '40px', fontSize: "18px", color:"#ffffff", float:"left"}}>Optimize Board</div>
                <div style={{"clear": "both"}}></div>
           </div>
           <br/>
           <span style={{fontSize: 14}}>
            <img src={'/images/strategy_selector.png'} height={20} />  Strategy Selector - Drag your desired strategy to the tabs on the board below.
           </span>
          
           <br/>
           <div style={{ border: "1px solid black", padding:"10px"}}>
                    <div className="isLive">
                                <div style={{width:"25%", float:"right"}}>
                                        <center><b style={{color:heatmapTxt}} >{this.props.themes.live.heatmap.top_text}</b></center>
                                        <div style={{  "border": "1px solid",
                                                        "background": themes_bg,
                                                        "width":"100%",
                                                        "height":"45px",  
                                                        }}>
                                                        &nbsp;
                                                        <br/>
                                        </div>
                                        <div>
                                            <span style={{"float": "left", "width": "50%", "textAlign": "left", color:heatmapTxt}}>
                                            {this.props.themes.live.heatmap.bottom_left}
                                            </span>
                                            <span style={{"float": "left", "width": "50%", "textAlign": "right", color:heatmapTxt}}>
                                            {this.props.themes.live.heatmap.bottom_right}
                                            </span>
                                        </div>
                                </div>

                        </div>
                                <br/>
                                {Object.keys(strat_dict).map(key => {
                                    var items=strat_dict[key];
                                    //console.log(items);
                                    var idx=0;
                                    return (
                                        <div key={key} style={{ zIndex: 0 }}>
                                          {key}<br/>
                                          {Object.keys(items).map(key2 => {
                                            var itemList=items[key2];
                                            if (itemList) {
                                              console.log(itemList);
                                              idx+=1;
                                              return (
                                                    <div key={idx} style={{float:'left', zIndex: 10, }}>
                                                      <StrategySelector items={itemList} />
                                                    </div>
                                                      );
                                                    }

                                          })}


                                        <div style={{"clear": "both"}}></div>
                                        </div>
                                    )
                                    
                                })}
                    
                    <div style={{"clear": "both"}}></div>
            </div>
        </div>
      );
  }  
}




