import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate,adjustHeaders } from "../../../../../util";
import classes from "./SignalHistory.css";
import Spinner from "../../../../../components/UI/Spinner/Spinner";
import axios from "../../../../../axios-gsm";
import chipIcon from "../../../../../assets/images/chip-icon.png";
import lossIcon from "../../../../../assets/images/loss-icon.png";
import gainIcon from "../../../../../assets/images/gain-icon.png";
import ReactTable from "react-table";
import 'react-table/react-table.css'
import * as actions from "../../../../../store/actions";
import DatePicker from 'react-datepicker';
import moment from 'moment';


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
  //liveDate:state.betting.liveDate,
  liveDateText:state.betting.liveDateText,
  email:state.auth.email,
  strat:state.betting.strat

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
    initializeHeatmap:(account_id, link, sym, date) => {
      dispatch(actions.initializeHeatmap(account_id, link, sym, date))
    },
    initializeHeatmapGroup:(account_id, link, group, date) => {
      dispatch(actions.initializeHeatmapGroup(account_id, link, group, date))
    },
    showHtmlDialog: (htmlContent) => {
      dispatch(actions.showHtmlDialog(htmlContent));
      
    },
    silenceHtmlDialog: () => {
      dispatch(actions.silenceHtmlDialog());
      
    },
    showHtmlDialog2: (htmlContent) => {
      dispatch(actions.showHtmlDialog2(htmlContent));
      
    },
    silenceHtmlDialog2: () => {
      dispatch(actions.silenceHtmlDialog2());
      
    },
    
  };
};

@connect(stateToProps, dispatchToProps)
export default class SignalHistory extends Component {
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

  signalHistory = (chip_id, strategy, parents, date=this.props.liveDateText, date_picked=false) => {

    var self=this;
    this.setState({refreshing:true})
    if (this.props.strat)
      strategy=this.props.strat;

    axios
    .post("/utility/signal_history_live/", {
     
      username: self.props.email,
      last_date:date,
      chip_id: chip_id,
      strategy: strategy,
      parents: parents,
      
    })
    .then(response => {
      var performance = response.data;
      console.log('signal history live')
      console.log(performance);

      if (performance.data_not_available) {
        var performanceError=performance.data_not_available_message;
        self.setState({
          performanceLoading: false,
          performanceError: performanceError
        });
      } else {
        var dataJson= JSON.parse(performance.signal_history);
        performance.signal_history=dataJson;
        
        self.setState({
          performanceLoading: false,
          performance,
          performanceError:''
        });
        if (date_picked) {
          self.setState({
            date_picked:date
          })
        } else {
          //console.log(performance.last_date)
          var last_date=new moment(performance.last_date).format('YYYYMMDD');
          //console.log(last_date);
          self.setState({
            date_picked:last_date
          })
          
        }

        console.log(performance);

        this.setState({refreshing:false})
      

        }
    })
    .catch(performanceError => {
      console.log(performanceError);
      this.setState({
        performanceLoading: false,
        performanceError: performanceError,
        refreshing:false
      });
    });

  }
  
  componentWillReceiveProps(newProps) {
    var self=this;
    if (newProps.strat) {
      var parents=[];
      Object.keys(self.props.slot).map(key => {
        if (self.props.slot[key].id)
          parents.push(self.props.slot[key].id);
      });
      var date=self.props.liveDateText;
      if (this.state.date_picked)
        date=this.state.date_picked;
      self.signalHistory(self.props.chip.chip_id, newProps.strat, parents, date);
    }

  }
  componentDidMount() {
        var self=this;
        var parents=[];
        Object.keys(self.props.slot).map(key => {
          if (self.props.slot[key].id)
            parents.push(self.props.slot[key].id);
        });
        self.signalHistory(self.props.chip.chip_id, self.props.slot.position, parents);
  }

  render() {
    var { performance, performanceLoading, performanceError } = this.state;
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
        <div className={classes.SignalHistory}>
        
        {performanceLoading || this.state.refreshing ? (
                <div style={{height: innerHeight - 172,  background: self.props.themes.live.dialog.tab_color_active} }>
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

        ) : !self.state.date_picked ? (
          <div style={{  background: self.props.themes.live.dialog.tab_color_active,
            height: innerHeight - 172
          } }
          id={'custom_datepick'}    
          onClick={(e) => {
            if (e.target.toString() == "[object HTMLDivElement]") {
              //alert(e.target.toString())
              if (e.target.classList.contains("react-datepicker__portal")) {
                self.setState({date_picked:self.state.orig_date});
                //$('#custom_datepick').hide();
              }
            }
            console.log(e.target)
            
          }}
          >
          <center>
              <DatePicker
               inline
               withPortal
               //openToDate={Object.keys(performance.available_dates).map(key => {
               // return new moment(performance.available_dates[key]);
               //})[0]}
               highlightDates={Object.keys(performance.available_dates).map(key => {
                 return new moment(performance.available_dates[key]);
               })}
               onChange={(e) => {
                   var date=e.format('YYYYMMDD')
                   console.log(date);
              
                   var hasDate=false;
                   Object.keys(performance.available_dates).map(key => {
                    if (date == new moment(performance.available_dates[key]).format('YYYYMMDD'))
                        hasDate=true;
                  })
                  if (hasDate) {
                   var parents=[];
                    Object.keys(self.props.slot).map(key => {
                      if (self.props.slot[key].id)
                        parents.push(self.props.slot[key].id);
                    });
                    self.signalHistory(self.props.chip.chip_id, self.props.slot.position, parents, date, true);
                  }
               }}  
                />
            </center>
            
          </div>
        ) 
        :
        (

        <div className={classes.SignalHistory} style={{marginTop:"-20px", background:self.props.themes.live.dialog.tab_color_active}}>
          
                <span style={{margin:"0px", background:self.props.themes.live.dialog.tab_color_active, "float": "right", "width": "100%", "textAlign": "right"}}>
                  <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                </span>

          <center><h3>{performance.title}</h3>
          </center>
          <p align={'right'}>
          <button onClick={() => {
              var idx=0;
              var prev_idx=0;
              var dates=Object.keys(performance.available_dates).map(key => {
                if (new moment(performance.available_dates[key]).format('YYYYMMDD') == this.state.date_picked) {
                    if (idx - 1 > 0)
                      prev_idx=idx-1;
                }

                idx+=1;
                
                return new moment(performance.available_dates[key]).format('YYYYMMDD')
              })
              var date=dates[prev_idx];
              //console.log(dates);
              //alert(date);
              //alert(self.state.date_picked);
               var parents=[];
              Object.keys(self.props.slot).map(key => {
                if (self.props.slot[key].id)
                  parents.push(self.props.slot[key].id);
              });
              self.signalHistory(self.props.chip.chip_id, self.props.slot.position, parents, date, true);

          }}>
          Previous Date
          </button>
          <button onClick={() => {
            var orig_date=this.state.date_picked;
            this.setState({orig_date, date_picked:""})
          }} 
         >
          Select Date
          </button>
          <button onClick={() => {
              var idx=0;
              var prev_idx=0;
              var dates=Object.keys(performance.available_dates).map(key => {
                if (new moment(performance.available_dates[key]).format('YYYYMMDD') == this.state.date_picked) {
                      prev_idx=idx+1;
                }

                idx+=1;
                
                return new moment(performance.available_dates[key]).format('YYYYMMDD')
              })
              if (prev_idx >= dates.length)
                prev_idx=dates.length-1;
              var date=dates[prev_idx];
              //console.log(dates);
              //alert(date);
              //alert(self.state.date_picked);
               var parents=[];
              Object.keys(self.props.slot).map(key => {
                if (self.props.slot[key].id)
                  parents.push(self.props.slot[key].id);
              });
              self.signalHistory(self.props.chip.chip_id, self.props.slot.position, parents, date, true);

          }}>
          Next Date
          </button>
          <br/>
          </p>
          
                <div className={classes.ChartContainer}>
          <ReactTable
          
          data={Object.keys(performance.signal_history).map(key=> { 
            //console.log(account);
            var item=performance.signal_history[key];

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
                    var sym= props.value;
                    sym=sym.substr(0, sym.indexOf(' ')); 
                    //alert(self.state.date_picked)
                    self.props.initializeHeatmap('','',sym, self.state.date_picked);
                    if (self.props.toggle)
                      self.props.toggle();
                    $(window).scrollTop($("#marketTop").offset().top-111);
                  }} >{props.value}</a></span>, // Custom cell components!,

                },
                {
                  Header: "Group",
                  accessor: "Group",
                  Cell: props => <span><a href='#market' onClick={()=> {
                    console.log(self.props.chip.account_id);
                    var group= props.value;
                    //sym=sym.substr(0, sym.indexOf(' ')); 
                    self.props.initializeHeatmapGroup(self.props.chip.account_id,'current',group, self.state.date_picked);
                    if (self.props.toggle)
                      self.props.toggle();
                    $(window).scrollTop($("#marketTop").offset().top-111);
                  }} >
                  <center>
                  {props.value}
                  </center>
                  </a></span>, // Custom cell components!,
                }

              ]
            },
            {
              Header:  props => <span><center><h4>{performance.prev_date}</h4></center></span>, // Custom cell components!,
              headerStyle: {
                background:self.props.themes.live.dialog.table_left_background
              },
              columns: [
                {
                  Header: "Quantity",
                  accessor: "Quantity",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_left_background
                  },                  
                  Cell: props => (
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
                  Header: "Signals",
                  accessor: "Signals",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_left_background
                  },              
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
                 
                },
                {
                  Header: "Positions",
                  accessor: "Positions",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_left_background
                  },                  
                  Cell: props => (
                    <span className='number'><center style={{color:self.props.themes.live.dialog.text}}>
                    {parseFloat(props.value) ? (
                      <span style={parseFloat(props.value) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                    <b>
                    {Math.round(parseFloat(props.value),4).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.live.dialog.text}}>
                    <b>
                    {Math.round(parseFloat(props.value),4).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                    </b>
                    </span>
                    )}
                    </center></span>
                  ), // Custom cell components!,

                 
                },
               
                {
                
                  Header: "Position Value",
                  accessor: "Position_Value",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_left_background
                  },
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
                  
                },
              ]
            },
            {
              Header:  props => <span><center><h4>{performance.last_date}</h4></center></span>, // Custom cell components!,
              headerStyle: {
                background:self.props.themes.live.dialog.table_right_background
              },
              columns: [
                
                {
                
                  Header: "1 Day %Chg",
                  accessor: "1Day_pctchg",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_right_background
                  },
                  Cell: props => (
                    <span className='number'><center>
                    {parseFloat(props.value) ? (
                      <span style={parseFloat(props.value) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                    <b>
                    {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.live.dialog.text}}>
                    <b>
                    {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
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
                
                  Header: "PnL",
                  accessor: "PnL",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_right_background
                  },
                  Cell: props => (
                    <span className='number'><center>
                    {parseFloat(props.value) ? (
                      
                     <img
                              src={
                                props.value > 0
                                  ? gainIcon
                                  : props.value < 0 ? lossIcon : ""
                              }
                            />
                          ) : null}
                    &nbsp;
                    <b>
                    $ {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                    </b>
                    </center></span>
                  ), // Custom cell components!,
                  Footer: (
                    <span>
                     {performance.pnl_total !== null ? (
                       <center>
                          {performance.pnl_total ? (
                            <img
                              src={
                                performance.pnl_total > 0
                                  ? gainIcon
                                  : performance.pnl_total < 0 ? lossIcon : ""
                              }
                            />
                          ) : null}
                           <b>
                            $ {Math.round(Math.round(performance.pnl_total)).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                            </b>
                        </center>
                       ):null}
                      </span>
                  )
                },
              ],
              
            },
            
          ]}
          defaultPageSize={Object.keys(performance.signal_history).length < 13 ? 13 :Object.keys(performance.signal_history).length}
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
    initializeHeatmapGroup:PropTypes.func,
    themes:PropTypes.object.isRequired,
    //liveDate:PropTypes.instanceOf(moment).isRequired,
    liveDateText:PropTypes.string.isRequired,
    email:PropTypes.string,
    showHtmlDialog:PropTypes.func.isRequired,
    silenceHtmlDialog:PropTypes.func.isRequired,
    showHtmlDialog2:PropTypes.func.isRequired,
    silenceHtmlDialog2:PropTypes.func.isRequired,
    strat:PropTypes.string
  };
}
