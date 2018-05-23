import React, { Component } from "react";
import ChipsConfig from "../../ChipsConfig";
import classes from "./LiveDashboard.css";
import chipIcon from "../../../../assets/images/chip-icon.png";
import lossIcon from "../../../../assets/images/loss-icon.png";
import gainIcon from "../../../../assets/images/gain-icon.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toSystem, toAntiSystem } from "../../Config";
import * as actions from "../../../../store/actions";
import { toSlashDate, toSlashTime } from "../../../../util";
import ClockLoader from "../../../../components/UI/ClockLoader/ClockLoader";


const stateToProps = state => {
  return {
    currentBets: state.betting.currentBets,
    pastBets: state.betting.pastBets,
    accounts: state.betting.accounts,
    simulatedDate: state.betting.simulatedDate,
    initializeData:state.betting.initializeData,
    loading:state.betting.loading,
  };
};

const dispatchToProps = dispatch => {
  return {
    nextDay: () => {
      dispatch(actions.nextDay());
    },
    toggleMode: () => {
      dispatch(actions.toggleMode());
    },
    reset: () => {
      dispatch(actions.reset());
    }
  };
};

// @protectedComponent
@connect(stateToProps, dispatchToProps)


export default class LiveDashboard extends Component {
   static propTypes = {
    currentBets: PropTypes.object.isRequired,
    pastBets: PropTypes.object.isRequired,
    accounts: PropTypes.object.isRequired,
    simulatedDate: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    initializeData:PropTypes.object.isRequired,
  };
    
  constructor(props) {
    super(props);
    //this.state = {initializeData:this.props.initializeData}
    
  }
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(newProps) {
    //console.log("component will receive props")
    //console.log(newProps);
  }
  render() {
    //const initializeData=this.props.initializeData;
    const { currentBets, pastBets, accounts, simulatedDate, loading, initializeData } = this.props;
    //console.log(this.state);
    //console.log(this.props);
    var netPnl = 0;
    var netStartAmount = 0;
    var netFinalAmount =  0; 
    Object.keys(accounts).map(function(key) { 
      netPnl += accounts[key].last_pnl;
      netStartAmount+=accounts[key].starting_value;
      netFinalAmount+=accounts[key].account_value;
    });

    var netChangePercent = netPnl / netStartAmount * 100;
    var netCumChangePercent = (netFinalAmount - netStartAmount) / netStartAmount * 100;

    return (
    <div style={{ backgroundColor: "#e0f1f5", position: "relative" }}>
      <ClockLoader show={loading} />
      <table className={classes.Table}>
        <thead>
          <tr>
            <th>Starting Values</th>
            <th>Current Bet</th>
            <th>Previous Bet</th>
            <th>Previous Bet Gains & Losses</th>
            <th>Account Values</th>
            <th className="isLive">Lockdown</th>
            <th><span style={{"float": "left", "width": "80%", "textAlign": "left"}}>
                  Last Update
                </span>
                <span style={{"float": "left", "width": "20%", "textAlign": "right"}}>
                  <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(accounts).map(function(key) { 
            const account=accounts[key];
            const accountId=account.account_id;
            const accountValue=account.account_value;
            const locktime=account.locktime;
            const lcBet = account.last_selection;
            const betDate=locktime.substring(5,10).replace('-','/')
            const lpBet = account.prev_selection;
            const lpBetDate=account.date.substring(5).replace('-','/')
            
            const cummPercentChange =account.pnl_cumpct;
            const display=account.starting_chip_text;

            //eslint-disable-next-line
            // if (lpBet) console.log(account.accountValue - lpBet.change);

            //eslint-disable-next-line
            // console.log(account.accountValue);

            return (
              <tr key={`dashboard-row-${accountId}`}>
                <td>
                  <div className={classes.Cell + " " + classes.Flex}>
                    <img src="/images/account_chart_button.png" width="25" />
                    <strong>{display}</strong>
                  </div>
                </td>
                <td>
                  <div className={classes.Cell}>
                    {lcBet ? (
                      <p>
                        <span>{`${lcBet
                        }`}</span>
                        <span>{`MOC (${betDate})`}</span>
                      </p>
                    ) : null}
                     
                  </div>
                </td>
                <td>
                  <div className={classes.Cell}>
                    {lpBet ? (
                      <p>
                        <span>{`${lpBet
                        }`}</span>
                        <span>{`MOC (${lpBetDate})`}</span>
                      </p>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                    

                    {account.last_pnl !== null ? (
                      <p style={{ width: "auto" }}>
                        {account.pnl_pct ? (
                          <img
                            src={
                              account.pnl_pct > 0
                                ? gainIcon
                                : account.pnl_pct < 0 ? lossIcon : ""
                            }
                          />
                        ) : null}
                        ${Math.abs(Math.round(account.last_pnl)).toLocaleString(
                          "en"
                        )}{" "}
                        (
                        <span
                          style={{
                            color:
                            account.pnl_pct > 0
                                ? "green"
                                : account.pnl_pct < 0 ? "red" : "black"
                          }}
                        >
                          {(
                            account.pnl_pct
                          ).toFixed(2)}%
                        </span>
                        )
                      </p>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                    {`$${account.account_value.toLocaleString("en")}`}&nbsp;
                    ( <span
                      style={{
                        color:
                          cummPercentChange > 0
                            ? "green"
                            : cummPercentChange < 0 ? "red" : "black"
                      }}
                    >
                       {cummPercentChange.toFixed(2)}% 
                    </span> )
                  </div>
                </td>
                <td  className="isLive">
                <div
                  className={classes.Cell}
                  style={{ justifyContent: "center" }}
                >
                  {locktime}
                </div>
                </td>
                <td>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                  {account.update_date}
                  </div>
                </td>
              </tr>
            );
          })}
          <tr className={classes.LastRow}>
            <th>
              <div className={classes.Cell}>
                Total: ${netStartAmount.toLocaleString("en")}
              </div>
            </th>
            <td />
            <td />
            <td>
              <div
                className={classes.Cell}
                style={{ justifyContent: "center" }}
              >
                <p style={{ width: "auto" }}>
                  {netPnl ? (
                    <img src={netPnl > 0 ? gainIcon : lossIcon} />
                  ) : null}
                  ${Math.abs(Math.round(netPnl)).toLocaleString("en")} (
                  <span
                    style={{
                      color: netPnl > 0 ? "green" : netPnl < 0 ? "red" : "black"
                    }}
                  >
                    {netChangePercent.toFixed(2)}%
                  </span>
                  )
                </p>
              </div>
            </td>
            
            <td>
              <div className={classes.Cell}>
                {`$${netFinalAmount.toLocaleString("en")}`}&nbsp;
                ( <span
                  style={{
                    color:
                      netCumChangePercent > 0
                        ? "green"
                        : netCumChangePercent < 0 ? "red" : "black"
                  }}
                >
                   {netCumChangePercent.toFixed(2)}% 
                </span> )
              </div>
            </td>
            <td  className="isLive">
                <div
                  className={classes.Cell}
                  style={{ justifyContent: "center" }}
                >
                </div>
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
  }
}

