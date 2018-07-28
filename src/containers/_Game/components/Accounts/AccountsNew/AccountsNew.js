import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate } from "../../../../../util";
import classes from "./AccountsNew.css";
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
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Slider from 'react-toolbox/lib/slider';
import Dropdown from 'react-toolbox/lib/dropdown';
import {Button, IconButton} from 'react-toolbox/lib/button';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import moment from 'moment-timezone';
import {numberWithCommas, toTitleCase} from "../../../../../util"
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
  liveDate:state.betting.liveDate,
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
export default class AccountsNew extends Component {
  static propTypes = {
    showHtmlDialog:PropTypes.func.isRequired,
    silenceHtmlDialog:PropTypes.func.isRequired,
    showHtmlDialog2:PropTypes.func.isRequired,
    silenceHtmlDialog2:PropTypes.func.isRequired,
    dictionary_strategy:PropTypes.object.isRequired,
    themes:PropTypes.object.isRequired,
    chip_id:PropTypes.string
  };
  constructor(props) {
    super(props);

    var account={};
    var portfolio=[];

    var performance = props.performance;
    var marginValue = parseInt(props.performance.new_account_params.default_margin_percent);
    var startingValue = parseInt(props.performance.new_account_params.default_starting_value);
    var marginCallType =  props.performance.new_account_params.default_margin_call_type;
    var customizePortfolioType = props.performance.new_account_params.default_customize_portfolio ? 'customize' : 'generate'
    var advancedPref="Hide";

    if (props.chip_id) {

      account=performance.accounts[props.chip_id]
      console.log("Editing Existing Chip " + props.chip_id);
      portfolio=account.portfolio;
      marginValue=parseInt(account.margin_percent);
      startingValue=parseInt(account.starting_value);
      startingValue=parseInt(account.account_value);
      marginCallType=account.recreate_if_margin_call;
      advancedPref="Show";
      customizePortfolioType="customize"
    }
    this.state = {
      lookback: '',
      performance:props.performance,
      performanceLoading:false,
      performanceError:'',
      isPopoverOpen :{},
      filter:'Overall',
      refreshing: false,
      startingValue:startingValue,
      marginValue: marginValue,
      maxMargin: startingValue * marginValue / 100,
      marginCallType:marginCallType,
      customizePortfolioType: customizePortfolioType,
      
      portfolio:portfolio,
      orig_portfolio:portfolio,
      advancedPref:advancedPref,
      account: account
      // endDate: 20180201
    };
  }

  componentWillReceiveProps(newProps) {
      if (newProps.performance) {

        if (this.props.chip_id || newProps.chip_id) {
          var chip_id=this.props.chip_id ? this.props.chip_id : newProps.chip_id;

          var account=performance.accounts[chip_id]
          var portfolio=account.portfolio;
          var marginValue=parseInt(account.margin_percent);
          var startingValue=parseInt(account.starting_value);
          var marginCallType=account.recreate_if_margin_call;
          var maxMargin= startingValue * marginValue / 100;
          this.setState({performance:newProps.performance, 
            orig_portfolio:portfolio,
            marginValue,
            startingValue,
            marginCallType, 
            maxMargin});
        } else {
          this.setState({performance:newProps.performance, 
            marginValue:parseInt(newProps.performance.new_account_params.default_margin_percent),
            startingValue:parseInt(newProps.performance.new_account_params.default_starting_value),
            marginCallType: newProps.performance.new_account_params.default_margin_call_type,
            customizePortfolioType: newProps.performance.new_account_params.default_customize_portfolio ? 'customize' : 'generate'
          })
        }
          
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

  
  saveData=() => {
    var self=this;
    var chip_id=self.props.chip_id;
    if (!chip_id)
      chip_id=-1;
    if (this.state.refreshing) {
      console.log("Save Data in Progress" );

      return;
    }
    else
      this.setState({refreshing:true})
    console.log("Starting Save Data ");
    
    axios
      .post("/utility/save_account/", {
          'username':  this.props.email,
          'chip_id': parseInt(chip_id),
          'starting_value':self.state.startingValue,
          'margin_percent':self.state.marginValue,
          'margin_call': self.state.marginCallType,
          'customize_portfolio': JSON.stringify(self.state.customizePortfolioType == 'customize'),
          'portfolio': JSON.stringify(self.state.portfolio)
          
      })
      .then(response => {
        console.log(response);
        var data=response.data;
        this.props.addTimedToaster({
          id: "saveData",
          text: data.message,
        });
        if (data.message == "OK") {
          self.props.initializeLive(true);
          self.props.silenceHtmlDialog();
        }
       this.setState({
          //controls: controls,
          
          loading: false,
          fetched: true,
          refreshing:false,

          
        });

        //if (sym) {
        //  self.onGetChart(sym, liveDateText);
        //}
        //self.props.refreshMarketDone();
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: true, loading: false,refreshing:false });
        this.props.addTimedToaster({
          id: "contact-us-error",
          text: "Server error, please wait till we fix."
        });
      });
  }

  
  customData=(account_id='', link='', date='', portfolio='') => {
    var self=this;
    
    if (this.state.refreshing) {
      console.log("Market refresh still in progress" );

      return;
    }
    else
      this.setState({refreshing:true})
    console.log("Starting Market HEATMAP Refresh with Account: " + account_id);
    
    axios
      .post("/utility/market_heatmap/", {
          'username':  this.props.email,
          'date': date,
          'account_id':account_id,
          'link':link,
          'portfolio':portfolio

      })
      .then(response => {
        console.log(response);
        var data=response.data;
        var liveDateText=response.data.date;
        var date_str=response.data.date_str;
        //alert(response.data.date_str)
        //alert(response.data.date)
        var groups= JSON.parse(response.data.groups)
        var markets= JSON.parse(response.data.markets)
        var themes = response.data.themes
        data.groups=groups;
        data.markets=markets;
        data.themes=themes;
        console.log(data);
        console.log(groups)
        console.log(markets)
        console.log(themes)
        
       this.setState({
          //controls: controls,
          liveDateText:liveDateText,
          date_str:date_str,
          marketData:data,
          marketThemes:themes,
          loading: false,
          fetched: true,
          refreshing:false,

          customizePortfolioType:'customize'

        });

        //if (sym) {
        //  self.onGetChart(sym, liveDateText);
        //}
        //self.props.refreshMarketDone();
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: true, loading: false,refreshing:false });
        this.props.addTimedToaster({
          id: "contact-us-error",
          text: "Server error, please wait till we fix."
        });
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
    var self=this;
    var { performance, lookback, performanceLoading, performanceError, filter } = this.state;
    var bgColor="white";
    var bgText="black";
    var bdColor="green";
    var bhColor="pink";
    
    
    var themes=performance.themes;
    var tableStyle={ fontSize:'12px',background: bgColor, color:bgText, borderLeft: "1px solid " + bdColor, borderRight: "1px solid " + bdColor, borderTop: "0.1px solid " + bhColor, borderBottom: "0.1px solid " + bhColor};

    var chartData={};

    var account_id='';
    var account={};

    if (self.props.chip_id) {    
      account_id=self.props.performance.accounts[self.props.chip_id].account_id;
      account=self.props.performance.accounts[self.props.chip_id];
    }

    /*
    if (performance && performance.accounts) {
        //console.log(performance);
        //console.log(performance.chip_tiers);
    }
    */

    var customizeHtml=[];
    var idx=0;
    customizeHtml.push(
      <tr key={"customize_" + idx}><td style={{ border: "none",  padding: "5px"}} >
    <img src="/images/account_add.png" style={{width:"22px",height:"22px"}} /> Click to add to portfolio
    </td><td style={{  border: "none",  padding: "5px"}} >
    <img src="/images/account_added.png" style={{width:"18px",height:"18px"}} /> Check indicates included in portfolio
    </td></tr>)
    ;
    idx+=1;
    customizeHtml.push(
      <tr key={"customize_" + idx}><td style={{ border: "none",  padding: "5px"}}>
      <img src="/images/account_remove.png" style={{width:"22px",height:"22px"}} /> Click to remove from portfolio
      </td><td style={{ border: "none",  padding: "5px"}}>
      <img src="/images/account_locked.png" style={{width:"18px",height:"18px"}} /> Lock shows when total margin {">"} max margin.
      </td></tr>
    );
    idx+=1;
    var estMargin=0;
    Object.keys(performance.margins).map(key => {
      var item=performance.margins[key];
      item.key=key;
      //estMargin+=parseFloat(item.initMargin);
      return item;
    });
  

    if (self.state.customizePortfolioType == 'customize') {
      //console.log(self.state.marketData.markets);
      self.state.portfolio.map(key => {
        var item=performance.margins[key];
        estMargin+=parseFloat(item.initMargin);
      });  
      var itemData=Object.keys(performance.margins).map(key => {
        var item=performance.margins[key];
        item.key=key;
        //estMargin+=parseFloat(item.initMargin);
        return item;
      });
      customizeHtml.push(
        <tr  key={"customize_" + idx}>
        <td colSpan={2} style={{margin:"0px",padding:"0px", border:"0px"}}>
  
         <ReactTable
                    
                    data={itemData}
                    className="-striped -highlight"
                    minRows={10}
                    columns={[
                        {
                        Header: "",
                        columns: [
                          
                          {
                            Header: "Initial Margin",
                            accessor: "initMargin",
                            Cell: props => (
                                <span className='number'><center>
                                    <img src="/images/account_remove.png" 
                                    onClick={() => {
                                        //console.log(props.original);
                                        var portfolio=self.state.portfolio.filter(item => {
                                          return item != props.original.key;
                                        });
                                        self.setState({portfolio:portfolio});
                                        console.log(portfolio);
  
                                    }}
                                    style={{width:"22px", height:"22px", cursor:'pointer' }} />
                                    <img src="/images/account_add.png"  
                                    onClick={() => {
                                        var portfolio=self.state.portfolio.filter(item => {
                                          return item != props.original.key;
                                        });
                                        if (parseFloat(self.state.maxMargin) > parseFloat(estMargin) + parseFloat(props.original.initMargin))
                                          portfolio.push(props.original.key);
                                        else 
                                          self.props.addTimedToaster({
                                            id: "addData" + Math.random(),
                                            text: "Not enough margin to add " + props.original.key + " to portfolio."
                                          });
                                        console.log(portfolio);
                                        self.setState({portfolio:portfolio});
                                    }}
                                    style={{width:"22px", height:"22px", cursor:'pointer' }} />
                                    &nbsp;&nbsp;
                                    $ {numberWithCommas(props.value)}
                                </center></span>
                                ), // Custom cell components!,
                            },
                            
                            {
                            Header: "Markets",
                            accessor: "Display",
                            Cell: props => (
                                <span style={{textAlign:'left'}} >
                                <a href='#markets' 
                                onClick={() => {
                                  self.props.showHtmlDialog2(<Markets load_account_id={''} 
                                    load_symbol={props.original.key} 
                                    load_link={'accounts'}
                                    load_portfolio={JSON.stringify(self.state.orig_portfolio)} />)
                                }}>
                                {props.value}
                                </a>
                                </span>
                              ), // Custom cell components!,
                            },
                            {
                            Header: "Group",
                            accessor: "Group",
                            Cell: props => (
                                <span className='number'><center>
                                {props.value}
                                </center></span>
                              ), // Custom cell components!,
                            },
                            {
                            Header: "20 Day Avg True Range",
                            accessor: "usdATR20",
                            Cell: props => (
                                <span className='number'><center>
                                $ {numberWithCommas(props.value)}
                                </center></span>
                                ), // Custom cell components!,
                            },
                            {
                                Header: "20 Day Avg Volume",
                                accessor: "AvgVolume20",
                                Cell: props => (
                                    <span className='number'><center>
                                    {numberWithCommas(props.value)}
                                    </center></span>
                                    ), // Custom cell components!,
                            },
                            
                            {
                              Header: "Existing Portfolio",
                              accessor: "Display",
                              Cell: props => (
                                  <span style={{textAlign:'center'}} >
                                    <center>
                                  {
                                    self.state.orig_portfolio.includes(props.original.key) ? 
                                  <img 
                                                src="/images/account_added.png" 
                                                style={{
                                                  width:"18px",
                                                  height:"18px"
                                                }}
                                  />
                                  :
                                    null
                                  }
                                    </center>
                                  </span>
                                ), // Custom cell components!,
                              },
                              {
                                Header: "New Portfolio",
                                accessor: "Display",
                                Cell: props => (
                                    <span style={{textAlign:'center'}} >
                                    <center>
                                    {self.state.portfolio.includes(props.original.key) ? 
                                    <img src="/images/account_added.png" style={{width:"18px",height:"18px"}} />
                                    
                                    : parseFloat(self.state.maxMargin) < parseFloat(estMargin) + parseFloat(props.original.initMargin) ? 
                                      <img src={"/images/account_locked.png"} style={{width:'18px'}} />
                                    : null}
                                    </center>
                                    </span>
                                  ), // Custom cell components!,
                                },
                        ]}]}
                        defaultPageSize={Object.keys(performance.margins).length}
                        style={{
                            width: "100%", 
                            height: "2000px",
                            maxHeight:"100%",
                            overflow:"auto",
                            fontSize:"12px",
                            fontWeight: 800,
                            display:"table",
                            //paddingTop: "auto",
                            //paddingBottom: "-20px",
                            //marginTop: "auto",
                            //marginBottom: "-20px",
                            marginLeft:"auto",
                            marginRight: "auto"
                        }}
                      
                        showPagination={false}
                        />
  
        </td>
    </tr>);
    }
    var advancedPrefHtml=[];
    idx+=1;
    advancedPrefHtml.push(
    <tr key={"adv_pref_" + idx}>
            <td style={{textAlign:"left", border: "none", margin: "0px", padding: "5px"}}>
            <RadioGroup value={self.state.customizePortfolioType} onChange={(e) => {
                    console.log(e)
                    if (e == 'customize') {
                            //self.customData();
                            if (!self.props.chip_id) {
                              self.props.showDialog(
                                " Are you sure you want to customize your portfolio? ",
                                " The is an advanced feature that should only be moidified by professionals. Creating undiversified portfolio can result in great risk and significant loss." ,
                                () => {
                                  self.props.silenceDialog();
                                  self.setState({customizePortfolioType:e})

                      
                                  },
                                  null,
                                  "I Accept the Risk",
                                  "Cancel"
                                  );
                            } else {
                              self.setState({customizePortfolioType:e});
                            }

                      } else {
                        self.setState({customizePortfolioType:e})

                      }
                    

                }}>
                <RadioButton label={'Generate your portfolio algorithmically'} value={'generate'} />
                <RadioButton label={'Customize your portfolio'} value={'customize'} />
            </RadioGroup>
            </td>
            <td style={{textAlign:"right", border: "none",  padding: "5px"}}>
         
            </td>
            </tr>
    );
    idx+=1;
    
    if (self.state.customizePortfolioType == 'customize' ) {
      advancedPrefHtml.push(
        <tr key={"adv_pref_" + idx} ><td style={{textAlign:"left", width:"50%", border: "none",  padding: "5px"}}>
            <h3>Estimated Total Margin <b style={{background:self.props.themes.live.dialog.table_left_background, padding:"10px"}}>$ {numberWithCommas(estMargin)}</b>
            
            &nbsp;&nbsp;&nbsp;<Button label='Clear Portfolio' onClick={() => {
                self.setState({portfolio:[]})
              }}
              raised ripple={false} />

            </h3>
        </td>
        <td style={{textAlign:"left", border: "none",  padding: "5px"}}>
            <h3>Max Margin   <b style={{background:self.props.themes.live.dialog.table_left_background, padding:"10px"}}>$ {numberWithCommas(parseInt(self.state.maxMargin))} </b></h3>
        </td>
        </tr>
      );
      idx+=1;
      advancedPrefHtml.push(customizeHtml)
      idx+=1;
    }

    
    if (this.state.refreshing) {
      return ( 

        <div style={{ height: outerHeight + 100,
                      top: 0, left:0, 
                      position: 'absolute', 
                      width: innerWidth + 2222,
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
           <b>Processing... This could take a couple of minutes.</b>
          </center>
        </div>
      );


    }

  
    var items=[];
    var accounthtml=[];
    if (self.props.chip_id) {    
        var chip=self.props.performance.accounts[self.props.chip_id];
        chip.display=chip.account_chip_text;
        //chip.status = 'unlocked';
        chip.isReadOnly=true;
        chip.isAccountChip=true;
        items.push(
          <div key={'item-2'} style={{'float':'left', width: '60px', height:'60px', padding:"1px", marginTop:"1px", marginBottom:"-10px"}}>
          <Chip chip={chip} isReadOnly={true} account_chip_text={chip.account_chip_text} />&nbsp;&nbsp;
          </div>
          )
          items.push(

            <div key={'item-4'}  style={{'float':'left', width: '100px', height:'60px', padding:"1px", marginTop:"15px", marginBottom:"-10px"}}>
              {toTitleCase(chip.tier)}
            </div>
            )
        items.push(

          <div key={'item-3'} style={{'float':'left', width:'100px', height:'40px', marginTop:"-5px"}}>
            <MiniAccountChart 
              chartData={performance.sparklines} 
              chart_id={self.props.chip_id} 
              accountsData={performance} />
          </div>
          )
          
          items.push(

          <div key={'item-5'} style={{"clear": "both"}}></div>
          )

          accounthtml.push(<table 
            key={'accountHtml'} 
            style={{
              //border:"none", 
              //borderCollapse: "collapse",
              width:"100%",
              //background:self.props.themes.live.dialog.background_inner,
              color:self.props.themes.live.dialog.text }}>
            <thead  style={{border:"none"}}>
              <tr style={{border:"none"}}>
              <th  style={{border:"none"}}>
                <center>
                  Account
                  </center>
                  </th>
                  <th  style={{border:"none"}}>
                  <center>
                  Account Value
                  </center>
                  </th>
                  <th  style={{border:"none"}}>
                  <center>
                  Cumulative %Chg
                  </center>
                  </th>
                  <th  style={{border:"none"}}>
                  <center>
                    Age
                  </center>
                  </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{border:"1px", "padding":"1px"}}>
                  <td style={{ width: "350px", paddingTop: "20px", borderLeft:"1px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                      <div key={'c'} style={{"clear": "both"}}></div>
                    {items}
                  </td>            
                  <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                  <center>
      
                  $ {numberWithCommas(chip.account_value.toString())}
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
                  <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black", borderRight:"1px solid black"}}>
                  <center>
                    {chip.age} Days
                  </center>
                  </td></tr>
                  </tbody>
                  </table>);
      
    }
    return (
        <div className={classes.AccountsNew}>
        
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

        <div className={classes.AccountsNew} style={{margin:"0px", background:"white", height:"100%"}} >

                    <div style={{margin:"0px", paddingTop:"8px", background:"white", "float":"right", "width": "10%", "textAlign": "right"}}>
                        <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                    </div>
                    {self.props.chip_id ? 
                    <div style={{margin:"0px", paddingTop:"8px", background:"white", "float":"right", "width": "80%", "textAlign": "right"}}>
                   
                      {
                       accounthtml
                      }

                    </div> : null}
            <div style={{"clear": "both"}}></div>
           
           

          <div className={classes.AccountsNew} style={{
                                        zIndex:3

                                    }}>

          {!self.props.chip_id ?
          <div>
            <h3>New Account Settings</h3>
            <br/>
            <b>Starting value cannot be modified after new account is created.</b>
          

            <br/><br/>
          </div>:null}

          <table cellSpacing={0} cellPadding={0}
                 style={{width:"98%", border: "none", margin: "0px", padding: "0px", borderColor: "transparent"}}>
            <tbody >
        
          {!self.props.chip_id ?
                        
              <tr style={{border: "none", margin: "0px", padding: "0px", borderColor: "transparent"}}>
            <td style={{ width:"20%", textAlign:"left",  border: "none", margin: "0px", padding: "5px"}}>
          Starting Value 
            </td><td style={{width:"80%", textAlign:"left",  border: "none", marginRight: "0px"}}>

             <table width={"100%"}><tbody>
                  <tr>
                  <td  style={{border: "none", margin: "0px", padding: "0px"}}>
                  {parseInt(performance.new_account_params.MIN_STARTING_VALUE)}
                  </td>
                  <td  style={{textAlign:"right", border: "none", margin: "0px", padding: "0px"}}>
                  {parseInt(performance.new_account_params.MAX_STARTING_VALUE)}
                  </td>
                  <td  style={{border: "none", margin: "0px", padding: "0px"}}>
                  </td></tr>

                  <tr><td colSpan={2} style={{border: "none", margin: "0px", padding: "5px"}}>
                  <Slider min={parseInt(performance.new_account_params.MIN_STARTING_VALUE)}
                     max={parseInt(performance.new_account_params.MAX_STARTING_VALUE)} 
                      snaps={true} 
                      step={parseInt(performance.new_account_params.INCREMENT_STARTING_VALUE)} 
                      value={this.state.startingValue} onChange={(e) => {
                    console.log(e)
                    var maxMargin=Math.floor(parseFloat(e) * parseFloat(self.state.marginValue)/100);
                    self.setState({startingValue:e, maxMargin:maxMargin, portfolio:[]})
                }} />
                </td><td  style={{border: "none", marginLeft: "0px", paddingLeft: "15px"}} >
                <b style={{fontSize:"32px",fontWeight:1600}}>$ {numberWithCommas(this.state.startingValue)}</b>
                </td></tr></tbody></table>
            </td></tr>
            : null }
            <tr>
            <td style={{textAlign:"left", border: "none", margin: "0px", padding: "5px"}}>
                Set your portfolio to automatically..
            </td>
            <td style={{textAlign:"right", border: "none",  padding: "5px"}}>
            <RadioGroup value={this.state.marginCallType} onChange={(e) => {
                    console.log(e);
                    self.setState({marginCallType:e})
                }}>
                <table style={{marginTop:"10px"}}><tbody><tr>
                {performance.new_account_params.margin_call_types.map(item => {
                  return (<td key={item} onClick={() => {
                    self.setState({marginCallType:item})
                  }} 
                  style={{border: "none", margin: "0px", padding: "5px"}}>
                  <RadioButton checked={item == self.state.marginCallType} label={item} value={item} />
                  </td>)
                })}
                 </tr></tbody></table>
            </RadioGroup>
            </td>
            </tr>
            <tr>
            <td style={{textAlign:"left", border: "none", margin: "0px", padding: "5px"}}>
                when total margin reaches..
            </td>
            <td style={{textAlign:"left", border: "none",  padding: "5px"}}>
                <table width={"100%"}><tbody>
                  <tr>
                  <td  style={{border: "none", margin: "0px", padding: "0px"}}>
                  {parseInt(performance.new_account_params.MIN_MARGIN_PERCENT)} %
                  </td>
                  <td  style={{textAlign:"right", border: "none", margin: "0px", padding: "0px"}}>
                  {parseInt(performance.new_account_params.MAX_MARGIN_PERCENT)} %
                  </td>
                  <td  style={{border: "none", margin: "0px", padding: "0px"}}>
                  </td></tr>

                  <tr><td colSpan={2} style={{border: "none", margin: "0px", padding: "5px"}}>
                  <Slider min={parseInt(performance.new_account_params.MIN_MARGIN_PERCENT)}
                     max={parseInt(performance.new_account_params.MAX_MARGIN_PERCENT)} 
                      snaps={true} 
                      pinned={true}
                      step={parseInt(performance.new_account_params.INCREMENT_MAX_MARGIN_PERCENT)} 
                      value={parseInt(self.state.marginValue)} onChange={(e) => {
                    console.log(e)
                    var maxMargin=Math.floor(parseFloat(e)/100 * parseFloat(self.state.startingValue));

                    self.setState({marginValue:e, maxMargin:maxMargin, portfolio:[]})
                }} />
                </td><td  style={{border: "none", marginLeft: "0px", paddingLeft: "15px"}} >
                <b style={{fontSize:"32px",fontWeight:1600}}>{this.state.marginValue}%</b> of account value
                </td></tr></tbody></table>
            </td>
            </tr>

             <tr>
            <td style={{textAlign:"left", border: "none", margin: "0px", padding: "5px"}}>
                Advanced Preferences
            </td>
            <td style={{textAlign:"left", border: "none",  padding: "5px"}}>
            <Dropdown
                        onChange={(e) => {
                            console.log('handle change');
                            self.setState({advancedPref:e});
                        }}
                        source={[{value:'Show',label:'Show'}, {value:"Hide", label:"Hide"}]}
                        value={self.state.advancedPref}
                    />
            </td>
            </tr>
            {self.state.advancedPref != 'Hide' ? advancedPrefHtml : null}

                        <tr>
            <td style={{border: "none", margin: "0px", padding: "5px"}}>
                <Button label='Reset' raised ripple={false}
                 onClick={() => {
                  var marginValue=parseInt(self.props.performance.new_account_params.default_margin_percent);
                  if (account.margin_percent)
                    marginValue=parseInt(account.margin_percent); 
                  var startingValue = parseInt(self.props.performance.new_account_params.default_starting_value);
                  var maxMargin= startingValue * marginValue / 100;
                  var marginCallType =self.props.performance.new_account_params.default_margin_call_type;
                  if (account.recreate_if_margin_call)
                    marginCallType=account.recreate_if_margin_call
                  self.setState({
                    performance:self.props.performance, 
                    marginValue:parseInt(marginValue),
                    startingValue:parseInt(startingValue),
                    maxMargin:maxMargin,
                    marginCallType: marginCallType,
                    customizePortfolioType : self.props.chip_id || self.props.performance.new_account_params.default_customize_portfolio ? 'customize' : 'generate',
                    portfolio:self.state.orig_portfolio
                  })
                }}
                 />
            </td>
            <td style={{textAlign:"right", border: "none", margin: "0px", padding: "5px"}}>
            <Button label='Cancel' raised ripple={false} 
             onClick={() => {
              self.props.silenceHtmlDialog();
            }}
             />
            {!self.props.chip_id ?
              <Button  style={{background:"#4FB093", color:"#FFFFFF"}}  label='Create' onClick={() => {
                self.saveData();

              }} raised ripple={false} />
              :
              <Button style={{background:"#4FB093", color:"#FFFFFF"}} label='Save' onClick={() => {
                self.saveData();
              }}
              raised ripple={false} />
            }
            </td>
            </tr>

            </tbody></table>


      
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
    showDialog:PropTypes.func.isRequired,
    silenceDialog:PropTypes.func.isRequired,
    addTimedToaster: PropTypes.func.isRequired,
    //initializeNew:PropTypes.func.isRequired,
    performance:PropTypes.object.isRequired,
    liveDate:PropTypes.instanceOf(moment).isRequired,
    liveDateText:PropTypes.string.isRequired,
    email:PropTypes.string,
    initializeLive:PropTypes.func.isRequired
    
  };
}
