import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate,adjustHeaders } from "../../../../../util";
import classes from "./BetHistory.css";
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
import Chip from "../../_Chip/_Chip";
import Panel from "../../../containers/Panel/Panel";
import Popover  from 'react-simple-popover'
import { toSystem, toAntiSystem, toSystemNum } from "../../../Config";


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
  dictionary_strategy:state.betting.dictionary_strategy,

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
export default class BetHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lookback: '',
      performance:{},
      performanceLoading:true,
      performanceError:'',
      isPopoverOpen :{},
      
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

  betHistory = (account_id) => {

    var self=this;

    axios
    .post("/utility/bet_history_live/", {
     
      account_id: account_id
      
    })
    .then(response => {
      var performance = response.data;
      console.log('bet history live')

      if (performance.data_not_available) {
        
        var performanceError=performance.data_not_available_message;
        self.setState({
          performanceLoading: false,
          performanceError: performanceError
        });

      } else {

        //console.log(performance.bet_history);
        var dataJson = JSON.parse(performance.bet_history);
        Object.keys(dataJson).map(key => {

            var board_config_fe=JSON.parse(dataJson[key].board_config_fe);
            var portfolio=JSON.parse(dataJson[key].portfolio);
            var qty=JSON.parse(dataJson[key].qty);
            dataJson[key].board_config_fe=board_config_fe;
            dataJson[key].portfolio=portfolio;
            dataJson[key].qty=qty;
            dataJson[key].key=key;
        })
        performance.bet_history=dataJson;
        console.log(performance);
        
        self.setState({
          performanceLoading: false,
          performance,
          performanceError:''
        });

        /*
        if (date_picked) {
          self.setState({
            date_picked:date
          })
        }
        */

        console.log(performance);

      

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
  
  componentDidMount() {
        var self=this;
        var parents=[];
        self.betHistory(self.props.chip.account_id);
  }

  handleClick = (item) => {
    var isPopoverOpen=this.state.isPopoverOpen;
    isPopoverOpen[item]=!isPopoverOpen[item];
    this.setState({ isPopoverOpen: isPopoverOpen })

  }


  handleClose(e) {
    var isPopoverOpen=this.state.isPopoverOpen;
    Object.keys(isPopoverOpen).map(key => {
        isPopoverOpen[key]=false;
    })
    this.setState({ isPopoverOpen: isPopoverOpen })
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
        <div className={classes.BetHistory}>
        
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

        ) :
        (

        <div className={classes.BetHistory} style={{margin:"0px", background:self.props.themes.live.dialog.tab_color_active}}>
                <span style={{margin:"0px", background:self.props.themes.live.dialog.tab_color_active, "float": "right", "width": "100%", "textAlign": "right"}}>
                  <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                </span>

          <center><h3>{performance.title}</h3></center>
                <div className={classes.ChartContainer}>
          <ReactTable
          
          data={Object.keys(performance.bet_history).map(key=> { 
            //console.log(account);
            var item=performance.bet_history[key];

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
                  Header: "Bet Placed",
                  accessor: "key",
                  width: 300,
                  Cell: props => <span>{props.value}</span>, // Custom cell components!,


                },
                {
                  Header: "Bet",
                  accessor: "bet",
                  Cell: props => <span><center>{props.value}</center></span>, // Custom cell components!,
                },
                {
                  Header: "Executed",
                  accessor: "executed",
                  Cell: props => <span style={{color: props.value == 'Yes' ? 'green':'black'}}><center>{props.value}</center></span>, // Custom cell components!,
                },
                {
                    Header: "Board",
                    accessor: "board",
                    Cell: props => {
                      var chip=props.original;
                      chip.display=props.original.account_chip_text;
                      chip.tier = props.original.tier;

                      chip.status = 'unlocked';
                      chip.isReadOnly=true;
                      chip.position=toSystemNum(chip.chip_location)
                      var balanceChips=[];
                      var bettingChips=[];
                      if (chip.position.toString().toLowerCase() != 'off')
                        bettingChips.push(chip);
                      else
                      {
                        chip.count=1;
                        chip.accountId=chip.account_id;
                        balanceChips.push(chip);
                      }
  
                      return (
                      <span className='number'><center>
                          
                      <a href='JavaScript:console.log("popover called")' style={{ cursor:'pointer'  }} 
                      
                      onClick={() => {  
                                  var board_config=props.original.board_config_fe
                                  var row=props.original;
                                  console.log(row)
                                  var leftSystems=[];
                                  var rightSystems=[];
                                  var topSystems=[];
                                  var bottomSystems=[];
                                  var dictionary_strategy=self.props.dictionary_strategy;
  
                                  Object.keys(board_config).map(function(key) {
                                      var name, strat;
                                      var heldchips=[];
                                      name=board_config[key].id;
                                      if (name.toLowerCase() == chip.position.toString().toLowerCase())
                                        heldchips.push(chip);
                                      if (board_config[key].position == 'left') {
                                        name=board_config[key].id;
                                        strat=dictionary_strategy[name];
                                        strat.heldChips=heldchips;      
                                        strat.column=name;
                                        strat.display=name;         
                                        strat.id=name;
                                        strat.short=strat.board_name;
                                        strat.position="left";
                                        leftSystems.push(strat);
                                      } else if (board_config[key].position == 'right') {
                                        name=board_config[key].id;
                                        strat=dictionary_strategy[name];
                                        strat.heldChips=heldchips;       
                                        strat.column=name;
                                        strat.display=name;         
                                        strat.id=name;
                                        strat.short=strat.board_name;
                                        strat.position="right";
                                        rightSystems.push(strat);
                                      } else if (board_config[key].position == 'top') {
                                        name=board_config[key].id;
                                        strat=dictionary_strategy[name];
                                        strat.heldChips=heldchips;
                                        strat.column=name;
                                        strat.display=name;         
                                        strat.id=name;
                                        strat.short=strat.board_name;
                                        strat.position="top";
                                        topSystems.push(strat);
                                      } else if (board_config[key].position == 'bottom') {
                                        name=board_config[key].id;
                                        strat=dictionary_strategy[name];
                                        strat.heldChips=heldchips;
                                        strat.column=name;
                                        strat.display=name;         
                                        strat.id=name;
                                        strat.short=strat.board_name;
                                        strat.position="bottom";
                                        bottomSystems.push(strat);
                                      }  
                        
                                    });
                                    var config={}
                                    config.board_config=board_config;
                                    config.leftSystems=leftSystems;
                                    config.rightSystems=rightSystems;
                                    config.topSystems=topSystems;
                                    config.bottomSystems=bottomSystems;
                                    
                                    var themes_bg="linear-gradient(90deg," + this.props.themes.live.heatmap.heatmap_cold + ", " + this.props.themes.live.heatmap.heatmap_hot + ")";
                                    var board_bg="linear-gradient(180deg," + this.props.themes.live.background.top + ", " + this.props.themes.live.background.middle + ", " + this.props.themes.live.background.bottom + ")";
                                    //console.log(themes_bg);
                                    var actionBg="white";
                                    var heatmapTxt="black";
                                    var switchBg="purple";
                                    var switchTxt="white";
                                    if (this.props.themes.live.action_row != undefined) {
                                      actionBg=this.props.themes.live.action_row.background;
                                      heatmapTxt=this.props.themes.live.heatmap.text;
                                      switchBg=this.props.themes.live.action_row.switch_fill;
                                      switchTxt=this.props.themes.live.action_row.switch_text;
  
                                    }
                                    config.board_bg=board_bg;
  
  
                                    self.leader_board_config=config;
                                    console.log(self.leader_board_config)
                                    self.handleClick(row.key + 'board');
                        }}>
                        <img src="/images/preview_board.png" width={30} height={30} />
                        </a>
                        <Popover
                          placement='bottom'
                          container={self}
                          target={this}
                          show={self.state.isPopoverOpen[props.original.key + 'board'] ? true : false }
                          onHide={self.handleClose.bind(this)} 
                          hideWithOutsideClick={true}
                          containerStyle={{ 
                              marginTop: -innerHeight + 200 + "px",
                              background:self.props.themes.live.dialog.background,
                              width: "99.9%",
                              height: "99%",
                          }}
                          style={{
  
                              width: "100%",
                              height: "100%",
                              background:self.props.themes.live.dialog.background
                              
                          }}
                          >
                          <div style={{ background:self.props.themes.live.dialog.background, color:self.props.themes.live.dialog.text }}>
  
                           <div style={{ "width": "100%", "padding":"0px", "margin":"0px", background:self.props.themes.live.dialog.background}}>
                            <span style={{
                              float: "left",
                              width: "33.33333%",
                              
                              textAlign: "left"
                              }}
                            >
                            &nbsp;
                            </span>
                            <span style={{
                              float: "left",
                              width: "33.33333%",
                              textAlign: "center",
                              marginTop: "5px"
                              }}
                            >
                            <br/><h3> Preview Board </h3>
                            </span>
                            <span style={{
                              float: "left",
                              width: "33.33333%",
                              textAlign: "right"
                              }}
                            >
                              <br/>
                              <span style={{textAlign:"right",marginTop:"5px", padding:"5px", "cursor":"pointer", background:self.props.themes.live.dialog.background}} 
                              onClick={() => {  self.handleClose();}}
                              >
                                <button onClick={() => { self.handleClose(); } } >
                                <font style={{fontSize:"16px"}}>Close</font>
                                </button>
                              </span>
                              </span>
                            </div>
                            <div style={{clear: "both"}}></div>​
                            
                          <center><h3 style={{ color:self.props.themes.live.dialog.text}} ></h3></center>
                          
                          <table style={{border:"none", borderCollapse: "collapse",
          background:self.props.themes.live.dialog.background_inner,
          color:self.props.themes.live.dialog.text,
          width:"100%",
          fontSize:"20px" }}>
            <thead  style={{border:"none"}}>
              <tr style={{border:"none"}}>
                  <th  style={{border:"none"}}>
                  <center>
                  Bet Placed
                  </center>
                  </th>
                  <th  style={{border:"none"}}>
                  <center>
                  Bet
                  </center>
                  </th>
                  <th  style={{border:"none"}}>
                  <center>
                  Executed
                  </center>
                  </th>
                  <th  style={{border:"none"}}>
                  <center>
                  Margin %
                  </center>
                  </th>
                  <th  style={{border:"none"}}>
                  <center>
                   Auto
                  </center>
                  </th>
                  <th  style={{border:"none"}}>
                  <center>
                   Portfolio
                  </center>
                  </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{border:"1px", "padding":"1px"}}>
                  <td style={{borderLeft:"1px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                  <div>
                    {props.original.key}
                  </div>
                  </td>            
                  <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                  <center>
                  {props.original.bet}
                  </center>
                  </td>            
                  <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none", color: props.original.executed == 'Yes' ? 'green':'black'}}>
                  <center>
                    {props.original.executed}
                          </center>
  
                  </td>            
                  <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                  <center>
                  {props.original.margin_percent}
                  </center>
                  </td>            
                  <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                  <center>
                  {props.original.auto}
                  </center>
                  </td>            
                  <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black", borderRight:"1px solid black"}}>
                  <center>
                  {props.original.num_markets}
                  </center>
                  </td>
                  </tr>
                  </tbody>
                  </table>
  
                        {self.leader_board_config ? (
                          <div
                          className={classes.Board}
                          style={
                            {
                              background: self.leader_board_config.board_bg,
                              //backgroundImage: "url(" + bgBoard + ")",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              paddingTop: "100px",
                              paddingBottom: "100px",
                              //paddingRight: "150px",
                              //paddingLeft: "150px",
                            } // 
                          }
                        >
  
                         <Panel
                                  isLive={true}
                                  isReadOnly={true}
                                  accounts={[chip]}
                                  leftSystems={self.leader_board_config.leftSystems || []}
                                  rightSystems={self.leader_board_config.rightSystems || []}
                                  bottomSystems={self.leader_board_config.bottomSystems || []}
                                  topSystems={self.leader_board_config.topSystems || []}
                                  balanceChips={balanceChips}
                                  bettingChips={bettingChips}
                                  addBettingChip={() => { console.log('add betting chip called'); }}
                                  moveToBalance={() => { console.log('move to balance called'); }}
                                  />
                          </div>
                      ) : null }
                       </div>
                          </Popover>
                      </center></span>
                    ) // Custom cell components!,
  
                    },
                  },


              ]
            },
            {
              Header:  props => <span><center><h4>Portfolio Settings</h4></center></span>, // Custom cell components!,
              headerStyle: {
                background:self.props.themes.live.dialog.table_left_background
              },
              columns: [
                {
                  Header: "Margin %",
                  accessor: "margin_percent",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_left_background
                  },                  
                  Cell: props => (
                    <span className='number'><center>
                    
                    <b>
                    {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </center></span>
                  ), // Custom cell components!,

                },
                {
                  Header: "Auto",
                  accessor: "auto",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_left_background
                  },              
                  Cell: props => (
                    <span className='number'><center>
                    <b>
                    {props.value}
                    </b>
                    </center>
                    </span>
                    ) 
                },
                {
                  Header: "Portfolio",
                  accessor: "num_markets",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_left_background
                  },                  
                  Cell: props => (
                    <span className='number'><center>
                        
                    <a href='JavaScript:console.log("popover called")' style={{ cursor:'pointer'  }} 
                    title={"Show Account Portfolio."}
                    ref={ref => self[props.original.key] = ref}
                    onClick={() => {  
                                var portfolio=props.original.portfolio
                                self.items=portfolio.map(item => {
                                    return self.state.performance.market_dict[item]
                                });
                                console.log(self.items)
                                self.handleClick(props.original.key);
                      }}>{props.value}</a>
                    <Popover
                        placement='left'
                        container={self}
                        target={self[props.original.key]}
                        show={self.state.isPopoverOpen[props.original.key] ? true : false }
                        onHide={self.handleClose.bind(this)} 
                        hideWithOutsideClick={true}
                        containerStyle={{ 
                            marginTop: self.props.gap + "px",
                            padding:"0px"
                        }}
                        style={{

                            width: "400px",
                            padding:"0px"
                        }}
                        >
                        <div>
                            {self.items && self.items.length > 0 ? (
                            <ReactTable
                            
                            data={self.items}
                            className="-striped -highlight"
                            minRows={10}
                            columns={[
                                {
                                Header: "",
                                columns: [
                                    {
                                    Header: "Markets",
                                    accessor: "Display",
                                    },
                                    {
                                    Header: "Group",
                                    accessor: "Group",
                                    Cell: props => (
                                        <span className='number'><center>
                                        {props.value}
                                        </center></span>
                                      ), // Custom cell components!,
                                    }
                                ]}]}
                                defaultPageSize={self.items.length}
                                style={{
                                    width: "100%", 
                                    height: "400px",
                                    maxHeight:"100%",
                                    overflow:"auto",
                                    fontSize:"12px",
                                    fontWeight: 800,
                                }}
                              
                                showPagination={false}
                                />
                            ) : null }

                            </div>
                        </Popover>
                    </center></span>
                  ), // Custom cell components!,

                 
                },
               
              ]
            },
            
          ]}
          defaultPageSize={Object.keys(performance.bet_history).length < 13 ? 13 :Object.keys(performance.bet_history).length}
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
    //liveDate:PropTypes.instanceOf(moment).isRequired,
    liveDateText:PropTypes.string.isRequired,
    email:PropTypes.string,
    showHtmlDialog:PropTypes.func.isRequired,
    silenceHtmlDialog:PropTypes.func.isRequired,
    showHtmlDialog2:PropTypes.func.isRequired,
    silenceHtmlDialog2:PropTypes.func.isRequired,
    dictionary_strategy:PropTypes.object.isRequired,

  };
}
