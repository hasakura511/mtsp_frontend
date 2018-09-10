import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./AccountCharts.css";
import LockdownTimetable from "./LockdownTimetable/LockdownTimetable";
import PerformanceChart from "./PerformanceChart/PerformanceChart";
import RankingChart from "./RankingChart/RankingChart";
import PerformanceOrderChart from "./PerformanceOrderChart/PerformanceOrderChart";
import OpenPositions from "./OpenPositions/OpenPositions";
import PreviousPnL from "./PreviousPnL/PreviousPnL";
import TradingCosts from "./TradingCosts/TradingCosts";
import SignalHistory from "./SignalHistory/SignalHistory";
import BetHistory from "./BetHistory/BetHistory";
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
    isPractice:PropTypes.bool,
    isPerformance:PropTypes.bool,
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
    isOrder:PropTypes.bool.isRequired,
    moveChipToSlot:PropTypes.func,
    moveStratToSlot:PropTypes.func,
    stratParams:PropTypes.object,
    isAnti:PropTypes.bool,
    isEdit:PropTypes.bool,
    isPortfolio:PropTypes.bool,
    isLeaderboard:PropTypes.bool
  };
  constructor(props) {
    super(props);

    this.state = {
      isPerformance: props.isPortfolio ? false : true,
      isOpenPositions:false,
      isTradingCosts:false,
      isPreviousPnL:false,
      isLockdownTimetable: props.isPortfolio ? true : false,
      isRankingChart:false,
      isSignalHistory: false,
      isBetHistory:false
    };
  }
  
  componentWillUnmount() {
    this.props.showPerformance('');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.slot) {
      if (this.state.isRankingChart && newProps.slot.position != this.props.slot.position) {
        this.setState({isPerformance:true, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false,  isRankingChart:false});
      }
    }
  }
  render() {
    const { isPerformance, isOpenPositions, isTradingCosts, isPreviousPnL, isLockdownTimetable, isRankingChart, isSignalHistory, isBetHistory } = this.state;
    const {
      performance,
      rankingLoading,
      rankingData,
      rankingError,
      chip,
      slot
    } = this.props;
    //alert(this.props.isAnti)
    var self=this;

    return (
      <div className={classes.AccountCharts} style={{background:self.props.themes.live.dialog.background,
        color:self.props.themes.live.dialog.text, borderColor:self.props.themes.live.dialog.lines}}>
                

        <div className={classes.Row} style={{background:self.props.themes.live.dialog.background,
        color:self.props.themes.live.dialog.text, borderColor:self.props.themes.live.dialog.lines}}>

         
            {self.props.isOrder ? (
                 <div className={classes.Tabs} style={{ background:self.props.themes.live.dialog.background,
                  color:self.props.themes.live.dialog.text }}>
                      

                      <div
                      style={ isPerformance ? {borderColor:self.props.themes.live.dialog.lines, borderTop:"1px solid " + self.props.themes.live.dialog.lines, borderLeft:"1px solid " + self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'}
                      : {borderTop:"1px solid " + self.props.themes.live.dialog.lines, borderLeft:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} } 
                      className={
                        classes.Tab
                      }
        
                      onClick={() => this.setState({isPerformance:true, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false,  isRankingChart:false, isSignalHistory:false }) }
                    >
                      Performance
                    </div>
                    <div
                      style={ isRankingChart ? {borderColor:self.props.themes.live.dialog.lines, borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderLeft:"1px solid " + self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'} 
                      : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderLeft:"1px solid " + self.props.themes.live.dialog.lines, borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} }
                      className={
                        classes.Tab
                      }
                      onClick={() => this.setState({isPerformance:false, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false, isRankingChart:true, isSignalHistory:false })
                    }
                    >
                      Ranking Chart
                    </div>
                    <div
                      style={ isSignalHistory ? {borderColor:self.props.themes.live.dialog.lines, borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderLeft:"1px solid " + self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'} 
                      : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderLeft:"1px solid " + self.props.themes.live.dialog.lines, borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} }
                      className={
                        classes.Tab
                      }
                      onClick={() => this.setState({ isPerformance:false, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false, isRankingChart:false, isSignalHistory:true })
                    }
                    >
                      Signal History
                    </div>
                    <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>            
                    </div>
              </div>

            ) : (
              <div className={classes.Tabs} style={{ background:self.props.themes.live.dialog.background,
        color:self.props.themes.live.dialog.text }}>
                <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>
                
                </div>

                <div
                  style={ isPerformance ? {borderColor:self.props.themes.live.dialog.lines, borderTop:"1px solid " + self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'}
                  : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} } 
                  className={
                    classes.Tab
                  }

                  onClick={() => this.setState({isPerformance:true, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false, isLockdownTimetable:false, isBetHistory:false}) }
                >
                  Performance
                </div>
                <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>
                
                </div>

              {(!chip.isReadOnly || this.props.isPerformance) && !this.props.isLeaderboard ? 
                <div
                  style={ isOpenPositions ? {borderColor:self.props.themes.live.dialog.lines, borderTop:"1px solid " + self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'} 
                  : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} }
                  className={
                    classes.Tab
                  }
                  onClick={() => this.setState({isPerformance:false, isOpenPositions:true, isTradingCosts:false, isPreviousPnL:false, isLockdownTimetable:false, isBetHistory:false})
                }
                >
                  Current PnL
                </div>
              : null}
              {(!chip.isReadOnly  || this.props.isPerformance) && !this.props.isLeaderboard? 

                <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>
                
                </div>
              :null}
              {(!chip.isReadOnly || this.props.isPerformance) && !this.props.isLeaderboard ? 

                <div
                  style={ isPreviousPnL ? {borderColor:self.props.themes.live.dialog.lines, borderTop:"1px solid " + self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'} 
                  : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} }
                  className={
                    classes.Tab
                  }
                  onClick={() => this.setState({isPerformance:false, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:true, isLockdownTimetable:false, isBetHistory:false})
                }
                >
                  Previous PnL
                </div>
              :null}
              {(!chip.isReadOnly  || this.props.isPerformance) && !this.props.isLeaderboard ? 
                <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>
                
                </div>
              :null}
              {(!chip.isReadOnly  || this.props.isPerformance) && !this.props.isLeaderboard ? 
                <div
                  style={ isTradingCosts ? {borderColor:self.props.themes.live.dialog.lines, borderTop:"1px solid " + self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'} 
                  : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} }
                  className={
                    classes.Tab
                  }
                  onClick={() => this.setState({isPerformance:false, isOpenPositions:false, isTradingCosts:true, isPreviousPnL:false, isLockdownTimetable:false, isBetHistory:false})
                }
                >
                  Trading Costs
                </div>
              :null}
                <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>
                
                </div>
                <div
                  style={ isLockdownTimetable ? {borderColor:self.props.themes.live.dialog.lines, borderTop:"1px solid " + self.props.themes.live.dialog.lines,  background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'} 
                  : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} }
                  className={
                    classes.Tab
                  }
                  onClick={() => this.setState({isPerformance:false, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false, isLockdownTimetable:true, isBetHistory:false})
                }
                >
                  Portfolio
                </div>
                <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>            
                </div>
                <div
                  style={ isBetHistory ? {borderColor:self.props.themes.live.dialog.lines, borderTop:"1px solid " + self.props.themes.live.dialog.lines,  background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'} 
                  : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,  borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} }
                  className={
                    classes.Tab
                  }
                  onClick={() => this.setState({isPerformance:false, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false, isLockdownTimetable:false, isBetHistory:true})
                }
                >
                  Bet History
                </div>
                <div style={{width:"1px", margin:"0px", paddingLeft:"1px", paddingRight:"0px", paddingTop:"20px", paddingBottom:"20px",color: self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.lines}}>            
                </div>
            </div>
            )}
           
          
        </div>
        
        {self.props.isOrder ? (
            <div className={classes.Contents}  style={{background:self.props.themes.live.dialog.background,
              color:self.props.themes.live.dialog.text, borderColor:self.props.themes.live.dialog.lines}}>
              {isPerformance ? (
                <div className={classes.Content}>
                  <PerformanceOrderChart  isPractice={this.props.isPractice} chip={this.props.chip} slot={this.props.slot} isAnti={this.props.isAnti} toggle={this.props.toggle} />
              </div>
              ) : (
              null
              )}
              
              {isRankingChart ? (
                <div className={classes.Content}>
                  <RankingChart  
                  isPractice={this.props.isPractice} 
                  stratParams={this.props.stratParams}
                  moveStratToSlot={this.props.moveStratToSlot} 
                  moveChipToSlot={this.props.moveChipToSlot} 
                  chip={this.props.chip} 
                  slot={this.props.slot} 
                  toggle={this.props.toggle}  
                  isAnti={this.props.isAnti} 
                  isEdit={this.props.isEdit} />
                </div>
              ) : (
              null
              )}

              {isSignalHistory ? (
                <div className={classes.Content}>
                  <SignalHistory moveChipToSlot={this.props.moveChipToSlot} chip={this.props.chip} slot={this.props.slot} toggle={this.props.toggle} />
                </div>
              ) : (
              null
              )}
          </div>
        ) : (
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
                  <LockdownTimetable   gap={-227} chip={this.props.chip} toggle={this.props.toggle}/>
                </div>
              ) : (
              null
              )}

              {isBetHistory ? (
                <div className={classes.Content}>
                  <BetHistory chip={this.props.chip} toggle={this.props.toggle}/>
                </div>
              ) : (
              null
              )}
          </div>

        )
        }
        
       

      </div>
    );
  }
}


