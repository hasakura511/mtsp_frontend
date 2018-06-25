import React, { Component } from 'react';
import PropTypes from "prop-types";
import Chip from "../../../../components/_Chip/_Chip";
import classes from "./ChipSelector.css";
import Popover from 'react-tiny-popover'
import StrategyButton from '../StrategyButton/StrategyButton'
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

export default class ChipSelector extends Component {
  static propTypes = {
    chips: PropTypes.array.isRequired,
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
        <div className={classes.ChipSelector}
           
                   >
           Chip Selector - Place one account chip here to heatmap the strategies and sort by performance for that specific chip.
           <br/>
           <br/>
           Strategy Selector - Drag your desired strategy to the tabs on the board below.
           <br/>
           <div className="isLive">
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
                    <br/>
                    {Object.keys(strat_dict).map(key => {
                        var items=strat_dict[key];
                        var output=[];
                        output.push(
                            <div key={key}>
                            {key}<br/>
                            {Object.keys(items).map(button_key => {
                                var buttons=items[button_key]
                                return buttons.map(button => {
                                return <span key={button.strategy}>
                                    <StrategyButton strategy={button} />
                                </span>
                                })
                            })}
                            </div>
                        )
                        return output;
                        
                    })}
                    Fixed
                    <br/>
                    Machine Learning
                    <br/>
                    Technical
                    <br/>
           
        </div>
      );
  }  
}




