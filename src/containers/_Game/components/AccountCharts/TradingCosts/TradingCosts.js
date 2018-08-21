import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate,adjustHeaders } from "../../../../../util";
import classes from "./TradingCosts.css";
import Spinner from "../../../../../components/UI/Spinner/Spinner";
import axios from "../../../../../axios-gsm";
import chipIcon from "../../../../../assets/images/chip-icon.png";
import lossIcon from "../../../../../assets/images/loss-icon.png";
import gainIcon from "../../../../../assets/images/gain-icon.png";
import ReactTable from "react-table";
import 'react-table/react-table.css'
import * as actions from "../../../../../store/actions";
import Markets from "../../../../Markets/Markets"

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
  performance_account_id: state.betting.performance_account_id,
  themes:state.betting.themes,
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
    },
    showHtmlDialog3: (htmlContent) => {
      dispatch(actions.showHtmlDialog3(htmlContent));
      
    },
    silenceHtmlDialog3: () => {
      dispatch(actions.silenceHtmlDialog3());
      
    },

    
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
      if (performance.data_not_available) {
        var performanceError=performance.data_not_available_message;
        this.setState({
          performanceLoading: false,
          performanceError: performanceError
        });
      } else {
        var dataJson= JSON.parse(performance.trading_costs);
        performance.trading_costs=dataJson;
        
        console.log(performance);
          this.setState({
            performanceLoading: false,
            performance
          });

         
        }
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
          <div style={{height: innerHeight - 172,  background: self.props.themes.live.dialog.tab_color_active} }>

          <center >  
          <br/>
          <h4>
            {performanceError ? performanceError + "" :
              "Data not Available"}
          </h4>
          </center>
          
          </div>

        ) : (

        <div className={classes.TradingCosts} style={{margin:"0px", background:self.props.themes.live.dialog.tab_color_active}}>
                <span style={{margin:"0px", background:self.props.themes.live.dialog.tab_color_active, "float": "right", "width": "100%", "textAlign": "right"}}>
                  <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                </span>

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
                    self.props.showHtmlDialog3(<Markets load_account_id={''} 
                      load_symbol={sym} 
                      load_link={''}
                      load_portfolio={''} 
                      is_dialog={true}
                      />)
                      /*
                    self.props.initializeHeatmap(self.props.performance_account_id,'current',sym);
                    if (self.props.toggle)
                      self.props.toggle();
                    $(window).scrollTop($("#marketTop").offset().top-111);
                    */
                  }} >{props.value}</a></span>, // Custom cell components!,

                },
                {
                  Header: "Group",
                  accessor: "Group",
                  Cell: props => <span><center>{props.value}</center></span>, // Custom cell components!,
                }

              ]
            },
            {
              Header:  props => <span><center><h4>{performance.last_date}</h4></center></span>, // Custom cell components!,
              headerStyle: {
                background:self.props.themes.live.dialog.table_right_background
              },
              columns: [
                {
                  Header: "Contracts Traded",
                  accessor: "Contracts Traded",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_right_background
                  },                  Cell: props => (
                    <span className='number'><center>
                    {parseFloat(props.value) ? (
                      <span style={parseFloat(props.value) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                    <b>
                    {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.live.dialog.text}}>
                    <b>
                    {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                    </b>
                    </span>
                    )}
                    </center></span>
                  ), // Custom cell components!,

                },
                {
                  Header: "Exec vs Close Price",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_right_background
                  },                  accessor: "Exec vs Close Price",
                  Cell: props => (
                    <span className='number'><center>
                    {props.value && Math.abs(parseFloat(props.value)) != 0 ? (
                      <span style={parseFloat(props.value) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                    <b>
                    {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.live.dialog.text}}>
                    <b>
                    {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                    </b>
                    </span>
                    )}
                    </center></span>
                  ), // Custom cell components!,
                  Footer: (
                    <span style={{'float':'right'}}><b>Total:</b></span>
                  )
                },
                {
                  Header: "Commissions",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_right_background
                  },                  accessor: "Commissions",
                  Cell: props => (
                    <span className='number'><center style={{color:self.props.themes.live.dialog.text}}>
                    {parseFloat(props.value) ? (
                      <span style={parseFloat(props.value) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                    <b>
                    $ {Math.round(parseFloat(props.value),4).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.live.dialog.text}}>
                    <b>
                    $ {Math.round(parseFloat(props.value),4).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                    </b>
                    </span>
                    )}
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
                            $ {parseFloat(performance.commissions_total).toLocaleString('en-US', { maximumFractionDigits: 12 })}
                             
                            </b>
                        </center>
                       ):null}
                      </span>
                  )
                },
                {
                  Header: "Slippage",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_right_background
                  },
                  accessor: "Slippage",
                  Cell: props => (
                    <span className='number'><center>
                    {parseFloat(props.value) ? (
                      <span style={parseFloat(props.value) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                    <b>
                    $ {Math.round(parseFloat(props.value),4).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.live.dialog.text}}>
                    <b>
                    $ {Math.round(parseFloat(props.value),4).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                    </b>
                    </span>
                    )}
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
                            $ {Math.round(Math.round(performance.slippage_total)).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                            </b>
                        </center>
                       ):null}
                      </span>
                  )
                },
                
              ],
              
            },
            
          ]}
          defaultPageSize={Object.keys(performance.trading_costs).length < 13 ? 13 :Object.keys(performance.trading_costs).length}
          minRows={13}
          style={{
            width:"100%",
            height:innerHeight - 260,
            maxHeight:"100%",
            overflow:"auto",
            fontSize:"12px",
            fontWeight: 800,
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
    initializeHeatmap:PropTypes.func,
    themes:PropTypes.object.isRequired,
    showHtmlDialog3:PropTypes.func.isRequired,
    silenceHtmlDialog3:PropTypes.func.isRequired,

  };
}
