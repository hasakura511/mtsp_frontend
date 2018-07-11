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
    
  };
};
@connect(stateToProps, dispatchToProps)
export default class AccountsNew extends Component {
  static propTypes = {
    showHtmlDialog:PropTypes.func.isRequired,
    silenceHtmlDialog:PropTypes.func.isRequired,
    dictionary_strategy:PropTypes.object.isRequired,
    themes:PropTypes.object.isRequired
  };
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

  getData = (tier='Paper-New', chip_tier=0) => {
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
        self.props.initializeNew(reinitialize, loaded);
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

        <div className={classes.AccountsNew} style={{margin:"0px", background:themes.table_background, height:"100%"}} >


                    <div style={{margin:"0px", paddingTop:"8px", background:themes.table_background, "float":"right", "width": "10%", "textAlign": "right"}}>
                        <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                    </div>
            <div style={{"clear": "both"}}></div>
           
           

          <div className={classes.AccountsNew} style={{
                                        zIndex:3

                                    }}>

          <h3>New Account Settings</h3>
          <br/>
          <b>Starting value, Account Type and Public settings cannot be modified after new account is created.</b>

          <br/><br/>
          <table cellSpacing={0} cellPadding={0}
                 style={{width:"80%", border: "none", margin: "0px", padding: "0px", borderColor: "transparent"}}>
            <tbody ><tr style={{border: "none", margin: "0px", padding: "0px", borderColor: "transparent"}}>
            <td style={{ width:"20%", textAlign:"left",  border: "none", margin: "0px", padding: "5px"}}>
          Starting Value 
            </td><td style={{width:"80%", textAlign:"left",  border: "none", marginRight: "0px", paddingRight: "100px"}}>
                <Slider min={10000} max={500000} editable value={100000} onChange={() => {
                    console.log("slider")
                }} />
            </td></tr>
            <tr style={{width:"50%", border: "none", margin: "0px", padding: "0px", borderColor: "transparent"}}>
            <td  style={{ textAlign:"left",  border: "none", margin: "0px", padding: "5px"}}> 
                Additional Preferences
            </td><td style={{ border: "none", marginRight: "0px", padding: "5px" }}>
            <Dropdown
                        auto
                        onChange={() => {
                            console.log('handle change');
                        }}
                        source={[{value:'None',label:'None'}, {value:"Hide", label:"Hide"}]}
                        value={"None"}
                    />
            </td></tr>
            <tr>
            <td style={{textAlign:"left", border: "none", margin: "0px", padding: "5px"}}>
                Set your portfolio to automatically..
            </td>
            <td style={{textAlign:"right", border: "none",  padding: "5px"}}>
            <RadioGroup value={"reduce"} onChange={() => {
                    console.log("radio")
                }}>
                <table style={{marginTop:"10px"}}><tbody><tr><td style={{border: "none", margin: "0px", padding: "5px"}}>
                <RadioButton label={'Reduce'} value={'Reduce'} />
                </td><td  style={{border: "none", margin: "0px", padding: "5px"}}>
                <RadioButton label={'Recreate'} value={'Recreate'} />
                </td></tr></tbody></table>
            </RadioGroup>
            </td>
            </tr>
            <tr>
            <td style={{textAlign:"left", border: "none", margin: "0px", padding: "5px"}}>
                when total margin reaches..
            </td>
            <td style={{textAlign:"left", border: "none",  padding: "5px", paddingRight: "100px"}}>
                  <Slider min={0} max={50} editable value={50} onChange={() => {
                    console.log("slider")
                }} /> 
            </td>
            </tr>

             <tr>
            <td style={{textAlign:"left", border: "none", margin: "0px", padding: "5px"}}>
                Advanced Preferences
            </td>
            <td style={{textAlign:"right", border: "none",  padding: "5px"}}>
            <Dropdown
                        auto
                        onChange={() => {
                            console.log('handle change');
                        }}
                        source={[{value:'None',label:'None'}, {value:"Hide", label:"Hide"}]}
                        value={"None"}
                    />
            </td>
            </tr>
            <tr>
            <td style={{textAlign:"left", border: "none", margin: "0px", padding: "5px"}}>
            <RadioGroup value={"reduce"} onChange={() => {
                    console.log("radio")
                }}>
                <RadioButton label={'Generate your portfolio algorithmically'} value={'generate'} />
                <RadioButton label={'Customize your portfolio'} value={'customize'} />
            </RadioGroup>
            </td>
            <td style={{textAlign:"right", border: "none",  padding: "5px"}}>
         
            </td>
            </tr>
            <tr><td style={{textAlign:"left", border: "none",  padding: "5px"}}>
                <h3>Estimated Total Margin <b>$0</b></h3>
            </td>
            <td style={{textAlign:"left", border: "none",  padding: "5px"}}>
                <h3>Max Margin  <b>$12,500</b></h3>
            </td>
            </tr>
            <tr><td style={{ border: "none",  padding: "5px"}} >
            <img src="/images/account_add.png" style={{width:"30px",height:"30px"}} /> Click to add to portfolio
            </td><td style={{  border: "none",  padding: "5px"}} >
            <img src="/images/account_added.png" style={{width:"30px",height:"30px"}} /> Check indicates included in portfolio
            </td></tr>
            <tr><td style={{ border: "none",  padding: "5px"}}>
            <img src="/images/account_remove.png" style={{width:"30px",height:"30px"}} /> Click to remove from portfolio
            </td><td style={{ border: "none",  padding: "5px"}}>
            <img src="/images/account_locked.png" style={{width:"30px",height:"30px"}} /> Lock shows when total margin {">"} max margin.
            </td></tr>
            <tr>
                <td colSpan={2}>

                 <ReactTable
                            
                            data={Object.keys(performance.margins).map(key => {
                                var item=performance.margins[key];
                                item.key=key;
                                return item;
                            })}
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
                                    },
                                    {
                                    Header: "20 Day Avg True Range",
                                    accessor: "usdATR20",
                                    Cell: props => (
                                        <span className='number'><center>
                                        $ {props.value}
                                        </center></span>
                                        ), // Custom cell components!,
                                    },
                                    {
                                        Header: "20 Day Avg Volume",
                                        accessor: "AvgVolume20",
                                        Cell: props => (
                                            <span className='number'><center>
                                            {props.value}
                                            </center></span>
                                            ), // Custom cell components!,
                                    },
                                    {
                                        Header: "Initial Margin",
                                        accessor: "initMargin",
                                        Cell: props => (
                                            <span className='number'><center>
                                            ${props.value}
                                            </center></span>
                                            ), // Custom cell components!,
                                    },
                                    {
                                    Header: "Add / Remove",
                                    accessor: "Group",
                                    Cell: props => (
                                        <span className='number'><center>
                                            <img src="/images/account_remove.png" style={{width:"30px", height:"30px"}} />
                                            <img src="/images/account_add.png"  style={{width:"30px", height:"30px"}} />
                                        </center></span>
                                        ), // Custom cell components!,
                                    },
                                ]}]}
                                defaultPageSize={Object.keys(performance.margins).length}
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

                </td>
            </tr>
            <tr>
            <td style={{border: "none", margin: "0px", padding: "5px"}}>
                <Button label='Reset' raised  />
            </td>
            <td style={{textAlign:"right", border: "none", margin: "0px", padding: "5px"}}>
            <Button label='Cancel' raised  />
            <Button label='Create' raised />
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
    //showDialog:PropTypes.func.isRequired,
    //silenceDialog:PropTypes.func.isRequired,
    addTimedToaster: PropTypes.func.isRequired,
    //initializeNew:PropTypes.func.isRequired,
    performance:PropTypes.object.isRequired
  };
}
