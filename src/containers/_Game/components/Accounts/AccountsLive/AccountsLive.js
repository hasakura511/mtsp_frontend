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
import OrderDialog from "../../../containers/OrderDialog/OrderDialog";
import Order from "../../Order/Order";
import MiniAccountChart from "../MiniAccountChart/MiniAccountChart";
import AccountsNew from "../AccountsNew/AccountsNew";


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
export default class AccountsLive extends Component {
  


  static propTypes = {
    showHtmlDialog:PropTypes.func.isRequired,
    silenceHtmlDialog:PropTypes.func.isRequired,
    showHtmlDialog2:PropTypes.func.isRequired,
    silenceHtmlDialog2:PropTypes.func.isRequired,
    dictionary_strategy:PropTypes.object.isRequired,
    isPopup:PropTypes.bool,
    toggle:PropTypes.func,
    initializeHeatmap:PropTypes.func,
    themes:PropTypes.object,
    addTimedToaster: PropTypes.func.isRequired,
    initializeLive:PropTypes.func.isRequired,
    performance:PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);

    var data=props.performance;
    Object.keys(data.accounts).map(key => {
      data.accounts[key]['chip_id']=key;
      data.accounts[key]['starting_value']=parseInt(data.accounts[key]['starting_value']);
      data.accounts[key]['account_value']=parseInt(data.accounts[key]['account_value']);
      //console.log(data.accounts[key]);
    })

    this.state = {
      lookback: '',
      performance:data,
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

        var update_bets="";
        if (res.update_bets)
          update_bets=res.update_bets;
        self.props.initializeLive(reinitialize, update_bets);
        
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
  

  delAccount = (chip_id) => {
    var self=this;
    
    axios
    .post("/utility/delete_account/", {
      /**
       * @example {"portfolio": ["TU", "BO"], "systems": ["prev1", "prev5"], "target": 500, "account": 5000}
       *
       */
      username: self.props.email,
      chip_id:chip_id,
    })
    .then(response => {

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

          //self.setState({refreshing:false})
          self.props.initializeLive(true);
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
    /*if (this.themes.live.dashboard != undefined) {
      bgColor=this.themes.live.dashboard.background;
      bgText=this.themes.live.dashboard.text;
      bdColor=this.themes.live.dashboard.lines;
      bhColor=this.themes.live.dashboard.lines_horizontal_middle;
    }
    */
    var themes=performance.themes;
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
                      background:themes.table_background }}>
          
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
          <div style={{height: innerHeight - 172,  background: themes.table_background} }>

          <center >  
          <br/>
          <h4>
            {performanceError ? performanceError + "" :
              "Data not Available"}
          </h4>
          </center>
          
          </div>
        ) : (

        <div className={classes.AccountsLive} style={{margin:"0px", background:themes.table_background, height:"100%"}} >


                    <div style={{margin:"0px", paddingTop:"8px", background:themes.table_background, "float":"right", "width": "10%", "textAlign": "right"}}>
                        <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                    </div>
                    <div style={{margin:"0px", paddingTop:"8px", background:themes.table_background, "float":"right", "width": "80%", "textAlign": "right"}}>
                    <center><h3>List of Accounts</h3></center>
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
                  Header: "Account Value",
                  accessor: "account_value",
                  width: 250,
                  Cell: props => {
         
                    var chip = Object.assign({}, props.original); 
                    chip.display=props.original.account_chip_text;
                    chip.isReadOnly=false; //true;
                    if (this.props.isPopup)
                      chip.isAccountChip=true;
                    
                    chip.tier = props.original.tier;

                    
                    var items=[];

                    //<div  style={{marginTop:"12px", minWidth: '235px'}}>
                    //items.push(
                    //<div key={'item-1'} style={{'float':'left', minWidth:'25px', height:"12px", fontSize:'24px', marginTop:"12px"}}>
                    //</div>)
                    items.push(
                      <div key={'item-2'} style={{'float':'left', minWidth: '60px', height:'60px', padding:"1px", marginTop:"1px", marginBottom:"-10px"}}>
                      <Chip chip={chip} isReadOnly={true} account_chip_text={props.original.account_chip_text} />&nbsp;&nbsp;
                      </div>
                      )
                    items.push(

                    <div key={'item-3'} style={{'float':'left', width:'100px', marginTop:"-5px"}}>
                      <MiniAccountChart 
                        chartData={performance.sparklines} 
                        chart_id={props.original.key} 
                        accountsData={performance} />
                    </div>
                    )
                    items.push(
                      <div key={'item-4'} style={{'float':'left', marginLeft: "15px", minwidth:'60px', marginTop:"20px"}}>
                        {parseFloat(props.value) ? (
                        <span style={props.value ? {color:'black'} : parseFloat(props.value) > 0 ? {color:themes.text_gain} : {color:themes.text_loss}} >
                      <b>
                      $ {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })}
                      </b>
                      </span>
                      ) : (
                        <span style={{color:themes.text_color}}>
                      <b>
                     $ {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} 
                      </b>
                      </span>
                      )}
                      </div>

                    )
                    items.push(

                    <div key={'item-5'} style={{"clear": "both"}}></div>
                    )
                    return (
                      <span className='number'><center>
                        
  
                      <a 
                      href={'JavaScript:console.log("account performance")'} 
                      style={{ cursor:  'pointer'  }} 
                      title={"Show Account Performance."} 
                      onClick={() => {  
                              chip.isAccountView=true;
                              chip.isReadOnly=false;
                              chip.display=props.original.account_chip_text;
                              chip.isReadOnly=false; //true;
                              chip.isAccountChip=true;
                              
                              chip.tier = props.original.tier;
                              self.props.showHtmlDialog2(<Order
                                chip={chip}
                                dictionary_strategy={self.props.dictionary_strategy}
                                isLive={true}
                                isPerformance={true}
                                isAccount={true}
                                performance_account_id={props.original.account_id}
                                rankingLoading={false}
                                toggle={() => {
                                  self.props.silenceHtmlDialog2();
                                }}
                                themes={this.themes}
                                close={() => {
                                  self.props.silenceHtmlDialog2();
                                }}
                                />);
                                //self.props.showPerformance(props.original.account_id, chip);
                      }}
                      >{items}</a>
                      </center></span>
                      );
                      

                  }, // Custom cell components!,


                },
                
                {
                  Header: props => (
                    <span style={{background:themes.table_background}}>
                     Cumulative %
                     </span>),
                  headerStyle: {
                    background:themes.table_background
                  },
                  accessor: "pnl_cumpct",
                  Cell: props => (
                    <span className='number'><center>
                    {parseFloat(props.value) ? (
                      <span style={parseFloat(props.value) > 0 ? {color:themes.text_gain} : {color:themes.text_loss}} >
                    <b>
                   {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </span>
                    ) : (
                      <span style={{color:themes.text_color}}>
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
                  <span style={{background:themes.table_background}}>
                   Prev %
                   </span>),
                headerStyle: {
                  background:themes.table_background
                },
                accessor: "pnl_pct",
                Cell: props => (
                  <span className='number'><center>
                  {parseFloat(props.value) ? (
                    <span style={parseFloat(props.value) > 0 ? {color:themes.text_gain} : {color:themes.text_loss}} >
                  <b>
                 {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                  </b>
                  </span>
                  ) : (
                    <span style={{color:themes.text_color}}>
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
                  <span style={{background:themes.table_background}}>Age
                </span>),
                accessor: "age",
                headerStyle: {
                  background:themes.table_background
                },
                Cell: props => {
                  var chip = Object.assign({}, props.original); 
                  chip.display=props.original.account_chip_text;
                  //chip.tier = props.original.tier;
                  //chip.status = 'unlocked';
                  //chip.chip_tier_text=chip.filter;
                  chip.isReadOnly=false; //true;
                  chip.isAccountChip=true;
                  return (
                    <span className='number'><center>
                      

                    <a 
                    href={'JavaScript:console.log("account performance")'} 
                    style={{ cursor:  'pointer'  }} 
                    title={"Show Account Performance."} 
                    onClick={() => {  
                        
                              chip.isAccountView=true;
                              chip.isReadOnly=false; //true;
                              chip.isAccountChip=true;
                              self.props.showHtmlDialog2(<Order
                                chip={chip}
                                dictionary_strategy={self.props.dictionary_strategy}
                                isLive={true}
                                isPerformance={true}
                                isAccount={true}
                                performance_account_id={props.original.account_id}
                                rankingLoading={false}
                                toggle={() => {
                                  self.props.silenceHtmlDialog2();
                                }}
                                themes={this.themes}
                                close={() => {
                                  self.props.silenceHtmlDialog2();
                                }}
                                />);
                                //self.props.showPerformance(props.original.account_id, chip);
                                
                          }}>
                      {props.value}
                      </a>
                  
                    </center></span>
                  )
                }, // Custom cell components!,

              },
            ]},
            {
              Header: "Portfolio Settings",
              headerStyle: {
                background:self.props.themes.live.dialog.table_left_background
              },
         
              columns: [
               
                {
                  Header: props => (
                    <span style={{background:self.props.themes.live.dialog.table_left_background}}>
                    Portfolio
                  </span>),
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_left_background
                  },

                  accessor: "num_markets",

                  Cell: props => {
                    var chip = Object.assign({}, props.original); 
                    chip.display=props.original.account_chip_text;
                    //chip.tier = props.original.tier;
                    //chip.status = 'unlocked';
                    //chip.chip_tier_text=chip.filter;
                    chip.isReadOnly=false; //true;
                    chip.isAccountChip=true;
                    
                    return (
                    <span className='number'><center>
                        
                    <a href='JavaScript:console.log("popover called")' style={{ cursor:'pointer'  }} 
                    title={"Show Account Portfolio."}
                    ref={ref => self[props.original.rank] = ref}
                    /*
                    onClick={() => 
                      {  
                                var portfolio=props.original.portfolio
                                self.items=portfolio.map(item => {
                                    return self.state.performance.margins[item]
                                });
                                console.log(self.items)
                                self.handleClick(props.original.rank);
                      }}
                      */
                     onClick={() => {  
                        
                      chip.isReadOnly=false; //true;
                      chip.isAccountChip=true;
                      chip.isAccountView=true;
                      self.props.showHtmlDialog2(<Order
                        chip={chip}
                        dictionary_strategy={self.props.dictionary_strategy}
                        isLive={true}
                        isPerformance={true}
                        isPortfolio={true}
                        isAccount={true}
                        performance_account_id={props.original.account_id}
                        rankingLoading={false}
                        toggle={() => {
                          self.props.silenceHtmlDialog2();
                        }}
                        themes={this.themes}
                        close={() => {
                          self.props.silenceHtmlDialog2();
                        }}
                        />);
                        //self.props.showPerformance(props.original.account_id, chip);
                        
                  }}  
                      >{props.value}</a>
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
                  )
                }, // Custom cell components!,

                  
                },
                {
                  Header: props => (
                    <span style={{background:self.props.themes.live.dialog.table_left_background}}>
                     Margin %
                  </span>),
                  headerStyle: {
                    background:self.props.themes.live.dialog.table_left_background
                  },
             
                  accessor: "margin_percent",
                  Cell: props => (
                    <span className='number'><center>
                    {parseFloat(props.value) ? (
                      <span style={props.value ? {color:'black'} : parseFloat(props.value) > 0 ? {color:themes.text_gain} : {color:themes.text_loss}} >
                    <b>
                   {parseFloat(props.value).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </span>
                    ) : (
                      <span style={{color:themes.text_color}}>
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
                     Auto
                     </span>),
                   headerStyle: {
                    background:self.props.themes.live.dialog.table_left_background
                  },
                  accessor: "recreate_if_margin_call",
                  Cell: props => (
                    <span className='number'><center>{props.value}</center></span>
                  ), // Custom cell components!,

                },
                {
                    Header: props => (
                      <span style={{background:self.props.themes.live.dialog.table_left_background}}>
                       Edit
                    </span>),
                    accessor: "account_id",
                    headerStyle: {
                      background:self.props.themes.live.dialog.table_left_background
                    },
                    Footer: props => (
                      <div style={{width:"100px", cursor:'pointer'}} onClick={() => {
  
                         window.location='/board'

                      }}>
                        <div style={{float:"left", width:"100px"}}>
                            <img src={"/images/cancel.png"} width={120} height={30} />
                        </div>
                        <div style={{float:"left", marginLeft: "-60px", width:"60px", marginTop: "6px", color:themes.text_color}}>
                          Cancel
                        </div>
                      </div>
                       ), 
                    Cell: props =>{
                      var copyboard='copy_board_' + props.original.rank;

                      return (

                      <span className='number'><center>
                        
                      <a href='JavaScript:console.log("popover called")' style={{ cursor:'pointer'  }} 
                      
                      ref={ref => self[copyboard] = ref}
                      onClick={() => {  
                            if (props.original.chip_id && self.props.performance.enable_edit_delete) {
                              console.log(self.state.performance.accounts[props.original.chip_id])
                              self.props.showDialog(
                                " Are you sure you want to customize your portfolio? ",
                                " The is an advanced feature that should only be moidified by professionals. Creating undiversified portfolio can result in great risk and significant loss." ,
                                () => {
                                      self.props.silenceDialog();
                              
                                      self.props.showHtmlDialog(<AccountsNew  chip_id={props.original.chip_id} performance={self.state.performance} themes={self.props.themes} initializeLive={self.props.initializeLive} />);

                      
                                  },
                                  null,
                                  "I Accept the Risk",
                                  "Cancel"
                                  );

                                } else {

                                  self.props.addTimedToaster(
                                    {
                                      id: "board_notice_" + Math.random().toFixed(3),
                                      text:  self.props.performance.enable_edit_delete_message
                                    },
                                    5000
                                    );
                                  }
                  
                        }} >
                        {props.original.chip_id && self.props.performance.enable_edit_delete ?
                          <img src="/images/account_edit_enabled.png"  height={30} />
                          :
                          <img src="/images/account_edit_disabled.png"  height={30} />
                        }

                          </a>
                     
                      </center></span>

                      
                    )// Custom cell components!,
  
                   },
                  },
                  {
                    Header: props => (
                      <span style={{background:self.props.themes.live.dialog.table_left_background}}>
                       Delete
                    </span>),
                    accessor: "account_id",
                    headerStyle: {
                      background:self.props.themes.live.dialog.table_left_background,
                      whiteSpace: 'unset' 
                    },
                    Footer: props => (
                    <div>
                      {self.props.performance.enable_create_new ? <div style={{width:"100px", cursor:'pointer'}} onClick={() => {

                        self.props.showHtmlDialog(<AccountsNew  performance={self.props.performance} themes={self.props.themes}  initializeLive={self.props.initializeLive}  />);
                    
                    }}>
                    
                      <div style={{float:"left", width:"100px"}}>
                          <img src={"/images/account_create_enabled.png"} width={120} height={30} />
                      </div>
                      <div style={{float:"left", marginLeft: "-70px", width:"70px", marginTop: "10px", color:themes.text_color}}>
                        Create New..
                      </div>
                    </div>
                    : <div style={{width:"100px", cursor:'pointer'}} onClick={() => {
                      self.props.addTimedToaster(
                        {
                          id: "board_notice_" + Math.random().toFixed(3),
                          text: self.props.performance.enable_create_new_message
                        },
                        5000
                        );

                  }}>
                  
                    <div style={{float:"left", width:"100px"}}>
                        <img src={"/images/account_create_disabled.png"} width={120} height={30} />
                    </div>
                    <div style={{float:"left", marginLeft: "-70px", width:"70px", marginTop: "10px", color:"white"}}>
                      Create New..
                    </div>
                  </div>}
                  </div>
                     ), 
                    Cell: props =>{
                      var copyboard='copy_board_chip_' + props.original.rank;

                      return (

                      <span className='number'><center>
                        
                        {props.original.chip_id && self.props.performance.enable_edit_delete ?
                          <img src="/images/account_delete_enabled.png"  style={{ cursor:'pointer'  }} onClick={() => {
                            var chip = Object.assign({}, props.original); 
                            chip.display=props.original.account_chip_text;
                            //chip.tier = props.original.tier;
                            //chip.status = 'unlocked';
                            //chip.chip_tier_text=chip.filter;
                            chip.isReadOnly=true;

                            self.props.showDialog(
                              <div
     >
   
      <h2>
      <span>
        <center>

      <Chip 
                              chip={chip} 
                              isReadOnly={true}

                              account_chip_text={props.original.account_chip_text} />
        </center>
      </span>
      <span>
      Are you sure you want to Delete the Account?
        
      </span>
      
      </h2>
    </div>,
                              " Your deleted account will be permanently removed from the board. " ,
                                () => {
                                  self.setState({refreshing:true})

                                  self.props.silenceDialog();
                                  self.delAccount(props.original.chip_id);
                                  
                                },
                                null,
                                "OK",
                                "Cancel"
                            );
                          }

                          } height={30} />
                          :
                          <img src="/images/account_delete_disabled.png"  onClick={() => {

                            self.props.addTimedToaster(
                              {
                                id: "board_notice_" + Math.random().toFixed(3),
                                text:  self.props.performance.enable_edit_delete_message
                              },
                              5000
                              );
                          }} height={30} />
                        }

                     
                      </center></span>

                      
                    )// Custom cell components!,
  
                   },

                   
                   
                   
                  },
                  
              ],
              
            },
            
          ]}

          defaultPageSize={Object.keys(performance.accounts).length < 6 ? 6 : Object.keys(performance.accounts).length}
          minRows={6}
          style={{
            width:"100%",
            height: self.props.isPopup ? innerHeight-100 : innerHeight - 200,
            maxHeight:"100%",
            overflow:"auto",
            fontSize:"12px",
            fontWeight: 800,
          }}
          defaultSorted={[{
            id   : 'account_value',
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

}
