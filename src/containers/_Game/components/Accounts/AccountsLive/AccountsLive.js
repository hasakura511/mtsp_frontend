import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate } from "../../../../../util";
import classes from "./AccountsLive.css";
import Spinner from "../../../../../components/UI/Spinner/Spinner";
import axios from "../../../../../axios-gsm";
import chipIcon from "../../../../../assets/images/chip-icon.png";
import lossIcon from "../../../../../assets/images/loss-icon.png";
import gainIcon from "../../../../../assets/images/gain-icon.png";
import ReactTable from "react-table";
import * as actions from "../../../../../store/actions";
import Chip from "../../_Chip/_Chip";
import Panel from "../../../containers/Panel/Panel";
import Popover  from 'react-simple-popover'
import { toSystem, toAntiSystem, toSystemNum } from "../../../Config";
import ClockLoader from "../../../../../components/UI/ClockLoader/ClockLoader";

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


const dispatchToProps = dispatch => {
  return {
    initializeHeatmap:(account_id, link, sym) => {
      dispatch(actions.initializeHeatmap(account_id, link, sym))
    },
    showPerformance:(action_id, chip) => {
        dispatch(actions.showPerformance(action_id, chip))
    },
    showDialog() {
      dispatch(actions.showDialog(...arguments));
    },
    silenceDialog() {
      dispatch(actions.silenceDialog());
    },
    addTimedToaster: toaster => {
      dispatch(actions.addTimedToaster(toaster, 5000))
  },
    
  };
};
@connect(stateToProps, dispatchToProps)
export default class AccountsLive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lookback: '',
      performance:props.performance,
      performanceLoading:false,
      performanceError:'',
      isPopoverOpen :{},
      filter:'Overall',
      refreshing: false,
      // endDate: 20180201
    };
  }

  componentWillReceiveProps(newProps) {
      if (newProps.performance) {
          this.setState({performance:newProps.performance})
      }
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

  getData = (tier='Paper-Live', chip_tier=0) => {
    var self=this;
    axios
    .post("/utility/leaderboard_live/", {
      /**
       * @example {"portfolio": ["TU", "BO"], "systems": ["prev1", "prev5"], "target": 500, "account": 5000}
       *
       */
      username: self.props.email,
      tier:tier,
      chip_tier:chip_tier,
    })
    .then(response => {
      /**
       * @namespace {Performance}
       */
      var performance = response.data;
      if (performance.data_not_available) {
        self.props.addTimedToaster(
          {
            id: "board_notice_" + Math.random().toFixed(3),
            text: performance.data_not_available_message
          },
          5000
          );
        /*
        var performanceError=performance.data_not_available_message;
        this.setState({
          performanceLoading: false,
          performanceError: performanceError
        });
        */
      } 
        console.log('leaderboard data')
        console.log(performance);
        var dataJson= JSON.parse(performance.accounts);
        performance.accounts=dataJson;
        Object.keys(performance.accounts).map(key => {
          performance.accounts[key]['chip_id']=key;

        })
        
        console.log(performance);

        this.setState({
            performanceError: '',
            performanceLoading: false,
            performance
          });
        }
    )
    .catch(performanceError => {
      console.log(performanceError);
      this.setState({
        performanceLoading: false,
        performanceError: performanceError
      });
    });
  }

  
  copyBoard = (leader_board_config) => {
    var self=this;
    
    axios
    .post("/utility/update_board_live/", {
      /**
       * @example {"portfolio": ["TU", "BO"], "systems": ["prev1", "prev5"], "target": 500, "account": 5000}
       *
       */
      username: self.props.email,
      board_config: leader_board_config
    })
    .then(response => {
      /**
       * @namespace {Performance}
       */
      var res = response.data;
      var message=res.message;
      var reinitialize=res.reinitialize;
      if (message != "OK") {
        self.props.addTimedToaster(
          {
            id: "board_notice_" + Math.random().toFixed(3),
            text: message
          },
          5000
          );
          self.setState({refreshing:false})
      } else {

        const loaded = () => {
          self.setState({refreshing:false})
          self.props.silenceDialog();
          self.props.toggle();
          
        }
        self.props.initializeLive(reinitialize, loaded);
        
      }
      
      
    })
    .catch(performanceError => {
      console.log(performanceError);
      if (performanceError) {
        self.props.addTimedToaster(
          {
            id: "board_notice_" + Math.random().toFixed(3),
            text: performanceError.toString()
          },
          5000
          );
      }
      
     
    });
  }

  copyBoardChip = (leader_account_id, leader_chip_id, leader_board_config) => {
    var self=this;
    axios
    .post("/utility/copy_account_live/", {
      /**
       * @example {"portfolio": ["TU", "BO"], "systems": ["prev1", "prev5"], "target": 500, "account": 5000}
       *
       */
      username: self.props.email,
      board_config: leader_board_config,
      leaderboard_account_id:leader_account_id,
      leaderboard_chip_id:leader_chip_id,
    })
    .then(response => {
      /**
       * @namespace {Performance}
       */
      var res = response.data;
      var message=res.message;
      var reinitialize=res.reinitialize;
      if (message != "OK") {
        self.props.addTimedToaster(
          {
            id: "board_notice_" + Math.random().toFixed(3),
            text: message
          },
          5000
          );
          self.setState({refreshing:false})
      } else  {

        const loaded = () => {
          self.setState({refreshing:false})
          self.props.silenceDialog();
          self.props.toggle();
          
        }
        self.props.initializeLive(reinitialize, loaded);
      }
      
      
    })
    .catch(performanceError => {
      console.log(performanceError);
      if (performanceError) {
        self.props.addTimedToaster(
          {
            id: "board_notice_" + Math.random().toFixed(3),
            text: performanceError.toString()
          },
          5000
          );
      }
      
     
    });
  }
  componentDidMount() {
      //this.getData();

  }

  
  handleEnter(e) {
    this.setState({ isPopoverOpen: true });
    
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
    var { performance, lookback, performanceLoading, performanceError, filter } = this.state;
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

    if (performance && performance.accounts) {
        console.log(performance);
        //console.log(performance.chip_tiers);
    }

    
    if (this.state.refreshing) {
      return ( 

        <div style={{ height: outerHeight + 100,
                      top: 0, left:0, 
                      position: 'absolute', 
                      width: innerWidth + 2000,
                      marginLeft: "-1000px",
                      marginTop: "-100px",
                      overflow: "hide",
                      background:self.props.themes.table_background }}>
          
          <center>
            <br/>
            <br/>
            <br/>
           <ClockLoader show={true} />
           <br/>
           <b>Please wait while we load your board. This could take a couple of minutes.</b>
          </center>
        </div>
      );


    }
    return (
        <div className={classes.AccountsLive}>
        
          {performanceLoading ? (
                <div>
                    <Spinner />
                </div>
        ) : performanceError ? (
          <div style={{height: innerHeight - 172,  background: self.props.themes.table_background} }>

          <center >  
          <br/>
          <h4>
            {performanceError ? performanceError + "" :
              "Data not Available"}
          </h4>
          </center>
          
          </div>
        ) : (

        <div className={classes.AccountsLive} style={{margin:"0px", background:self.props.themes.table_background}} >


                    <div style={{margin:"0px", paddingTop:"8px", background:self.props.themes.table_background, "float":"right", "width": "10%", "textAlign": "right"}}>
                        <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                    </div>
            <div style={{"clear": "both"}}></div>
           
           

          <div className={classes.ChartContainer} style={{
                                        zIndex:3

                                    }}>

                                    

          <ReactTable
          
          data={Object.keys(performance.accounts).map(key=> { 
            //console.log(account);
            var item=performance.accounts[key];

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
                  Header: "Player",
                  accessor: "account_value",
                  width: 240,
                  Cell: props => {
         
                    var chip=props.original;
                    chip.display=props.original.account_chip_text;
                    chip.tier = props.original.tier;
                    chip.status = 'unlocked';
                    chip.isReadOnly=true;
                    chip.starting_value=props.original.account_chip_text;
                    chip.account_value=props.original.account_chip_text;
                    chip.total_margin="";

                    var items=[];

                    //<div  style={{marginTop:"12px", minWidth: '235px'}}>
                    items.push(
                    <div key={'item-1'} style={{'float':'left', minWidth:'25px', height:"12px", fontSize:'24px', marginTop:"12px"}}>
                    </div>)
                    items.push(
                      <div key={'item-2'} style={{'float':'left', minWidth: '60px', height:'60px', padding:"1px", marginTop:"1px", marginBottom:"-10px"}}>
                      <Chip chip={chip} isReadOnly={true} account_chip_text={props.original.account_chip_text} />&nbsp;&nbsp;
                      </div>
                      )
                    items.push(

                    <div key={'item-3'} style={{'float':'left', minwidth:'150px', marginTop:"20px"}}>
                      My Graphs
                    </div>
                    )
                    items.push(

                    <div key={'item-4'} style={{"clear": "both"}}></div>
                    )
                    return items;
  

                  }, // Custom cell components!,


                },
                {
                  Header: props => (
                    <span style={{background:self.props.themes.table_background}}>
                     Account Value
                     </span>),
                  headerStyle: {
                    background:self.props.themes.table_background
                  },
                  accessor: "pnl_cumpct",
                  Cell: props => (
                    <span className='number'><center>
                    {parseFloat(props.value) ? (
                      <span style={parseFloat(props.value) > 0 ? {color:self.props.themes.text_gain} : {color:self.props.themes.text_loss}} >
                    <b>
                    $ {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })}
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.text_color}}>
                    <b>
                   $ {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                    </b>
                    </span>
                    )}
                    </center>
                    </span>
                  ), // Custom cell components!,

                },
                {
                  Header: props => (
                    <span style={{background:self.props.themes.table_background}}>
                     Cumulative %
                     </span>),
                  headerStyle: {
                    background:self.props.themes.table_background
                  },
                  accessor: "pnl_cumpct",
                  Cell: props => (
                    <span className='number'><center>
                    {parseFloat(props.value) ? (
                      <span style={parseFloat(props.value) > 0 ? {color:self.props.themes.text_gain} : {color:self.props.themes.text_loss}} >
                    <b>
                   {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.text_color}}>
                    <b>
                   {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </span>
                    )}
                    </center>
                    </span>
                  ), // Custom cell components!,

                },
              ]},
              {
              Header: "Portfolio Settings",
              columns: [
               {
                  Header: props => (
                    <span style={{background:self.props.themes.table_background}}>Age
                  </span>),
                  accessor: "age",
                  headerStyle: {
                    background:self.props.themes.table_background
                  },
                  Cell: props => {
                    var chip=props.original;
                    chip.display=props.original.account_chip_text;
                    chip.tier = props.original.tier;
                    chip.status = 'unlocked';
                    chip.chip_tier_text=chip.filter;
                    chip.isReadOnly=true;
                    return (
                      <span className='number'><center>
                        

                      <a href={'JavaScript:console.log("account performance")'} style={{ cursor:'pointer'  }} title={"Show Account Performance."} onClick={() => {  
                          
                                // self.props.toggle();
                                self.props.showPerformance(props.original.account_id, chip);
                        }}>
                        {props.value}
                        </a>
                    
                      </center></span>
                    )
                  }, // Custom cell components!,

                },
                {
                  Header: props => (
                    <span style={{background:self.props.themes.table_background}}>
                    Portfolio
                  </span>),
                  accessor: "num_markets",
                  headerStyle: {
                    background:self.props.themes.table_background
                  },

                  Cell: props => (
                    <span className='number'><center>
                        
                    <a href='JavaScript:console.log("popover called")' style={{ cursor:'pointer'  }} 
                    title={"Show Account Portfolio."}
                    ref={ref => self[props.original.rank] = ref}
                    onClick={() => {  
                                var portfolio=props.original.portfolio
                                self.items=portfolio.map(item => {
                                    return self.state.performance.margins[item]
                                });
                                console.log(self.items)
                                self.handleClick(props.original.rank);
                      }}>{props.value}</a>
                    <Popover
                        placement='bottom'
                        container={self}
                        target={self[props.original.rank]}
                        show={self.state.isPopoverOpen[props.original.rank] ? true : false }
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
                {
                  Header: props => (
                    <span style={{background:self.props.themes.table_background}}>
                     Margin %
                     </span>),
                  headerStyle: {
                    background:self.props.themes.table_background
                  },
                  accessor: "margin_percent",
                  Cell: props => (
                    <span className='number'><center>
                    {parseFloat(props.value) ? (
                      <span style={parseFloat(props.value) > 0 ? {color:self.props.themes.text_gain} : {color:self.props.themes.text_loss}} >
                    <b>
                   {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.text_color}}>
                    <b>
                   {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </span>
                    )}
                    </center>
                    </span>
                  ), // Custom cell components!,

                },
                {
                  Header: props => (
                    <span style={{background:self.props.themes.table_background}}>
                     Auto
                     </span>),
                  headerStyle: {
                    background:self.props.themes.table_background
                  },
                  accessor: "recreate_if_margin_call",
                  Cell: props => (
                    <span className='number'><center>{props.value}</center></span>
                  ), // Custom cell components!,

                },
                {
                  Header: props => (
                    <span style={{background:self.props.themes.table_background}}>
                     Recreate
                     </span>),
                  headerStyle: {
                    background:self.props.themes.table_background
                  },
                  accessor: "recreate",
                  Cell: props => (
                    <span className='number'><center>{props.value}</center></span>
                  ), // 

                },
                {
                    Header: props => (
                      <span style={{background:self.props.themes.table_background}}>
                       Edit
                    </span>),
                    accessor: "account_id",
                    headerStyle: {
                      background:self.props.themes.table_background,
                    },
                    Cell: props =>{
                      var copyboard='copy_board_' + props.original.rank;

                      return (

                      <span className='number'><center>
                        
                      <a href='JavaScript:console.log("popover called")' style={{ cursor:'pointer'  }} 
                      
                      ref={ref => self[copyboard] = ref}
                      onClick={() => {  
                        if (performance.enable_board_copy_message) {
                          self.props.addTimedToaster(
                            {
                              id: "board_notice_" + Math.random().toFixed(3),
                              text: performance.enable_board_copy_message
                            },
                            5000
                            );
                        }
                              if (!performance.enable_board_copy) {
                               
                                return;
                              }
                              else {
                                self.props.showDialog(
                                " Are you sure you want to copy the board?",
                                " Your board will be replaced with " + props.original.player + "'s board and all your chips will be placed in the Off location." ,
                                () => {
                                    console.log("Copy Board Start");
                                    self.setState({refreshing:true})
                                    self.copyBoard(props.original.board_config)

                                    self.props.silenceDialog();

                                  },
                                  null,
                                  "OK",
                                  "Cancel"
                              );
                            }
                        }}>
                        {performance.enable_board_copy ?
                          <img src="/images/copy_board_enabled.png"  height={30} />
                          :
                          <img src="/images/copy_board_disabled.png"  height={30} />
                        }

                          </a>
                     
                      </center></span>

                      
                    )// Custom cell components!,
  
                   },
                  },
                  {
                    Header: props => (
                      <span style={{background:self.props.themes.table_background}}>
                       Delete
                    </span>),
                    accessor: "account_id",
                    headerStyle: {
                      background:self.props.themes.table_background,
                      whiteSpace: 'unset' 
                    },
                    Cell: props =>{
                      var copyboard='copy_board_chip_' + props.original.rank;

                      return (

                      <span className='number'><center>
                        
                      <a href='JavaScript:console.log("popover called")' style={{ cursor:'pointer'  }} 
                      
                      ref={ref => self[copyboard] = ref}
                      onClick={() => {  
                        if (performance.enable_board_chip_copy_message) {
                          self.props.addTimedToaster(
                          {
                            id: "board_notice_" + Math.random().toFixed(3),
                            text: performance.enable_board_chip_copy_message
                          },
                          5000
                          );
                        }
                        if (!performance.enable_board_chip_copy) {
                               
                                
                                return;
                        } else {
                              
                                self.props.showDialog(
                                " Are you sure you want to copy the board & chip?",
                                " Your board will be replaced with " + props.original.player + "'s board and all your chips other than the new chip will be placed in the Off location." ,
                                  () => {
                                    console.log("Copy Board & Chip Start");
                                    self.setState({refreshing:true})

                                    self.copyBoardChip(props.original.account_id, props.original.chip_id, props.original.board_config)
                                    self.props.silenceDialog();
                                    
                                  },
                                  null,
                                  "OK",
                                  "Cancel"
                              );
                            }
                        }}>
                        {performance.enable_board_chip_copy ?
                          <img src="/images/copy_board_chip_enabled.png"  height={30} />
                          :
                          <img src="/images/copy_board_chip_disabled.png"  height={30} />
                        }

                          </a>
                     
                      </center></span>

                      
                    )// Custom cell components!,
  
                   },

                   
  
                   
                  },
              ],
              
            },
            
          ]}

          defaultPageSize={Object.keys(performance.accounts).length < 10 ? 10 : Object.keys(performance.accounts).length}
          minRows={10}
          style={{
            width:"100%",
            height:innerHeight - 170,
            maxHeight:"100%",
            overflow:"auto",
            fontSize:"12px",
            fontWeight: 800,
          }}
          defaultSorted={[{
            id   : 'rank',
            desc : false,
          }]}
          className="-striped -highlight"
          showPagination={false}
        />
          {/*
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
        */}
      
        </div>
        </div>
        )}
         
                        
        </div>
    );
  }

  static propTypes = {
   
    //performance: PropTypes.object,
    //position: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    //performance_account_id: PropTypes.string.isRequired,
    toggle:PropTypes.func,
    initializeHeatmap:PropTypes.func,
    themes:PropTypes.object,
    //dictionary_strategy:PropTypes.object.isRequired,
    //showDialog:PropTypes.func.isRequired,
    //silenceDialog:PropTypes.func.isRequired,
    addTimedToaster: PropTypes.func.isRequired,
    //initializeLive:PropTypes.func.isRequired,
    performance:PropTypes.object.isRequired
  };
}