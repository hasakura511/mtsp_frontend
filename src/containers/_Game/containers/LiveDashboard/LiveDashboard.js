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
    dashboard_totals:state.betting.dashboard_totals,
    themes:state.betting.themes,
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
    },
    addTimedToaster: toaster => {
      dispatch(actions.addTimedToaster(toaster, 5000))
    },
    
  };
};

// @protectedComponent
@connect(stateToProps, dispatchToProps)


export default class LiveDashboard extends Component {
   static propTypes = {
    currentBets: PropTypes.object.isRequired,
    pastBets: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    dashboard_totals:PropTypes.object.isRequired,
    simulatedDate: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    initializeData:PropTypes.object.isRequired,
    addTimedToaster:PropTypes.func.isRequired,
    themes:PropTypes.object
  };
    
  constructor(props) {
    super(props);
    //this.state = {initializeData:this.props.initializeData}
    
  }
  notice = msg => {
    this.props.addTimedToaster(
      {
        id: "dashboard_notice_" + Math.random().toFixed(3),
        text: msg
      },
      5000
    );

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
    const { currentBets, pastBets, accounts, simulatedDate, loading, initializeData, dashboard_totals, themes } = this.props;
    //console.log(this.state);
    //console.log(this.props);
    var netPnl = 0;
    var netStartAmount = 0;
    var netFinalAmount =  0; 
    accounts.map(function(account) { 
      netPnl +=account.last_pnl;
      netStartAmount+=account.starting_value;
      netFinalAmount+=account.account_value;
    });

    var netChangePercent = netPnl / netStartAmount * 100;
    var netCumChangePercent = (netFinalAmount - netStartAmount) / netStartAmount * 100;

    var bgColor="black";
    var bgText="white";
    var bdColor="green";
    if (this.props.themes.live.dashboard != undefined) {
      bgColor=this.props.themes.live.dashboard.background;
      bgText=this.props.themes.live.dashboard.text;
      bdColor=this.props.themes.live.dashboard.lines;
    }
    return (
    <div style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor,position: "relative" }}>
      <ClockLoader show={loading} />
      <table className={classes.Table} style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
        <thead  style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
          <tr style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
            <th style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>Accounts</th>
            <th style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>Next Bet</th>
            <th style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>Current Bet</th>
            <th style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>Current PnL</th>
            <th style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}} className="isLive">Lockdown</th>
            <th style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}><span style={{"float": "left", "width": "80%", "textAlign": "left"}}>
                  Last Update
                </span>
                <span style={{"float": "left", "width": "20%", "textAlign": "right"}}>
                  <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                </span>
            </th>
          </tr>
        </thead>
        <tbody  style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
          {accounts.map(function(account) { 
            console.log(account);
            if (account.locktime) { 

              const accountId=account.account_id;
              const accountValue=account.account_value;
              var locktime=account.locktime;
              var lcBet = account.last_selection;
              if (lcBet.toLowerCase() == 'off') {
                lcBet="Off";
              }
              const betDate=locktime.substring(5,10).replace('-','/')
              const lpBet = account.prev_selection;
              const lpBetDate=account.date.substring(5).replace('-','/')
              
              const cummPercentChange =account.pnl_cumpct;
              const display=account.account_chip_text;
              locktime=locktime.substring(5).replace('-','/');
              //eslint-disable-next-line
              // if (lpBet) console.log(account.accountValue - lpBet.change);

              //eslint-disable-next-line
              // console.log(account.accountValue);

              return (
                <tr key={`dashboard-row-${accountId}`} style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
                  <td style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
                    <div className={classes.Cell + " " + classes.Flex}>
                      $&nbsp;<img src="/images/account_chart_button.png" width="25" />
                      <strong>{display}</strong>
                      &nbsp;  
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
                  <td style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
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
                  <td style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
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
                  <td style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
                    <div
                      className={classes.Cell}
                      style={{ justifyContent: "center" }}
                    >
                      

                      {account.current_pnl !== null ? (
                        <p style={{ width: "auto" }}>
                          {account.current_pct ? (
                            <img
                              src={
                                account.current_pct > 0
                                  ? gainIcon
                                  : account.pnl_pct < 0 ? lossIcon : ""
                              }
                            />
                          ) : null}
                          ${Math.abs(Math.round(account.current_pnl)).toLocaleString(
                            "en"
                          )}{" "}
                          (
                          <span
                            style={{
                              color:
                              account.current_pct > 0
                                  ? "green"
                                  : account.current_pct < 0 ? "red" : "black"
                            }}
                          >
                            {(
                              account.current_pct
                            ).toFixed(2)}%
                          </span>
                          )
                        </p>
                      ) : null}
                    </div>
                  </td>
                 
                  <td  className="isLive" style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                    {locktime}
                  </div>
                  </td>
                  <td style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
                    <div
                      className={classes.Cell}
                      style={{ justifyContent: "center" }}
                    >
                    {account.update_date}
                    </div>
                  </td>
                </tr>
              );
            }
          })}
          <tr style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}} className={classes.LastRow}>
            <th style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
              <div className={classes.Cell}>
                <b>Total</b>: ${dashboard_totals.accounts_total.toLocaleString("en")}
                &nbsp;
                ( <span
                  style={{
                    color:
                      dashboard_totals.accounts_pct > 0
                        ? "green"
                        : dashboard_totals.accounts_pct < 0 ? "red" : "black"
                  }}
                >
                   {dashboard_totals.accounts_pct.toFixed(2)}% 
                </span> )
              </div>
            </th> 
            <td style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}/>
            <td style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}/>
            <td style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
              <div
                className={classes.Cell}
                style={{ justifyContent: "center" }}
              >
                <p style={{ width: "auto" }}>
                  {dashboard_totals.currpnl_total ? (
                    <img src={dashboard_totals.currpnl_total > 0 ? gainIcon : lossIcon} />
                  ) : null}
                  ${Math.abs(Math.round(dashboard_totals.currpnl_total)).toLocaleString("en")} (
                  <span
                    style={{
                      color: dashboard_totals.currpnl_total > 0 ? "green" : dashboard_totals.currpnl_total < 0 ? "red" : "black"
                    }}
                  >
                    {dashboard_totals.currpnl_pct.toFixed(2)}%
                  </span>
                  )
                </p>
              </div>
            </td>
            
            <td style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}} className="isLive">
                <div
                  className={classes.Cell}
                  style={{ justifyContent: "center" }}
                >
                </div>
            </td>
            <td style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}} />
          </tr>
        </tbody>
      </table>
    </div>
  );
  }
}

