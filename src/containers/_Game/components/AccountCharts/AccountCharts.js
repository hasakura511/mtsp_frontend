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

class AccountCharts extends Component {
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
    return (
      <div className={classes.AccountCharts}>
        <div className={classes.Row}>
          <div className={classes.Tabs}>
            <div
              style={{minWidth:'180px'}}
              className={
                classes.Tab + " " + (isPerformance ? classes.active : "")
              }
              onClick={() => this.setState({isPerformance:true, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false, isLockdownTimetable:false}) }
            >
              Performance
            </div>
            <div
              className={classes.Tab + " " + (isOpenPositions ? classes.active : "")}
              style={{minWidth:'180px'}}
              onClick={() => this.setState({isPerformance:false, isOpenPositions:true, isTradingCosts:false, isPreviousPnL:false, isLockdownTimetable:false})
            }
            >
              Open Positions
            </div>
            <div
              className={classes.Tab + " " + (isTradingCosts ? classes.active : "")}
              style={{minWidth:'180px'}}
              onClick={() => this.setState({isPerformance:false, isOpenPositions:false, isTradingCosts:true, isPreviousPnL:false, isLockdownTimetable:false})
            }
            >
              Trading Costs
            </div>
            <div
              className={classes.Tab + " " + (isPreviousPnL ? classes.active : "")}
              style={{minWidth:'180px'}}
              onClick={() => this.setState({isPerformance:false, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:true, isLockdownTimetable:false})
            }
            >
              Previous PnL
            </div>
            <div
              className={classes.Tab + " " + (isLockdownTimetable ? classes.active : "")}
              style={{minWidth:'180px'}}
              onClick={() => this.setState({isPerformance:false, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false, isLockdownTimetable:true})
            }
            >
              Lockdown Timetable
            </div>
          </div>
          
        </div>
        <div className={classes.Contents}>
          {isPerformance ? (
            <div className={classes.Content}>
              <PerformanceChart performance={performance} />
            </div>
          ) : (
           null
          )}
        
        {isOpenPositions ? (
            <div className={classes.Content}>
              <OpenPositions />
            </div>
          ) : (
           null
          )}

         {isTradingCosts ? (
            <div className={classes.Content}>
              <TradingCosts />
            </div>
          ) : (
           null
          )}

         {isPreviousPnL ? (
            <div className={classes.Content}>
              <PreviousPnL chip={this.props.chip}/>
            </div>
          ) : (
           null
          )}

          {isLockdownTimetable ? (
            <div className={classes.Content}>
              <LockdownTimetable />
            </div>
          ) : (
           null
          )}

        </div>
      </div>
    );
  }
}

AccountCharts.propTypes = {
  performance: PropTypes.object,

  rankingLoading: PropTypes.bool.isRequired,
  rankingData: PropTypes.array,
  rankingError: PropTypes.object,
  chip: PropTypes.object.isRequired,
  slot: PropTypes.object,
  close: PropTypes.func.isRequired
};

export default AccountCharts;
