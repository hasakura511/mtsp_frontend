import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./AccountCharts.css";
import LockdownTimetable from "./LockdownTimetable/LockdownTimetable";
import PerformanceChart from "./PerformanceChart/PerformanceChart";
import OpenPositions from "./OpenPositions/OpenPositions";
import PreviousPnL from "./PreviousPnL/PreviousPnL";
import TradingCosts from "./TradingCosts/TradingCosts";
import Spinner from "../../../../components/UI/Spinner/Spinner";
//import RankingChart from "./RankingChart/RankingChart";
import * as actions from "../../../../store/actions";
import { connect } from "react-redux";
const stateToProps = state => ({
  themes:state.betting.themes,
  //performance_account_id: state.betting.performance_account_id
});


const dispatchToProps = dispatch => {
  return {
    showPerformance:(action_id) => {
      dispatch(actions.showPerformance(action_id))
    },
    
  };
};

const loader = (
  <div
    style={{
      width: "100%",
      height: "100%",
      backgroundColor: "white"
    }}
  >
    <Spinner />
  </div>
);


@connect(stateToProps, dispatchToProps)
export default class AccountCharts extends Component {
  static propTypes = {
    performance: PropTypes.object,
  
    rankingLoading: PropTypes.bool.isRequired,
    rankingData: PropTypes.array,
    rankingError: PropTypes.object,
    chip: PropTypes.object.isRequired,
    slot: PropTypes.object,
    close: PropTypes.func.isRequired,
    toggle:PropTypes.func,
    showPerformance:PropTypes.func.isRequired,
    themes:PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      isPerformance: true,
      isOpenPositions:false,
      isTradingCosts:false,
      isPreviousPnL:false,
      isLockdownTimetable:false
    };
  }
  componentWillUnmount() {
    this.props.showPerformance('');
  }

  render() {
    const { isPerformance, isOpenPositions, isTradingCosts, isPreviousPnL, isLockdownTimetable } = this.state;
    const {
      performance,
      rankingLoading,
      rankingData,
      rankingError,
      chip,
      slot
    } = this.props;
    var self=this;
    return (
      <div className={classes.AccountCharts} style={{background:self.props.themes.live.dialog.background,
        color:self.props.themes.live.dialog.text, borderColor:self.props.themes.live.dialog.lines}}>
                

        <div className={classes.Row} style={{background:self.props.themes.live.dialog.background,
        color:self.props.themes.live.dialog.text, borderColor:self.props.themes.live.dialog.lines}}>

          <div className={classes.Tabs} style={{ background:self.props.themes.live.dialog.background,
        color:self.props.themes.live.dialog.text }}>
            <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>
            
            </div>
            <div
              style={ isPerformance ? {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'}
               : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} } 
              className={
                classes.Tab
              }

              onClick={() => this.setState({isPerformance:true, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false, isLockdownTimetable:false}) }
            >
              Performance
            </div>
            <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>
            
            </div>

            <div
              style={ isOpenPositions ? {borderTop:"1px solid " + self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'} 
              : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} }
              className={
                classes.Tab
              }
              onClick={() => this.setState({isPerformance:false, isOpenPositions:true, isTradingCosts:false, isPreviousPnL:false, isLockdownTimetable:false})
            }
            >
              Current PnL
            </div>
            <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>
            
            </div>
            <div
              style={ isPreviousPnL ? {borderTop:"1px solid " + self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'} 
              : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} }
              className={
                classes.Tab
              }
              onClick={() => this.setState({isPerformance:false, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:true, isLockdownTimetable:false})
            }
            >
              Previous PnL
            </div>
            <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>
            
            </div>
            <div
              style={ isTradingCosts ? {borderTop:"1px solid " + self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'} 
              : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} }
              className={
                classes.Tab
              }
              onClick={() => this.setState({isPerformance:false, isOpenPositions:false, isTradingCosts:true, isPreviousPnL:false, isLockdownTimetable:false})
            }
            >
              Trading Costs
            </div>
            <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>
            
            </div>
            <div
              style={ isLockdownTimetable ? {borderTop:"1px solid " + self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'} 
              : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} }
              className={
                classes.Tab
              }
              onClick={() => this.setState({isPerformance:false, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false, isLockdownTimetable:true})
            }
            >
              Lockdown Timetable
            </div>
            <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>
            
            </div>
          </div>
          
        </div>
        <div className={classes.Contents}>
          {isPerformance ? (
            <div className={classes.Content}>
              <PerformanceChart  chip={this.props.chip} toggle={this.props.toggle} />
            </div>
          ) : (
           null
          )}
        
        {isOpenPositions ? (
            <div className={classes.Content}>
              <OpenPositions  chip={this.props.chip} toggle={this.props.toggle} />
            </div>
          ) : (
           null
          )}

         {isTradingCosts ? (
            <div className={classes.Content}>
              <TradingCosts chip={this.props.chip} toggle={this.props.toggle} />
            </div>
          ) : (
           null
          )}

         {isPreviousPnL ? (
            <div className={classes.Content}>
              <PreviousPnL chip={this.props.chip} toggle={this.props.toggle}/>
            </div>
          ) : (
           null
          )}

          {isLockdownTimetable ? (
            <div className={classes.Content}>
              <LockdownTimetable  chip={this.props.chip} toggle={this.props.toggle}/>
            </div>
          ) : (
           null
          )}

        </div>
      </div>
    );
  }
}


