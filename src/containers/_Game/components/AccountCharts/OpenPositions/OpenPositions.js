import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate } from "../../../../../util";
import classes from "./OpenPositions.css";
import Spinner from "../../../../../components/UI/Spinner/Spinner";
import axios from "../../../../../axios-gsm";
import chipIcon from "../../../../../assets/images/chip-icon.png";
import lossIcon from "../../../../../assets/images/loss-icon.png";
import gainIcon from "../../../../../assets/images/gain-icon.png";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from "recharts";

import { connect } from "react-redux";

const stateToProps = state => ({
  performance_account_id: state.betting.performance_account_id
});

const convert = pnlObj => {
  return {
    pnl: Number(pnlObj.pnl).toFixed(2),
    cumulative: (pnlObj.cumulative * 100).toFixed(2),
    changePercent: (pnlObj.changePercent * 100).toFixed(2)
  };
};

const RED = "#e12f48",
  BLUE = "#8884d8",
  GREEN = "#63a57c";


class CustomTooltip extends Component {
  render() {
    const { payload, active } = this.props;
    if (active) {
      let {
        display_date,
        date,
        account_value,
        account_pnl_pct,
        account_pnl_cumpct,
        commissions,
        slippage,
        //antiPnlData,
        benchmark_pctchg,
        benchmark_cumpct,
        benchmark_value,
        benchmark_sym,
        //position
      } = payload[0].payload;
      // example payload for testing purpose:
      // const date = "20181212",
      // pnlData = { date: "20171221", pnl: "5000", changePercent: "0", cumulative: "0" },
      // antiPnlData = { date: "20171221", pnl: "5000", changePercent: "0", cumulative: "0" },
      // benchmarkData = { date: "20171221", pnl: "5000", changePercent: "0", cumulative: "0" },
      // position = 7;

      return (
        <div className={classes.ToolTip}>
          <div className={classes.Row}>{display_date}</div>
          <hr style={{ width: "100%" }} />
          <div className={classes.Row} style={{ color: BLUE }}>
            <p>
              <span>Account Value:</span> <span>{account_value}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: BLUE }}>
            <p>
              <span>Account Daily %Chg: </span>
              <span>{account_pnl_pct}%</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: BLUE }}>
            <p>
              <span>Account Cum. %Chg: </span>
              <span>{account_pnl_cumpct}%</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: BLUE }}>
            <p>
              <span>Commissions: </span>
              <span>$ {commissions}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: BLUE }}>
            <p>
              <span>Slippage: </span>
              <span>$ {slippage}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: BLUE }}>
            <p>
              <span>Bet: </span>
              <span></span>
            </p>
          </div>

          <div className={classes.Row} style={{ color: RED }}>
            <p>
              <span>Benchmark Value: </span>
              <span>$ {benchmark_value}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: RED }}>
            <p>
              <span>Benchmark Daily %Chg: </span>
              <span>{benchmark_pctchg}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: RED }}>
            <p>
              <span>Benchmark Cum. %Chg: </span>
              <span>{benchmark_cumpct}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: RED }}>
            <p>
              <span>Benchmark Symbol: </span>
              <span>{benchmark_sym}</span>
            </p>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  static propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.object)
  };
}

@connect(stateToProps)
export default class OpenPositions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lookback: '',
      performance:{},
      performanceLoading:true,
      performanceError:'',
      // endDate: 20180201
    };
  }

  lookbackHandler = lookback => {
    this.setState({ lookback });
  };

  xTick({ payload, x, y }) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" transform="rotate(-45)">
          {payload.value}
        </text>
      </g>
    );
  }

  componentDidMount() {
      var self=this;
    axios
    .post("/utility/open_positions_live/", {
      /**
       * @example {"portfolio": ["TU", "BO"], "systems": ["prev1", "prev5"], "target": 500, "account": 5000}
       *
       */
      account_id: self.props.chip.account_id
    })
    .then(response => {
      /**
       * @namespace {Performance}
       */
      var performance = response.data;
      console.log('open positions data')
      console.log(performance);
      var dataJson= JSON.parse(performance.open_positions);
      performance.open_positions=dataJson;
      
      console.log(performance);

      this.setState({
          performanceLoading: false,
          performance
        });
    })
    .catch(performanceError => {
      console.log(performanceError);
      this.setState({
        performanceLoading: false,
        performanceError: performanceError
      });
    });

  }

  render() {
    var { performance, lookback, performanceLoading, performanceError } = this.state;
    var bgColor="white";
    var bgText="black";
    var bdColor="green";
    var bhColor="pink";
    /*if (this.props.themes.live.dashboard != undefined) {
      bgColor=this.props.themes.live.dashboard.background;
      bgText=this.props.themes.live.dashboard.text;
      bdColor=this.props.themes.live.dashboard.lines;
      bhColor=this.props.themes.live.dashboard.lines_horizontal_middle;
    }
    */
    var tableStyle={ fontSize:'12px',background: bgColor, color:bgText, borderLeft: "1px solid " + bdColor, borderRight: "1px solid " + bdColor, borderTop: "0.1px solid " + bhColor, borderBottom: "0.1px solid " + bhColor};
    var self=this;

    var chartData={};

    return (
        <div className={classes.OpenPositions}>
        
          {performanceLoading ? (
                <div>
                    <Spinner />
                </div>
        ) : performanceError ? (
            <div>
                
          <h1>
            {performanceError.Message ||
              "Could not load performance data, contact us to report this bug."}
          </h1>
          
          </div>
        ) : (

        <div className={classes.OpenPositions}>
                <span style={{"float": "right", "width": "100%", "textAlign": "right"}}>
                  <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                </span>

           <center><h3>Open Positions</h3></center>
          <center><h3>{performance.bet}</h3></center>
          <div className={classes.ChartContainer}>
          <table className={classes.Table} style={tableStyle}>
        <thead  style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
        <tr><td></td><td></td><td colSpan={'2'}><center><h4>{performance.last_date}</h4></center></td><td  colSpan={'2'}><center><h4>Last Update</h4></center></td></tr>
          <tr style={tableStyle}>
            <th style={tableStyle}><b>Markets</b></th>
            <th style={tableStyle}><b>Group</b></th>
            <th style={tableStyle}><b>Current Positions</b></th>
            <th style={tableStyle}><b>Position Value</b></th>
            <th style={tableStyle}><b>Updated When</b></th>
            <th style={tableStyle}><b>PnL</b></th>
            
          </tr>
        </thead>
        <tbody  style={tableStyle}>
          {Object.keys(performance.open_positions).map(key=> { 
            //console.log(account);
            var item=performance.open_positions[key];

            if (item) { 

              /*
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
              */
              return (
                <tr key={`dashboard-row-${key}`} style={tableStyle}>
                  <td style={tableStyle}>
                    <div className={classes.Cell + " " + classes.Flex}>
                      &nbsp;
                      <a href='#accountPerf' 
                        onClick={() => {self.props.showPerformance(account.account_id)}}>
                        {item.Markets}
                      </a>&nbsp;&nbsp;
                    </div>
                  </td>
                  <td style={tableStyle}>
                    <div className={classes.Cell}>
                    {item.Group}
                    </div>
                  </td>
                  <td style={tableStyle}>
                    <div className={classes.Cell}>
                      {item.Positions}
                    </div>
                  </td>
                  <td style={tableStyle}>
                    <div
                      className={classes.Cell}
                      style={{ justifyContent: "center" }}
                    >
                      <span style={{'float':'left','marginTop':"10px"}}>
                      {item['Position Value'] !== null ? (
                        <p style={{ width: "auto" }}>
                          {item['Position Value'] ? (
                            <img
                              src={
                                item['Position Value'] > 0
                                  ? gainIcon
                                  : item['Position Value'] < 0 ? lossIcon : ""
                              }
                            />
                          ) : null}
                          $ {item['Position Value']}
                        </p>
                      ) : null}
                      </span>
                    </div>
                  </td>
                 
                  <td  style={tableStyle}>
                  <div
                    className={classes.Cell} >
                    {item['Updated When']}
                  </div>
                  </td>
                  <td style={tableStyle}>
                    <div
                      className={classes.Cell}
                      style={{ justifyContent: "left" }}
                    >
                      <span style={{'float':'left','marginTop':"10px"}}>
                      {item['PnL'] !== null ? (
                        <p style={{ width: "auto" }}>
                          {item['PnL'] ? (
                            <img
                              src={
                                item['PnL'] > 0
                                  ? gainIcon
                                  : item['PnL'] < 0 ? lossIcon : ""
                              }
                            />
                          ) : null}
                          $ {item['PnL']}

                        </p>
                      ) : null}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            }
          })}

         <tr><td colSpan={"6"}>
         <span style={{textAlign:'right',float:'right'}}>Total: $ {performance.pnl_total}</span>
         </td></tr>
        </tbody>
      </table>
      
        </div>
        </div>
        )}
        </div>
    );
  }

  static propTypes = {
   
    //performance: PropTypes.object,
    //position: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    performance_account_id: PropTypes.string.isRequired
  };
}
