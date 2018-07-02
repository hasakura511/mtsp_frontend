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
    editData:PropTypes.object.isRequired,
    checkLock:PropTypes.func.isRequired,
    itemSelected:PropTypes.string.isRequired,
    optimizeBoard:PropTypes.func.isRequired,
    strats:PropTypes.array.isRequired
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
    var self=this;
    const {strats} = this.props;
    var bgColor="#FFF2CC";
    var textColor="#000000";
    var totalBoxColor="#FFFFFF";
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
      heatmapTxt=this.props.editData.themes.page.heatmap_text
      switchBg=this.props.themes.live.action_row.switch_fill;
      switchTxt=this.props.themes.live.action_row.switch_text;

    }
    var strat_dict=this.props.editData.strat_dict;
    var editThemes=this.props.editData.themes;
    var optimized_board=this.props.editData.optimized_board;
    var editData=this.props.editData; 
      return (
        <div className={classes.StrategyToolbox}
           
                   >
          <div style={{
            width:"40%",
            float:'left',
            marginBottom:'0px',paddingBottom:'0px', 
          }}>
           <span style={{fontSize: 14}}>
            <img src={'/images/chip_selector.png'} height={20} /> Chip Selector
           </span>
           <br/>
           <div style={{ border: "1px solid black", padding:"5px", margin:"5px",height:'300px',
           marginBottom:'0px',paddingBottom:'0px',  
           background:editThemes.page.chip_selector}}>
                <div style={{textAlign:"left"}}>
                {editThemes.page.chip_selector_desc}
           
                </div>
                <div style={{width:"120px", float:"left"}}>
                    <ChipSelector checkLock={this.props.checkLock} editData={editData} itemSelected={this.props.itemSelected} />
                </div>
                <br/>
                <div style={{"clear": "both"}}></div>
                <div style={{textAlign:"left"}}>
                Select one account here to optimize Board
                </div>

                {this.props.itemSelected && this.props.itemSelected != 'None' && editData.optimized_board.toString().length > 2 ? 
                <div  style={{
                  cursor:'pointer',
                  float:'left'
                }}
                onClick={()=>{

                  self.props.optimizeBoard();
                }}
                  >
                  <div style={{width:"200px", marginTop: "10px", float:"left"}}>
                      <img src={'/images/optimize_enabled.png'} height={60} 
                      />
                     
                    </div>
                     <div style={{ marginLeft: '-115px', marginTop: '40px', fontSize: "18px", color:"#ffffff", float:"left"}}>Optimize Board</div>
                </div>
                :
                <div style={{float:'left'}}>
                  <div style={{width:"200px", marginTop: "10px", float:"left"}}>
                    <img src={'/images/optimize_disabled.png'} height={60}
                  
                    />
                  </div>
                   <div style={{ marginLeft: '-115px', marginTop: '40px', fontSize: "18px", color:"#ffffff", float:"left"}}>Optimize Board</div>
                  </div>
                }
                <div style={{"clear": "both"}}></div>
                {this.props.itemSelected && this.props.itemSelected != 'None' && editData.optimized_board.toString().length > 2 ? 
                <div  style={{
                  cursor:'pointer',
                  float:'left'
                }}
                onClick={()=>{

                  self.props.optimizeBoard();
                }}
                  >
                  <div style={{width:"200px", marginTop: "10px", float:"left"}}>
                  <img src={"/images/current_board.png"} height={60}/>
                    </div>
                     <div style={{ marginLeft: '-115px', marginTop: '40px', fontSize: "18px", color:"#ffffff", float:"left"}}>Current Board</div>
                </div>
                :
                <div style={{float:'left'}}>
                  <div style={{width:"200px", marginTop: "10px", float:"left"}}>
                  <img src={"/images/current_board.png"} height={60}/>
                  </div>
                   <div style={{ marginLeft: '-115px', marginTop: '40px', fontSize: "18px", color:"#ffffff", float:"left"}}>Current Board</div>
                  </div>
                }
                <div style={{"clear": "both"}}></div>
                
           </div>
           <br/>
        </div>
        <div style={{
        width:"60%",
        float:'left',
        marginBottom:'0px',paddingBottom:'0px', 
      }}>
           <span style={{fontSize: 14}}>
            <img src={'/images/strategy_selector.png'} height={20} />  Strategy Selector
           </span>
          
           <br/>
           <div style={{ border: "1px solid black", padding:"5px",  margin:"5px", 
           marginBottom:'0px',paddingBottom:'0px', 
           height:'300px',background:editThemes.page.strategy_selector}}>
           
           <div style={{textAlign:"left"}}>
           {editThemes.page.strategy_selector_desc}
           <br/>
           
                </div>
                                {Object.keys(strat_dict).map(key => {
                                    var items=strat_dict[key];
                                    //console.log(items);
                                    var idx=0;
                                    return (
                                        <div key={key} style={{ float:'left', zIndex: 0 }}>
                                          <center>{key}</center>
                                          {Object.keys(items).map(key2 => {
                                            var itemList=items[key2];
                                            if (itemList) {
                                              //console.log(itemList);
                                              idx+=1;
                                              return (
                                                    <div key={idx} style={{ width:'100%',zIndex: 10, }}>
                                                    <center>
                                                      <StrategySelector editData={editData} items={itemList} strats={strats}/>
                                                    </center>
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
          <div style={{"clear": "both"}}></div>

        </div>
      );
  }  
}




