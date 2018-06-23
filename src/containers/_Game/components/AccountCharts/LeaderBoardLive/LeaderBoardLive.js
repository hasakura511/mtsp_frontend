import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate } from "../../../../../util";
import classes from "./LeaderBoardLive.css";
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
export default class LeaderBoardLive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lookback: '',
      performance:{},
      performanceLoading:true,
      performanceError:'',
      isPopoverOpen :{},
      filter:'Overall',
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
        var dataJson= JSON.parse(performance.leaderboard);
        performance.leaderboard=dataJson;
        Object.keys(performance.leaderboard).map(key => {
          performance.leaderboard[key]['chip_id']=key;

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
      if (message) {
        self.props.addTimedToaster(
          {
            id: "board_notice_" + Math.random().toFixed(3),
            text: message
          },
          5000
          );
      } else if (message == "OK") {

        self.props.initializeLive(reinitialize);
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
      if (message) {
        self.props.addTimedToaster(
          {
            id: "board_notice_" + Math.random().toFixed(3),
            text: message
          },
          5000
          );
      } else if (message == "OK") {

        self.props.initializeLive(reinitialize);
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
      this.getData();

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
    var content=<div>test</div>;

    if (performance && performance.leaderboard) {
        console.log(performance);
        console.log(performance.chip_tiers);
    }
    return (
        <div className={classes.LeaderBoardLive}>
        
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

        <div className={classes.LeaderBoardLive} style={{margin:"0px", background:self.props.themes.live.dialog.tab_color_active}} >

        <div className={classes.Tabs} style={{  margin:"0px", background:self.props.themes.live.dialog.tab_color_active,  paddingTop:"5px", "float":"left","width": "90%", "textAlign": "center"}}>
        <center><h3> 
        {Object.keys(performance.chip_tiers).map(key => {
                            var item=performance.chip_tiers[key];
                            return ( 
                            
                            <span key={item} className={classes.Tab}  style={{marginTop: "0px", background:self.props.themes.live.dialog.tab_color_active}} onClick={() => {
                                console.log("Apply Filter");
                                self.getData('Paper-Live', key);

                                self.setState({filter:item});
                            }}>
                            <span className={filter === item ? classes.active : ""}>{item} </span> &nbsp;&nbsp;&nbsp;  
                          </span>
                
                          );
                        })} 
        </h3></center>

        </div>
        

                    <div style={{margin:"0px", paddingTop:"8px", background:self.props.themes.live.dialog.tab_color_active, "float":"right", "width": "10%", "textAlign": "right"}}>
                        <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                    </div>
            <div style={{"clear": "both"}}></div>
           
           

          <div className={classes.ChartContainer} style={{
                                        zIndex:3

                                    }}>

                                    

          <ReactTable
          
          data={Object.keys(performance.leaderboard).map(key=> { 
            //console.log(account);
            var item=performance.leaderboard[key];

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
                  accessor: "rank",
                  Cell: props => {
         
                    var chip=props.original;
                    chip.display=props.original.account_chip_text;
                    chip.tier = "Paper-Live";
                    chip.status = 'unlocked';
                    chip.isReadOnly=true;
                    chip.starting_value=props.original.account_chip_text;
                    chip.account_value=props.original.account_chip_text;
                    chip.total_margin="";
                    return (
                    <div>
                    <div style={{'float':'left', width:'18%', height:"12px", lineHeight:"12px", marginTop:"8px"}}>
                    <h3>{props.value}.</h3>

                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <div  style={{'float':'left', width:'41%'}}>
                    <Chip chip={chip} isReadOnly={true} />&nbsp;&nbsp;
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <div  style={{'float':'left', width:'41%'}}>
                    {props.original.player}
                    </div>

                    <div style={{"clear": "both"}}></div>
  

                </div>)
                  }, // Custom cell components!,


                },
                {
                  Header: props => (
                    <span style={{background:self.props.themes.live.dialog.table_left_background}}>
                     Cumulative %Chg
                     </span>),
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_left_background
                  },
                  accessor: "pnl_cumpct",
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
                    </center>
                    </span>
                  ), // Custom cell components!,

                },
                {
                  Header: props => (
                    <span style={{background:self.props.themes.live.dialog.table_left_background}}>
                    Prev % Change
                  </span>),
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_left_background
                  },
                  
                  accessor: "pnl_pct",
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
               },
               {
                  Header: props => (
                    <span style={{background:self.props.themes.live.dialog.table_right_background}}>Age
                  </span>),
                  accessor: "age",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_right_background
                  },
                  Cell: props => {
                    var chip=props.original;
                    chip.display=props.original.account_chip_text;
                    chip.tier = "Paper-Live";
                    chip.status = 'unlocked';
                    chip.chip_tier_text=chip.filter;
                    chip.isReadOnly=true;
                    return (
                      <span className='number'><center>
                        

                      <a href={'JavaScript:console.log("account performance")'} style={{ cursor:'pointer'  }} onClick={() => {  
                          
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
                    <span style={{background:self.props.themes.live.dialog.table_right_background}}>
                    Market in Portfolio
                  </span>),
                  accessor: "num_markets",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_right_background
                  },

                  Cell: props => (
                    <span className='number'><center>
                        
                    <a href='JavaScript:console.log("popover called")' style={{ cursor:'pointer'  }} 
                    
                    ref={ref => self[props.original.rank] = ref}
                    onClick={() => {  
                                var portfolio=JSON.parse(props.original.portfolio)
                                self.items=portfolio.map(item => {
                                    return self.state.performance.market_dict[item]
                                });
                                console.log(self.items)
                                self.handleClick(props.original.rank);
                      }}>{props.value}</a>
                    <Popover
                        placement='left'
                        container={self}
                        target={self[props.original.rank]}
                        show={self.state.isPopoverOpen[props.original.rank] ? true : false }
                        onHide={self.handleClose.bind(this)} 
                        hideWithOutsideClick={true}
                        containerStyle={{ 
                            marginTop: self.props.gap + "px",
                           
                        }}
                        style={{

                            width: "400px",
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
                    <span style={{background:self.props.themes.live.dialog.table_right_background}}>
                     Preview Board
                  </span>),
                  accessor: "account_id",
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_right_background
                  },
                  Cell: props => {
                    var chip=props.original;
                    chip.display=props.original.account_chip_text;
                    chip.tier = "Paper-Live";
                    chip.status = 'unlocked';
                    chip.isReadOnly=true;
                    chip.position=toSystemNum(chip.chip_locations)
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
                                var board_config=JSON.parse(props.original.board_config)
                                console.log(self.leader_board_config)
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
                                  self.handleClick(props.original.rank + 'board');
                      }}>
                      <img src="/images/preview_board.png" width={30} height={30} />
                      </a>
                      <Popover
                        placement='bottom'
                        container={self}
                        target={this}
                        show={self.state.isPopoverOpen[props.original.rank + 'board'] ? true : false }
                        onHide={self.handleClose.bind(this)} 
                        hideWithOutsideClick={true}
                        containerStyle={{ 
                            marginTop: self.props.gap + -innerHeight + 88 + "px",
                           
                        }}
                        style={{

                            width: "100%",
                            height: "100%",
                            
                        }}
                        >
                        <div>
                            
                        <table style={{border:"none", borderCollapse: "collapse",
        background:self.props.themes.live.dialog.background_inner,
        color:self.props.themes.live.dialog.text,
        fontSize:"20px" }}>
          <thead  style={{border:"none"}}>
            <tr style={{border:"none"}}>
            <th  style={{border:"none"}}>
                Overall
                </th>
                <th  style={{border:"none"}}>
                <center>
                Player
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Cumulative %Chg
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Previous %Chg
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                 Current Bet
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                  Previous Bet
                </center>
                </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{border:"1px", "padding":"1px"}}>
                <td style={{borderLeft:"1px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <div>
                    <div style={{'float':'left', width:'20%', marginTop:"37px"}}>
                    <h3>{chip.rank}.</h3>

                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <div  style={{'float':'left', width:'80%'}}>
                    <Chip chip={chip} isReadOnly={true} />&nbsp;&nbsp;
                    </div>

                    <div style={{"clear": "both"}}></div>
                </div>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                   {chip.player}
                </center>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                          
                        {parseFloat(chip.pnl_cumpct) ? (
                          <span style={parseFloat(chip.pnl_cumpct) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                        <b>
                        {parseFloat(chip.pnl_cumpct).toLocaleString("en")} %
                        </b>
                        </span>
                        ) : (
                          <span style={{color:self.props.themes.live.dialog.text_color}}>
                        <b>
                        {parseFloat(chip.pnl_cumpct).toLocaleString("en")} % 
                        </b>
                        </span>
                        )}
                      
                      </center>

                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                          
                          {parseFloat(chip.pnl_pct) ? (
                          <span style={parseFloat(chip.pnl_pct) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                        <b>
                        {parseFloat(chip.pnl_pct).toLocaleString("en")} %
                        </b>
                        </span>
                        ) : (
                          <span style={{color:self.props.themes.live.dialog.text_color}}>
                        <b>
                        {parseFloat(chip.pnl_pct).toLocaleString("en")} % 
                        </b>
                        </span>
                        )}
              </center>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                {chip.last_selection}
                </center>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black", borderRight:"1px solid black"}}>
                <center>
                  {chip.prev_selection}
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
                            paddingTop: "150px",
                            paddingBottom: "100px",
                            paddingRight: "150px",
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
                {
                    Header: props => (
                      <span style={{background:self.props.themes.live.dialog.table_right_background}}>
                       Copy Board
                    </span>),
                    accessor: "account_id",
                    headerStyle: {
                      background:self.props.themes.live.dialog.table_right_background
                    },
                    Cell: props =>{
                      var copyboard='copy_board_' + props.original.rank;

                      return (

                      <span className='number'><center>
                        
                      <a href='JavaScript:console.log("popover called")' style={{ cursor:'pointer'  }} 
                      
                      ref={ref => self[copyboard] = ref}
                      onClick={() => {  
                              if (!performance.enable_board_copy)
                                return;
                              if (performance.enable_board_copy_message) {
                                self.props.addTimedToaster(
                                  {
                                    id: "board_notice_" + Math.random().toFixed(3),
                                    text: performance.enable_board_copy_message
                                  },
                                  5000
                                  );
                              } else {
                                self.props.showDialog(
                                " Are you sure you want to copy the board?",
                                " Your board will be replaced with " + props.original.player + "'s board and all your chips will be placed in the Off location." ,
                                () => {
                                    console.log("Copy Board Start");
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
                      <span style={{background:self.props.themes.live.dialog.table_right_background}}>
                       Copy Board & Chip
                    </span>),
                    accessor: "account_id",
                    headerStyle: {
                      background:self.props.themes.live.dialog.table_right_background
                    },
                    Cell: props =>{
                      var copyboard='copy_board_chip_' + props.original.rank;

                      return (

                      <span className='number'><center>
                        
                      <a href='JavaScript:console.log("popover called")' style={{ cursor:'pointer'  }} 
                      
                      ref={ref => self[copyboard] = ref}
                      onClick={() => {  
                              if (!performance.enable_board_chip_copy)
                                return;
                              if (performance.enable_board_chip_copy_message) {
                                self.props.addTimedToaster(
                                {
                                  id: "board_notice_" + Math.random().toFixed(3),
                                  text: performance.enable_board_chip_copy_message
                                },
                                5000
                                );
                              } else {
                              
                                self.props.showDialog(
                                " Are you sure you want to copy the board & chip?",
                                " Your board will be replaced with " + props.original.player + "'s board and all your chips other than the new chip will be placed in the Off location." ,
                                  () => {
                                    console.log("Copy Board & Chip Start");
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

          defaultPageSize={Object.keys(performance.leaderboard).length < 10 ? 10 : Object.keys(performance.leaderboard).length}
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
    performance_account_id: PropTypes.string.isRequired,
    toggle:PropTypes.func,
    initializeHeatmap:PropTypes.func,
    themes:PropTypes.object,
    dictionary_strategy:PropTypes.object.isRequired,
    showDialog:PropTypes.func.isRequired,
    silenceDialog:PropTypes.func.isRequired,
    addTimedToaster: PropTypes.func.isRequired,
    initializeLive:PropTypes.func.isRequired
  };
}
