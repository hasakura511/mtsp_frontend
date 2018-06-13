import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate } from "../../../../../util";
import classes from "./TradingCosts.css";
import Spinner from "../../../../../components/UI/Spinner/Spinner";
import axios from "../../../../../axios-gsm";
import chipIcon from "../../../../../assets/images/chip-icon.png";
import lossIcon from "../../../../../assets/images/loss-icon.png";
import gainIcon from "../../../../../assets/images/gain-icon.png";
import ReactTable from "react-table";
import 'react-table/react-table.css'
import * as actions from "../../../../../store/actions";

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


const dispatchToProps = dispatch => {
  return {
    initializeHeatmap:(account_id, link, sym) => {
      dispatch(actions.initializeHeatmap(account_id, link, sym))
    }
    
  };
};

@connect(stateToProps, dispatchToProps)
export default class TradingCosts extends Component {
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
    .post("/utility/trading_costs_live/", {
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
      console.log('trading costs data')
      console.log(performance);
      var dataJson= JSON.parse(performance.trading_costs);
      performance.trading_costs=dataJson;
      
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
        <div className={classes.TradingCosts}>
        
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

        <div className={classes.TradingCosts}>
                <span style={{"float": "right", "width": "100%", "textAlign": "right"}}>
                  <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                </span>

           <center><h3>Trading Costs</h3></center>
          <center><h3>{performance.bet}</h3></center>
                <div className={classes.ChartContainer}>
          <ReactTable
          
          data={Object.keys(performance.trading_costs).map(key=> { 
            //console.log(account);
            var item=performance.trading_costs[key];

            if (item) { 
              item.key=key;
              return item;
            }
          })}

             
          columns={[
            {
              Header: "",
              columns: [
                {
                  Header: "Markets",
                  accessor: "Markets",
                  Cell: props => <span><a href='#market' onClick={()=> {
                    console.log(props);
                    var sym= props.value;
                    sym=sym.substr(0, sym.indexOf(' ')); 
                    self.props.initializeHeatmap(self.props.performance_account_id,'current',sym);
                    if (self.props.toggle)
                      self.props.toggle();
                    $(window).scrollTop($("#marketTop").offset().top-111);
                  }} >{props.value}</a></span>, // Custom cell components!,

                },
                {
                  Header: "Group",
                  accessor: "Group"
                }

              ]
            },
            {
              Header:  props => <span><center><h4>{performance.last_date}</h4></center></span>, // Custom cell components!,

              columns: [
                {
                  Header: "Contracts Traded",
                  accessor: "Contracts Traded",
                  Cell: props => <span className='number'><center>{props.value}</center></span>, // Custom cell components!,
                },
                {
                  Header: "Exec vs Close Price",
                  accessor: "Exec vs Close Price",
                  Cell: props => <span className='number'><center>{props.value}</center></span>, // Custom cell components!,
                  Footer: (
                    <span style={{'float':'right'}}><b>Total:</b></span>
                  )
                },
                {
                  Header: "Commissions",
                  accessor: "Commissions",
                  Cell: props => (
                    <span className='number'><center>
                    {parseFloat(props.value) ? (
                      <img src={parseFloat(props.value) > 0 ? gainIcon : lossIcon} />
                    ) : null}
                    <b>
                    $ {Math.abs(Math.round(parseFloat(props.value))).toLocaleString("en")} 
                    </b>
                    </center></span>
                  ), // Custom cell components!,

                  Footer: (
                    <span>
                     {performance.commissions_total !== null ? (
                        <center>
                          {performance.commissions_total ? (
                            <img
                              src={
                                performance.commissions_total > 0
                                  ? gainIcon
                                  : performance.commissions_total < 0 ? lossIcon : ""
                              }
                            />
                          ) : null}
                           <b>
                            $ {Math.abs(Math.round(performance.commissions_total)).toLocaleString("en")} 
                            </b>
                        </center>
                       ):null}
                      </span>
                  )
                },
                {
                  Header: "Slippage",
                  accessor: "Slippage",
                  Cell: props => (
                    <span className='number'><center>
                    {parseFloat(props.value) ? (
                      <img src={parseFloat(props.value) > 0 ? gainIcon : lossIcon} />
                    ) : null}
                    <b>
                    $ {Math.abs(Math.round(parseFloat(props.value))).toLocaleString("en")} 
                    </b>
                    </center></span>
                  ), // Custom cell components!,
                  Footer: (
                    <span>
                     {performance.slippage_total !== null ? (
                       <center>
                          {performance.slippage_total ? (
                            <img
                              src={
                                performance.slippage_total > 0
                                  ? gainIcon
                                  : performance.slippage_total < 0 ? lossIcon : ""
                              }
                            />
                          ) : null}
                           <b>
                            $ {Math.abs(Math.round(performance.slippage_total)).toLocaleString("en")} 
                            </b>
                        </center>
                       ):null}
                      </span>
                  )
                },
                
              ],
              
            },
            
          ]}
          //defaultPageSize={20}
          style={{
            width: "100%",
            height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
          className="-striped -highlight"
          showPagination={false}
        />
        </div>
         
         {  /*
                   <div className={classes.ChartContainer}>

          <table className={classes.Table} style={tableStyle}>
        <thead  className={classes.thead} style={{ background: bgColor, color:bgText, border: "1px solid " + bdColor}}>
          <tr className={classes.tr} style={tableStyle}>
            <th style={tableStyle}><b>Markets</b></th>
            <th style={tableStyle}><b>Group</b></th>
            <th style={tableStyle}><b>Contracts Traded</b></th>
            <th style={tableStyle}><b>Exec. vs Close Price</b></th>
            <th style={tableStyle}><b>Commissions</b></th>
            <th style={tableStyle}><b>Slippage</b></th>
          </tr>
        </thead>
        <tbody className={classes.tbody} style={tableStyle}>
          {Object.keys(performance.trading_costs).map(key=> { 
            //console.log(account);
            var item=performance.trading_costs[key];

            if (item) { 

             
              return (
                <tr className={classes.tr} key={`dashboard-row-${key}`} style={tableStyle}>
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
                      {item['Contracts Traded']}
                    </div>
                  </td>
                  <td style={tableStyle}>
                    <div
                      className={classes.Cell}
                      style={{ justifyContent: "center" }}
                    >
                      <span style={{'float':'left','marginTop':"10px"}}>
                      {item['Exec. vs Close Price'] !== null ? (
                        <p style={{ width: "auto" }}>
                          {item['Exec. vs Close Price'] ? (
                            <img
                              src={
                                item['Exec. vs Close Price'] > 0
                                  ? gainIcon
                                  : item['Exec. vs Close Price'] < 0 ? lossIcon : ""
                              }
                            />
                          ) : null}
                          {item['Exec. vs Close Price']}
                        </p>
                      ) : null}
                      </span>
                    </div>
                  </td>
                  <td style={tableStyle}>
                    <div
                      className={classes.Cell}
                      style={{ justifyContent: "center" }}
                    >
                      <span style={{'float':'left','marginTop':"10px"}}>
                      {item['Commissions'] !== null ? (
                        <p style={{ width: "auto" }}>
                          {item['Commissions'] ? (
                            <img
                              src={
                                item['Commissions'] > 0
                                  ? gainIcon
                                  : item['Commissions'] < 0 ? lossIcon : ""
                              }
                            />
                          ) : null}
                         $ {item['Commissions']}
                        </p>
                      ) : null}
                      </span>
                    </div>
                  </td>
                  <td style={tableStyle}>
                    <div
                      className={classes.Cell}
                      style={{ justifyContent: "left" }}
                    >
                      <span style={{'float':'left','marginTop':"10px"}}>
                      {item['Slippage'] !== null ? (
                        <p style={{ width: "auto" }}>
                          {item['Slippage'] ? (
                            <img
                              src={
                                item['Slippage'] > 0
                                  ? gainIcon
                                  : item['Slippage'] < 0 ? lossIcon : ""
                              }
                            />
                          ) : null}
                          $ {item['Slippage']}

                        </p>
                      ) : null}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            }
          })}

         <tr className={classes.tr} style={tableStyle}><td></td><td></td><td></td>
         <td style={tableStyle}>Total:</td>
         <td  style={tableStyle}>
           <span> $ {performance.commissions_total}</span>
         </td><td style={tableStyle}>
          <span > $ {performance.slippage_total}</span>
         </td></tr>
        </tbody>
      </table>
        </div>
        */}

      
        </div>
        )}
        </div>
    );
  }

  static propTypes = {
   
    //performance: PropTypes.object,
    //position: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    performance_account_id: PropTypes.string.isRequired,
    toggle:PropTypes.func,
    initializeHeatmap:PropTypes.func
  };
}
