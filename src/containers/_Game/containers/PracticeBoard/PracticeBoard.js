import React, { Component } from "react";
import Panel from "../Panel/Panel";
import classes from "./PracticeBoard.css";
import bgBoard from "../../../../assets/images/boardBg.png";
import Config from "../../Config";
import ChipsConfig from "../../ChipsConfig";
import protectedComponent from "../../../../hoc/ProtectedComponent/ProtectedComponent";
import demoComponent from "../../../../hoc/ProtectedComponent/DemoComponent";
import { withRouter } from "react-router-dom";
import {Button, IconButton} from 'react-toolbox/lib/button';

import Aux from "../../../../hoc/_Aux/_Aux";
// import Dashboard from "../../components/Dashboard/Dashboard";
import LiveDashboard from "../LiveDashboard/LiveDashboard";
import Bettings from "../../BettingConfig";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { toWordedDate, uniq, toStringDate } from "../../../../util";
import Clock from "../Clock/Clock";
import PracticeClock from "../Clock/PracticeClock";
import Toggle from 'react-bootstrap-toggle'
import axios from "../../../../axios-gsm";
import ClockLoader from "../../../../components/UI/ClockLoader/ClockLoader";
import { toSystem, toAntiSystem } from "../../Config";
import Markets from "../../../Markets/Markets"
import NewBoard from "../NewBoard/NewBoard"
import { Link } from "react-router-dom";
import DatePicker from 'react-datepicker';
import moment from 'moment';
// Inserts or removes chip into system
const insertChip = (systems, column, chip) => {
  return systems.map(system => {
    const { heldChips } = system;
    return system.column === column
      ? {
          ...system,
          heldChips: [
            ...heldChips.filter(c => c.accountId !== chip.accountId),
            chip
          ]
        }
      : {
          ...system,
          heldChips: heldChips.filter(c => c.accountId !== chip.accountId)
        };
  });
};
const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const stateToProps = state => {
  return {
    email: state.auth.email,
    firstName: state.auth.firstName,
    lastName: state.auth.lastName,
    isAuth: state.auth.token !== null,
    inGameChips:state.betting.inGameChips,
    tosAccepted: state.auth.tosAccepted,
    rdAccepted: state.auth.rdAccepted,
    currentBets: state.betting.currentBets,
    simulatedDate: state.betting.simulatedDate,
    last3DaysProfits: state.betting.last3DaysProfits,
    accounts:state.betting.accounts,
    dashboard_totals:state.betting.dashboard_totals,
    initializeData:state.betting.initializeData,
    leftSystems:state.betting.leftSystems,
    topSystems:state.betting.topSystems,
    rightSystems:state.betting.rightSystems,
    bottomSystems:state.betting.bottomSystems,
    themes:state.betting.themes,
    mute:state.betting.mute,
    liveDateText:state.betting.liveDateText
    
  };
};

/**
 *
 * @function dispatchToProps React-redux dispatch to props mapping function
 * @param {any} dispatch
 * @returns {Object} object with keys which would later become props to the `component`.
 */

const dispatchToProps = dispatch => {
  return {
    nextDay: () => {
      dispatch(actions.nextDay());
    },
    toggleMode: () => {
      dispatch(actions.toggleMode());
    },
    reset: () => {
      dispatch(actions.reset());
    },
    updateDate: () => {
      dispatch(actions.updateDate());

    },
    initializeData: (data) => {
      dispatch(actions.initializeData(data));
      
    },
    authSuccess: (user, token) => {
      dispatch(actions.authSuccess(user, token));
    },
    setMute: (isMute) => {
      dispatch(actions.setMute(isMute));
    },
    addTimedToaster: toaster => {
        dispatch(actions.addTimedToaster(toaster, 5000))
    },
    showLeaderDialog: (show) => {
      dispatch(actions.showLeaderDialog(show));
    },
    showHtmlDialog: (htmlContent) => {
      dispatch(actions.showHtmlDialog(htmlContent));
      
    },
    silenceHtmlDialog: () => {
      dispatch(actions.silenceHtmlDialog());
      
    },
    updateBet: (topSystems,
      bottomSystems,
      leftSystems,
      rightSystems,
      inGameChips,
      accounts) => {
        dispatch(actions.updateBet(topSystems,
          bottomSystems,
          leftSystems,
          rightSystems,
          inGameChips,
          accounts));
      },

  };
};

//@withErrorHandler(axiosOpen)
//@withRouter
@demoComponent
@connect(stateToProps, dispatchToProps)

/**
 * Board component, that encapsulates our board-game, drag-drop-lifecycle
 *
 * @class Board
 * @extends {Component}
 */
export default class PracticeBoard extends Component {
  static propTypes = {
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    authSuccess: PropTypes.func.isRequired,
    accounts:PropTypes.array.isRequired,
    dashboard_totals:PropTypes.object.isRequired,
    nextDay: PropTypes.func.isRequired,
    updateBet: PropTypes.func.isRequired,
    updateDate: PropTypes.func.isRequired,
    addTimedToaster:PropTypes.func.isRequired,
    initializeData: PropTypes.func.isRequired,
    toggleMode: PropTypes.func.isRequired,
    isAuth: PropTypes.bool.isRequired,
    tosAccepted: PropTypes.bool.isRequired,
    rdAccepted: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    currentBets: PropTypes.object.isRequired,
    simulatedDate: PropTypes.string.isRequired,
    last3DaysProfits: PropTypes.object.isRequired,
    inGameChips:PropTypes.object.isRequired,
    leftSystems:PropTypes.array.isRequired,
    topSystems:PropTypes.array.isRequired,
    rightSystems:PropTypes.array.isRequired,
    bottomSystems:PropTypes.array.isRequired,
    themes:PropTypes.object.isRequired,
    mute:PropTypes.bool.isRequired,
    setMute:PropTypes.func.isRequired,
    liveDateText:PropTypes.string,
    showHtmlDialog:PropTypes.func.isRequired,
    silenceHtmlDialog:PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      /**
       * Systems on four sides, left/right/top/bottom
       */

      inGameChips: {
        /**
         * Balance Chips
         */
        balanceChips: [] /**
         * Betting Chips
         */,
        bettingChips: []
      },
      animateSimulateButton: false,
      loading: true,
      boardMode: 'live',
      toggleActive:true,
      initializeData:{},
      refreshing:false,
      heatmapData:{},
    };
  
  }

  componentWillReceiveProps(newProps) {
    !Object.values(this.props.currentBets)
      .map(o => o.position)
      .reduce((acc, o) => {
        if (o != "off") acc["notoff"] = true;
        return acc;
      }, {})["notoff"] &&
      this.props.currentBets !== newProps.currentBets &&
      this.setState({ animateSimulateButton: true });
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.state.animateSimulateButton &&
        this.setState({ animateSimulateButton: false });
    }, 1000);
  }

  componentWillMount() {
    /**
     * set initial state
     */
    
  }

  

  initializeLive=(reinitialize=false, callback=undefined, start_date="") => {
    var self=this;
    if (this.state.refreshing)
      return;
    else
      this.setState({refreshing:true})
    this.forceUpdate();
    
    var user=localStorage.getItem("user")
    //console.log(this.props);
    var reinit='false';
    if (reinitialize)
      reinit='true';
    var username='demo';
    if (this.props.email)
        username=this.props.email;
    if (user) {
      user=JSON.parse(localStorage.getItem("user"))
      //alert(user.email)
      if (user.email)
        username=user.email;
    }
    if (!this.state.init_params) {
      this.setState({init_params: {'username':username, 'start_date':start_date}})
    } else {
      start_date=this.state.init_params.start_date;
    }
    axios
    .post("/utility/initialize_practice/", {
    // accounts: [{ portfolio, target, accountValue }],
    'username':  username,
    'start_date': start_date
    },{timeout: 600000})
    .then(({ data }) => {
      console.log('received initialize_practice data')
      console.log(data);
      var accounts=data.accounts;
      //console.log(accounts);
      this.setState({accounts_orig:accounts})
      data.isPractice=true;
      self.props.initializeData(data);

      //if (!this.state.loading)
      //  this.sendNotice("Board Refreshed with New Data");


      this.setState({
        date_picked:data.simulate_dates[0],
        loading:false,
        rankingLoading: false,
        refreshing:false,
        accounts:accounts,
        simulate_dates:data.simulate_dates
      });

      if (callback)
        callback();
     
    })
    .catch(error => {
      this.sendNotice('Account Data not received: ' + JSON.stringify(error));
      console.log('error initializing')
      console.log(error)
    // eslint-disable-next-line react/no-is-mounted
      this.setState({
        rankingLoading: false,
        rankingError: error,
        loading:false,
        refreshing:false
      });
    });

  }

  nextSimulationDay=(reinitialize=false, callback=undefined, start_date="") => {
    var self=this;
    if (this.state.refreshing)
      return;
    else
      this.setState({refreshing:true})
    this.forceUpdate();
    
    //console.log(this.props);
    var reinit='false';
    if (reinitialize)
      reinit='true';
    var username='demo';
    if (this.props.email)
        username=this.props.email;

    var bets={};
    (this.state.account_params ? this.state.account_params : this.props.accounts).map(account => {
      bets[account.chip_id]=account.last_selection;
    });
    axios
    .post("/utility/update_practice/", {
    // accounts: [{ portfolio, target, accountValue }],
    'username':  username,
    'start_date': start_date,
    //'account_params':this.state.accounts
    'account_params': this.state.accounts_orig, // this.state.account_params ? JSON.stringify(this.state.account_params) : JSON.stringify(this.props.accounts),
    'bets': JSON.stringify(bets)
    },{timeout: 600000})
    .then(({ data }) => {
      console.log('received initialize_practice data')
      console.log(data);
      var accounts=data.accounts;
      data.isPractice=true;
      this.setState({accounts_orig:accounts})

      self.props.initializeData(data);

      //if (!this.state.loading)
      //  this.sendNotice("Board Refreshed with New Data");


      this.setState({
        date_picked:data.simulate_dates[0],
        loading:false,
        rankingLoading: false,
        refreshing:false,
        accounts:accounts,
        simulate_dates:data.simulate_dates

      });

      if (callback)
        callback();
     
    })
    .catch(error => {
      this.sendNotice('Account Data not received: ' + JSON.stringify(error));
      console.log('error initializing')
      console.log(error)
    // eslint-disable-next-line react/no-is-mounted
      this.setState({
        rankingLoading: false,
        rankingError: error,
        loading:false,
        refreshing:false
      });
    });

  }
  
  initializeDateSelector=() => {
    var self=this;
    if (this.state.refreshing)
      return;
    else
      this.setState({refreshing:true})

    var username='demo';
    if (this.props.email)
        username=this.props.email;
    axios
    .post("/utility/date_selector_practice/", {
    // accounts: [{ portfolio, target, accountValue }],
    'username':  this.props.email,
    },{timeout: 600000})
    .then(({ data }) => {
      console.log('received initialize_practice data')
      console.log(data);
      
      

      this.setState({
        loading:false,
        rankingLoading: false,
        //rankingData: data.rankingData,
        refreshing:false,
        simData:data
      });

     
    })
    .catch(error => {
      this.sendNotice('Account Data not received: ' + JSON.stringify(error));
      console.log('error initializing')
      console.log(error)
    // eslint-disable-next-line react/no-is-mounted
      this.setState({
        rankingLoading: false,
        rankingError: error,
        loading:false,
        refreshing:false
      });
    });

  }
  componentDidMount() {
      var self=this;
      var date=getParameterByName('date_picked'); 
      if (date) {
            self.setState({date_picked:date})
            self.initializeLive(false, undefined, date)

      } else {
        if (this.props.email && this.props.email != 'demo')
          this.initializeDateSelector();
        else {
          this.initializeLive();
          
        }
      }

  }

  /**
   *
   * @function addBettingChip transfers a chip from balanceChips to bettingChips
   * @param {any} chip a chip object
   * @param {any} position position of the bet, that could be a number or a system.
   * @todo find a better way to handle position of the bet.
   */

  moveOnBoard = (chip, position, strat) => {
    var {
      topSystems,
      bottomSystems,
      leftSystems,
      rightSystems,
      inGameChips, 
      accounts
    } = this.props;


    console.log("moving with params");  
    console.log("inGameChips")
    console.log(inGameChips);
    console.log(strat);
    console.log(position);

    chip.last_selection=strat.toLowerCase();    
    chip.position=position;
    chip.chip_location=strat.toLowerCase();

    var balanceChips=inGameChips.balanceChips;
    var bettingChips=inGameChips.bettingChips;
    
    if (!chip.position || chip.position.toString().toLowerCase() == 'off') {
      
        balanceChips = inGameChips.balanceChips.map(c => {
          
          return c.accountId === chip.accountId
            ? { ...c, 
              count: c.count + 1 ,
              position: position,
              last_selection:strat }
              : c;
          }

        );

        
        bettingChips = inGameChips.bettingChips.filter(
          c => c.accountId !== chip.accountId
        );

    } else {

        balanceChips = inGameChips.balanceChips.map(c => {
        return c.accountId === chip.accountId
          ? {
              ...c,
              count: c.count - 1,
              position: position,
              last_selection: strat
            }
          : c;
        });
        
        var found=false;
        bettingChips = bettingChips.map(c => {
          if (c.accountId === chip.accountId)
            found=true;
          return c.accountId === chip.accountId
            ? {
                ...c,
                position: position,
                last_selection: strat
              }
            : c;
        });

        if (!found) {

          bettingChips = [
            ...inGameChips.bettingChips,
            { ...chip, 
              position:position,
              last_selection: strat
            }
          ];
        }
    }

    var rev_accounts = accounts.map(account => {
      return account.accountId === chip.accountId
        ? {
            ...account,
            position: position,
            last_selection: strat
          }
        : account;
    });
    accounts=rev_accounts;
    this.props.updateBet(
      insertChip(topSystems, position, {
        ...chip,
        position
      }),
      insertChip(bottomSystems, position, {
        ...chip,
        position
      }),
      insertChip(leftSystems, position, {
        ...chip,
        position
      }),
      insertChip(rightSystems, position, {
        ...chip,
        position
      }),
      { balanceChips, bettingChips },
      accounts
      
    );
    console.log(inGameChips);

    var bets={};
    var account_params=accounts.map(account => {
      if (account.chip_id == chip.chip_id) {
        account.chip_id=chip.chip_id;
        //account.chip_location=chip.chip_location;
        //account.prev_selection=account.last_selection;
        //account.position=chip.last_selection;
        //account.last_selection=account.last_selection;
      }
      bets[account.chip_id]=account.chip_location;
      return account;
    });

    this.setState({bets, account_params})
   



  }

  addBettingChip = (chip, position, isAnti, strat) => {
        var self=this;
        var {
          topSystems,
          bottomSystems,
          leftSystems,
          rightSystems,
          inGameChips, 
          accounts
        } = this.props;

        var origPosition=chip.orig_position;
        var origChip=chip;
        var origStrat=chip.orig_last_selection;

        console.log(accounts);
        this.moveOnBoard(chip,position,strat);

       
  };

  /**
   * Removes the chip from its older betting position to off location
   * That basically moves your chip to balance chips.
   * @function moveToBalance
   * @param {any} chip
   */
  moveToBalance = chip => {
      var self=this;
      var {
        topSystems,
        bottomSystems,
        leftSystems,
        rightSystems,
        inGameChips, 
        accounts
      } = this.props;
        /**
         * When chip is moved to off location from some betting position.
         */

         
        var origPosition=chip.orig_position;
        var origChip=chip;
        var origStrat=chip.orig_last_selection;
        this.moveOnBoard(chip, chip.position, chip.last_selection);

  };

  reset = () => {
    this.props.reset();
  };

  nextDay = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.nextDay();
    }, 1000);
  };


  updateDate = simdate => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.updateDate(simdate);
    }, 1000);
  };

  toggleMode= () => {
    if (this.state.boardMode == 'live') {
      window.location.href='/practice_board';
      this.toggleSim();
      
    } else {
      this.toggleLive();

    }
  };
  toggleSim = () => {
      //$('.isLive').hide();
      //$('.isSim').show();
      this.setState({toggleActive:false, boardMode:'practice'});

  }
  toggleLive = () => {
    //$('.isLive').show();
    //$('.isSim').hide();
    this.setState({toggleActive:true,boardMode:'live'});

  }
  
  sendNotice = msg => {
    this.props.addTimedToaster(
      {
        id: "board_notice_" + Math.random().toFixed(3),
        text: msg
      },
      5000
    );

  }
  
  
  checkLock=() => {
    console.log("Lock Check")
    var self=this;
    
    //console.log(this.props);
    axios
    .post("/utility/lock_check/", {
    // accounts: [{ portfolio, target, accountValue }],
    'username':  this.props.email,
    'chip_id': 'ALL'
    },{timeout: 600000})
    .then(({ data }) => {
      console.log('received lock check')
      console.log(data);
      if (data.message != "OK") {
        this.sendNotice(data.message);
        
       
      } else 
        window.location='/new_board'
    })
    .catch(error => {
      this.sendNotice('Account Data not received: ' + JSON.stringify(error));
      console.log('error initializing')
      console.log(error)
    // eslint-disable-next-line react/no-is-mounted
      this.setState({
        rankingLoading: false,
        rankingError: error,
        loading:false,
        refreshing:false
      });
      window.location='/board'

    });

  }


  render() {
    var self=this;
    const {
      
      isAuth,
      rdAccepted,
      tosAccepted,
      simulatedDate,
      last3DaysProfits,
      leftSystems,
      rightSystems,
      topSystems,
      bottomSystems,
      inGameChips,
      themes
    } = this.props;
    //console.log(this.props);
    const dates = uniq(
      Object.values(last3DaysProfits)
        // ***hack*** to avoid crash when we dont have pnlData for that particular account
        // which is possible in tier 0 as the pnlData is fed from performanceData and
        // that happens when a new bet is placed which only gets performanceData for the account
        // that particular bet is using.
        // Remove hack when we have proper data feed for changePercent per account basis
        .map(profitObj => Object.keys(profitObj || {}))
        .reduce((acc, curr) => acc.concat(curr), [])
        .filter(date => !isNaN(Number(date)))
        .sort((d1, d2) => Number(d1) > Number(d2))
    );
    const nextDate = dates[dates.indexOf(simulatedDate) + 1];
    if (isAuth) {
      if (!(rdAccepted && tosAccepted)) {
        return <Redirect to="/auth?signin" />;
      }
    }
    const {
      animateSimulateButton,
      loading,
      boardMode,
      toggleActive,
    } = this.state;

    if (this.state.loading || this.state.refreshing) {
        return ( 

          <Aux>
            
            <center>
             <ClockLoader show={true} />
             <br/>
             <b>Please wait while we load your board. This could take a couple of minutes.</b>
            </center>
          </Aux>

        );
      } else {
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

      if (!self.state.date_picked && this.state.simData) {
          var simData=this.state.simData;
          var simDates=simData.available_dates
          var simHtml=[];
          var iconWidth=200;
          var idx=0;
          var isLast=false;
          var lastDate="";
          Object.keys(simDates).map(key => {
            lastDate=simDates[key];
          })
          var lastitem=<td key={'lastitem'} style={{ border:0, cursor:'pointer' }}>
                <center>
                    <br />
                    <br />
                Select Custom Start Date <br/>
                <img src="/images/practice_5days.png" width={iconWidth} onClick={() => {
                    $('#custom_datepick').show();
                }} />
                <div style={{display:"none"}} id={'custom_datepick'}                 
                
                onClick={(e) => {
                  if (e.target.toString() == "[object HTMLDivElement]") {
                    //alert(e.target.toString())
                    if (e.target.classList.contains("react-datepicker__portal")) {
                      $('#custom_datepick').hide();
                    }
                  }
                  console.log(e.target)
                  
                }}
>
                <DatePicker
                inline
                withPortal
                highlightDates={
                  [
                    { "react-datepicker__day--highlighted": Object.keys(simDates).map(key => {
                        return new moment(simDates[key]);
                      })
                    }
                  ]
                }
                onChange={(e) => {
                   
                    var date=e.format('YYYYMMDD')
                    console.log(date);
                    var hasDate=false;
                    Object.keys(simDates).map(key => {
                      if (date == new moment(simDates[key]).format('YYYYMMDD'))
                        hasDate=true;
                    })
                    if (hasDate) {

                      window.location='/practice_board?date_picked=' + date

                    }
                }}
                shouldCloseOnSelect={false}
                //selected={new moment(lastDate)}
                //value={self.state.date_picked}
                />
                </div>
                        </center>                
                        </td>
          while (idx < simData.simulations.length) {
            var item=Object.assign({}, simData.simulations[idx]);
            var items=[];
            if (item && item.png) {
              items.push(<td key={'item' + idx} style={{ border:0, cursor:'pointer' }}
               
              >
              {item.start_date ? 
              <Link to={'/practice_board?date_picked=' + item.start_date}
                onClick={() => {
                  self.props.silenceHtmlDialog();

                }}
              >
              <center>
              <br />
              <br />
              {item.description}
              
              <br/>
              <img src={"/images/" + item.png }  width={iconWidth} />
              </center>
              </Link>
              : <center>
              <br />
              <br />
              {item.description}
              
              <br/>
              <img src={"/images/" + item.png }  width={iconWidth} />
              </center>
              }
              </td>);
              console.log(item);
              idx+=1;
              
              var item2=Object.assign({}, simData.simulations[idx]);
              if (item2 && item2.png) {
                items.push(<td  key={'item' + idx}  style={{ border:0, cursor:'pointer' }}
                  >
                   {item2.start_date ? <Link to={'/practice_board?date_picked=' + item2.start_date}
                      onClick={() => {
                        self.props.silenceHtmlDialog();

                      }}
                    >
                  <center>
                  <br />
                  <br />

                  {item2.description}
                  
                  <br/>
                  <img src={"/images/" + item2.png } width={iconWidth} />
                  </center>
                  </Link> : 
                  <center>
                  <br />
                  <br />

                  {item2.description}
                  
                  <br/>
                  <img src={"/images/" + item2.png } width={iconWidth} />
                   </center>}
                  </td>);
              } else {
                isLast=true;
              }
              idx+=1;

              var item3=Object.assign({}, simData.simulations[idx]);
              if (item3 && item3.png) {
                items.push(<td  key={'item' + idx}  style={{ border:0, cursor:'pointer' }}
                  >
                   {item3.start_date ? <Link to={'/practice_board?date_picked=' + item3.start_date}
                      onClick={() => {
                        self.props.silenceHtmlDialog();

                      }}
                    >
                  <center>
                  <br />
                  <br />

                  {item3.description}
                  
                  <br/>
                  <img src={"/images/" + item3.png } width={iconWidth} />
                  </center>
                  </Link> : 
                  <center>
                  <br />
                  <br />

                  {item3.description}
                  
                  <br/>
                  <img src={"/images/" + item3.png } width={iconWidth} />
                   </center>}
                  </td>);
              } else {
                isLast=true;
              }
              idx+=1;
            } else {
              isLast=true;
            }
            if (isLast) {
             
              items.push(lastitem);
              
            }
            simHtml.push(
                
                <tr key={"row" + idx}>
                    {items}
                </tr>
            );

          }
          if (!isLast) {
            idx+=1;
            simHtml.push(
                
              <tr key={"row" + idx}>
                  {lastitem}
              </tr>
          );
          }

          return (
        <div style={{ background: 'white'} }>
        <center>
            <h3>Select 5-Day Simulation</h3>
            <table style={{ border:0 }}>
            
            <tbody>
                {simHtml}
            </tbody>

            </table>
            <br/>
            <Button flat raised onClick={() => {
                self.props.silenceHtmlDialog();
            }}>Cancel</Button>
          </center>
        </div>
      ) 
    }
      
      
      return (

        <Aux id={'liveboard'}>
          
          <LiveDashboard isPractice={true} sendNotice={this.sendNotice} initializeLive={this.initializeLive}
            />


          <div className={classes.ActionRow} style={{background:actionBg, backgroundRepeat: "no-repeat",
                backgroundSize: "62px 62px",color:heatmapTxt}}>
              <span style={{color:switchTxt, "float": "left", "width": "70%", "height":"75px", "textAlign": "left", "verticalAlign":"middle", zIndex:1}}>

               <table><tbody><tr>
               <td style={{border:0, textAlign:'left'}}>
                              <Link  style={{textDecoration: "none", color:'black',textAlign:'left',fontSize: "12px"}} to="/board">
                            <span>
                               <div style={{
                  
                                  background:this.props.themes.live.action_row.switch_fill, 
                                  color:this.props.themes.live.action_row.switch_text, 
                                  marginTop:"-20px",
                                  height:"60px", 
                                  lineHeight:"10px", 
                                  verticalAlign:"middle",
                                  borderRadius: "200px",
                                  width:"200px",
                                  zIndex:2,
                                
                                }}

                                >
                              <span style={{marginTop:"0px",  color:switchTxt, zIndex:3,}}>
                              <h4 style={{marginLeft:"70px", paddingTop:"21px"}} > 
                              Practice
                              </h4>

                              </span>
                                </div>
                            </span>
                            <span style={{marginLeft:"0px"}}>
                            <img src="/images/switch_toggle.png" style={{marginTop:"-84px", maxWidth:"60px"}} width={60} />
                            </span>                            
                              </Link>

                            

               </td>
                    <td  style={{border:0, textAlign:'center'}}>
                    <div style={{ marginTop:"-22px"}}>
                    {this.state.simulate_dates.length ? 
                    <PracticeClock  
                      loading={this.state.refreshing} 
                      sendNotice={this.sendNotice} 
                      date_picked={this.state.simulate_dates[1]} 
                      initializeLive={this.initializeLive}  
                      nextSimulationDay={this.nextSimulationDay} />
                      : null}
                    </div>
                    </td>
                    <td  style={{border:0, textAlign:'center'}}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      
                    </td>
                    </tr></tbody></table>

              </span>
              <span style={{"float": "left", "width": "30%", "height":"90px", "textAlign": "right", "verticalAlign":"middle"}}>
                  <span style={{"float": "left", "width": "80%", "height":"90px", "textAlign": "left", "verticalAlign":"middle"}}> 
                    <div className="isLive">
                      <center><b style={{color:heatmapTxt}} >{this.props.themes.live.heatmap.top_text}</b></center>
                      <div style={{  "border": "1px solid",
                                      "background": themes_bg,
                                      "width":"100%",
                                      "height":"45px",  
                                    }}>
                                    &nbsp;
                                    <br/>
                      </div>
                      <div>
                        <span style={{"float": "left", "width": "50%", "textAlign": "left", color:heatmapTxt}}>
                        {this.props.themes.live.heatmap.bottom_left}
                        </span>
                        <span style={{"float": "left", "width": "50%", "textAlign": "right", color:heatmapTxt}}>
                        {this.props.themes.live.heatmap.bottom_right}
                        </span>
                      </div>
                    </div>
                </span>
                <span style={{"float": "left", "width": "20%", "height":"90px", "textAlign": "right", "verticalAlign":"top"}}>
                    <img src="/images/infotext_button.png" width="22"/>
                </span>
          </span>
        </div>
        <div
            className={classes.Board}
            style={
              {
                background: board_bg,
                //backgroundImage: "url(" + bgBoard + ")",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                paddingTop: "50px",
                paddingBottom: "100px",
                //paddingRight: "150px",
                            } // marginTop: "5%",
            }
          >
            <div>
              <span style={{"marginTop":"-50px","float": "left", "width": "50%", "textAlign": "left", "display": "inline-block","verticalAlign": "top"}}>
              <br/>
              </span>
              <span style={{"marginTop":"-50px", "float": "right", "width": "50%",  "textAlign": "right",  "display": "inline-block", "verticalAlign":"top"}}>
                <img src="/images/infotext_button.png" width="22" style={{"margin":"10px"}} />
              </span>
            </div>
            <Panel
              isLive={true}
              isPractice={true}
              accounts={this.props.accounts || {}}
              leftSystems={leftSystems || []}
              rightSystems={rightSystems || []}
              bottomSystems={bottomSystems || []}
              topSystems={topSystems || []}
              balanceChips={this.props.inGameChips.balanceChips || []}
              bettingChips={this.props.inGameChips.bettingChips || []}
              addBettingChip={this.addBettingChip}
              moveToBalance={this.moveToBalance}
              initializeLive={this.initializeLive}
            />
              <span style={{"marginTop":"30px","float": "left", "width": "50%", "textAlign": "left", "display": "inline-block","verticalAlign": "top"}}>
                <br/>  
              </span>
              {self.props.mute ? (
              <span style={{"marginTop":"60px", "paddingRight":"5px", "float": "right", "width": "50%", "textAlign": "right", "display": "inline-block","verticalAlign": "top"}}>
                <a title="Turn sounds on" href='#soundbutton' onClick={() => { self.props.setMute(false);  } }><img src="/images/sound_off_button.png" width="30"/></a><br/>
              </span>
              ) :
              (
              <span style={{"marginTop":"60px","paddingRight":"5px","float": "right", "width": "50%", "textAlign": "right", "display": "inline-block","verticalAlign": "top"}}>
                <a title="Turn sounds off" href='#soundbutton' onClick={() => { self.props.setMute(true); } }><img src="/images/sound_on_button.png" width="30"/></a><br/>
              </span>

              )}



          </div>
          <Markets link={'board'} refreshing={this.state.refreshing} />
        </Aux>
      );
    }
  }
}
