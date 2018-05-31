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
import Moment from 'react-moment';
import moment from 'moment-timezone';


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
    themes:PropTypes.object,
    initializeLive:PropTypes.func.isRequired,
    sendNotice:PropTypes.func.isRequired,
  };
    
  constructor(props) {
    super(props);
    this.state = {refreshing:false}
    
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
    var bhColor="pink";
    if (this.props.themes.live.dashboard != undefined) {
      bgColor=this.props.themes.live.dashboard.background;
      bgText=this.props.themes.live.dashboard.text;
      bdColor=this.props.themes.live.dashboard.lines;
      bhColor=this.props.themes.live.dashboard.lines_horizontal_middle;
    }
    var tableStyle={ background: bgColor, color:bgText, borderLeft: "1px solid " + bdColor, borderRight: "1px solid " + bdColor, borderTop: "0.1px solid " + bhColor, borderBottom: "0.1px solid " + bhColor};
    var self=this;

      
    return (
    <div style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor,position: "relative" }}>
      <ClockLoader show={loading} />

      <Moment 
             style={{"display":"none"}}
             interval={1000} 
             onChange={(val) => {  
              var allunlocked=true;
              var now= new moment().tz("US/Eastern");
              var isRefreshing=false;
             
              accounts.map(function(account) { 
               //console.log(account);
               var hour=0;
               var minutes=0;
               var seconds=0;
               var diff=0;
               if (account.status == "locked")
                 allunlocked=false;
               if (account.unlock) { 
                 
                  if (now >= account.lockdown && now < account.unlock) {
                    const ts=account.unlock.countdown();
                    hour=ts.hours;
                    minutes=ts.minutes;
                    seconds=ts.seconds;
                    //console.log(account.unlock);


                    if (minutes < 10)
                     minutes="0" + minutes;
                    if (hour < 10)
                      hour="0" + hour;
                    if (seconds < 10)
                      seconds="0" + seconds;

                    diff=hour + ":" + minutes + ":" + seconds
                    if (now >= account.unlock) {
                       diff="-" + diff;

                    }
                    $('#countdown_' + account.chip_id).html("Unlock in " + diff);
                    $('#countdown_' + account.chip_id).css('color',self.props.themes.live.dashboard.text_loss);

                  } else {
                    const ts=account.lockdown.countdown();
                    hour=ts.hours;
                    minutes=ts.minutes;
                    seconds=ts.seconds;
                    if (now >= account.lockdown) {
                      if (!self.props.loading) {  
                        if (now >= account.unlock) {
                          if (!self.props.loading) {  
                            if (seconds < 10 && !self.state.refreshing) {
                              self.setState({refreshing:true});
                              if (!isRefreshing) {
                                //self.props.initializeLive();
                                isRefreshing=true;
                              }
                              
                            } else if (seconds > 50 && self.state.refreshing) {
                              self.setState({refreshing:false});
    
                            }
                            
    
                          }
                         }                        

                      }
                     }

                    if (minutes < 10)
                     minutes="0" + minutes;
                    if (hour < 10)
                      hour="0" + hour;
                    if (seconds < 10)
                      seconds="0" + seconds;

                    diff=hour + ":" + minutes + ":" + seconds
                    if (now >= account.lockdown) {
                       diff="-" + diff;

                    }
                    $('#countdown_' + account.chip_id).html("Lock in " + diff);
                    $('#countdown_' + account.chip_id).css('color',self.props.themes.live.dashboard.text_gain);

                  }
                }
              });

              if (!isRefreshing) {
                if (now.minute()==0) {
                  if (!self.props.loading) {  
                    if (now.second() < 10 && !self.state.refreshing) {
                      self.setState({refreshing:true});
                      //self.props.initializeLive();
                      isRefreshing=true;
                      
                    } else if (now.second() > 50 && self.state.refreshing) {
                      self.setState({refreshing:false});

                    }
                  }
                }
              }
          }
        } 
       ></Moment>
      <table className={classes.Table} style={tableStyle}>
        <thead  style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
          <tr style={tableStyle}>
            <th style={tableStyle}><b>Accounts</b></th>
            <th style={tableStyle}><b>Next Bet</b></th>
            <th style={tableStyle}><b>Current Bet</b></th>
            <th style={tableStyle}><b>Current PnL</b></th>
            <th style={tableStyle} className="isLive"><b>Lockdown</b></th>
            <th style={tableStyle}><span style={{"float": "left", "width": "80%", "textAlign": "left"}}>
                  <b>Last Update</b>
                </span>
                <span style={{"float": "left", "width": "20%", "textAlign": "right"}}>
                  <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                </span>
            </th>
          </tr>
        </thead>
        <tbody  style={tableStyle}>
          {accounts.map(function(account) { 
            //console.log(account);
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
                <tr key={`dashboard-row-${accountId}`} style={tableStyle}>
                  <td style={tableStyle}>
                    <div className={classes.Cell + " " + classes.Flex}>
                      &nbsp;<img src="/images/account_chart_button.png" width="25" />
                      <strong>$ {display}</strong>
                      &nbsp;  
                      ( <span
                        style={{
                          color:
                            cummPercentChange > 0
                              ? "green"
                              : cummPercentChange < 0 ? "red" : bgText
                        }}
                      >
                        {cummPercentChange.toFixed(2)}% 
                      </span> )
                    </div>
                  </td>
                  <td style={tableStyle}>
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
                  <td style={tableStyle}>
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
                  <td style={tableStyle}>
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
                                  : account.current_pct < 0 ? lossIcon : ""
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
                                  : account.current_pct < 0 ? "red" : bgText
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
                 
                  <td  className="isLive" style={tableStyle}>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                    id={'countdown_' + account.chip_id}
                  >
                    {locktime}
                  </div>
                  </td>
                  <td style={tableStyle}>
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
          <tr style={tableStyle} className={classes.LastRow}>
            <th style={tableStyle}>
              <div className={classes.Cell}>
                <b>Total: ${dashboard_totals.accounts_total.toLocaleString("en")}</b>
                &nbsp;
                ( <span
                  style={{
                    color:
                      dashboard_totals.accounts_pct > 0
                        ? "green"
                        : dashboard_totals.accounts_pct < 0 ? "red" : bgText
                  }}
                >
                <b>
                   {dashboard_totals.accounts_pct.toFixed(2)}% 
                </b>
                </span> )
              </div>
            </th> 
            <td style={tableStyle}/>
            <td style={tableStyle}/>
            <td style={tableStyle}>
              <div
                className={classes.Cell}
                style={{ justifyContent: "center" }}
              >
                <p style={{ width: "auto" }}>
                  {dashboard_totals.currpnl_total ? (
                    <img src={dashboard_totals.currpnl_total > 0 ? gainIcon : lossIcon} />
                  ) : null}
                  <b>
                  ${Math.abs(Math.round(dashboard_totals.currpnl_total)).toLocaleString("en")} (
                  </b>
                  <span
                    style={{
                      color: dashboard_totals.currpnl_total > 0 ? "green" : dashboard_totals.currpnl_total < 0 ? "red" : bgText
                    }}
                  >
                  <b>
                    {dashboard_totals.currpnl_pct.toFixed(2)}%
                  </b>
                  </span>
                  )
                </p>
              </div>
            </td>
            
            <td style={tableStyle} className="isLive">
                <div
                  className={classes.Cell}
                  style={{ justifyContent: "center" }}
                >
                </div>
            </td>
            <td style={tableStyle} />
          </tr>
        </tbody>
      </table>
    </div>
  );
  }
}

