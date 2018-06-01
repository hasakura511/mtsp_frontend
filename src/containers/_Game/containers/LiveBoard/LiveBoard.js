
import React, { Component } from "react";
import Panel from "../Panel/Panel";
import classes from "./LiveBoard.css";
import bgBoard from "../../../../assets/images/boardBg.png";
import Config from "../../Config";
import ChipsConfig from "../../ChipsConfig";
import protectedComponent from "../../../../hoc/ProtectedComponent/ProtectedComponent";
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
import Toggle from 'react-bootstrap-toggle'
import axios from "../../../../axios-gsm";
import ClockLoader from "../../../../components/UI/ClockLoader/ClockLoader";
import { toSystem, toAntiSystem } from "../../Config";

/**
 * create dummy balanceChips array
 */



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
    addTimedToaster: toaster => {
        dispatch(actions.addTimedToaster(toaster, 5000))
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

@protectedComponent
@connect(stateToProps, dispatchToProps)

/**
 * Board component, that encapsulates our board-game, drag-drop-lifecycle
 *
 * @class Board
 * @extends {Component}
 */
export default class LiveBoard extends Component {
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
    themes:PropTypes.object.isRequired
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

  initializeLive=() => {
    if (this.state.refreshing)
      return;
    else
      this.setState({refreshing:true})
    //console.log(this.props);
    /*
    this.setState({
      loading:true,
    });
    */
    axios
    .post("/utility/initialize_live/", {
    // .get("https://api.myjson.com/bins/11pqxf", {
    //only 5k chip for tier 0
    // accounts: [{ portfolio, target, accountValue }],
    'username':  this.props.email,
    'reinitialize': 'false'
    },{timeout: 600000})
    .then(({ data }) => {
      console.log('received initialize_live data')
      // eslint-disable-next-line react/no-is-mounted
      console.log(data);


      this.props.initializeData(data);

      //this.props.updateDate();
      
      if (!this.state.loading)
        this.sendNotice("Board Refreshed with New Data");


      //this.sendNotice('Account Data Received');
      this.setState({
        loading:false,
        rankingLoading: false,
        rankingData: data.rankingData,
        refreshing:false
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

      this.initializeLive();

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

    var origPosition=position;

    console.log("inGameChips")
    console.log(inGameChips);

    console.log("topSystems")
    console.log(topSystems);
    chip.last_selection=strat;
    chip.position=position;
    console.log("moving with params");  
    console.log(strat);
    console.log(chip);

              // In case the chip is dropped on a system
              // we push it in system's heldChips in the inserChip method.
              if (chip.position) {
                /**
                 * When chip is moved from one betting position to other.
                 */
                const balanceChips = [...inGameChips.balanceChips];
                const bettingChips = inGameChips.bettingChips.map(c => {
                  return c.accountId === chip.accountId
                    ? {
                        ...c,
                        position: position,
                        last_selection: strat
                      }
                    : c;
                });
                var rev_accounts = accounts.map(account => {
                  return account.accountId === chip.accountId
                    ? {
                        ...account,
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
              } else {
                /**
                 * When chip is moved from off location to a betting position.
                 */
                const balanceChips = inGameChips.balanceChips.map(c => {
                  return c.accountId === chip.accountId
                    ? {
                        ...c,
                        count: c.count - 1
                      }
                    : c;
                });
                
                var rev_accounts2 = accounts.map(account => {
                  return account.accountId === chip.accountId
                    ? {
                        ...account,
                        last_selection: strat,
                      }
                    : account;
                });
                accounts=rev_accounts2;
                const bettingChips = [
                  ...inGameChips.bettingChips,
                  { ...chip, position }
                ];
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
              }
  }

  addBettingChip = (chip, position, isAnti, strat) => {
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

        
        this.moveOnBoard(chip,position,strat);

        axios
          .post("/utility/update_bet_live/", {
          // .get("https://api.myjson.com/bins/11pqxf", {
          //only 5k chip for tier 0
          // accounts: [{ portfolio, target, accountValue }],
          'account_id': chip.accountId,
          'chip_id':chip.chip_id,
          'strategy':strat,
          },{timeout: 600000})
          .then(({ data }) => {
            this.sendNotice(strat + ' Bet Placed' + JSON.stringify(data));
            if (data.message && data.message.match(/ERROR/)) {
              origChip.position=origPosition;
              origChip.last_selection=origStrat;
              console.log("error");
              console.log(origPosition);
              console.log(origStrat);

              this.moveOnBoard(origChip, origPosition, origStrat);
  
            }
          })
          .catch(error => {
            this.sendNotice('Error Placing Bet' + JSON.stringify(error));
            origChip.position=origPosition;
            origChip.last_selection=origStrat;
            this.moveOnBoard(origChip, origPosition, origStrat);
            //chip.position=origPosition;
            //this.moveToBalance(chip);
            console.log('error initializing')
            console.log(error)
          // eslint-disable-next-line react/no-is-mounted
            this.setState({
              rankingLoading: false,
              rankingError: error
            });
          });
      
  
  };

  /**
   * Removes the chip from its older betting position to off location
   * That basically moves your chip to balance chips.
   * @function moveToBalance
   * @param {any} chip
   */
  moveToBalance = chip => {
    
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

        

        const balanceChips = inGameChips.balanceChips.map(c => {
          return c.accountId === chip.accountId
            ? { ...c, count: c.count + 1 }
            : c;
        });
        const bettingChips = inGameChips.bettingChips.filter(
          c => c.accountId !== chip.accountId
        );
        
        var strat=chip.position;
        var rev_accounts2 = accounts.map(account => {
          return account.accountId === chip.accountId
            ? {
                ...account,
                last_selection: strat,
              }
            : account;
        });
        accounts=rev_accounts2;

        this.props.updateBet(
          insertChip(topSystems, "off", chip),
          insertChip(bottomSystems, "off", chip),
          insertChip(leftSystems, "off", chip),
          insertChip(rightSystems, "off", chip),
          { bettingChips, balanceChips },
          accounts
        );

        if (strat == 'off') 
          strat="Off";

        axios
          .post("/utility/update_bet_live/", {
          // .get("https://api.myjson.com/bins/11pqxf", {
          //only 5k chip for tier 0
          // accounts: [{ portfolio, target, accountValue }],
          'account_id': chip.accountId,
          'chip_id':chip.chip_id,
          'strategy':strat,
          },{timeout: 600000})
          .then(({ data }) => {
            this.sendNotice(strat + ' Bet Placed' + JSON.stringify(data));

            if (data.message && data.message.match(/ERROR/)) {
              origChip.position=origPosition;
              origChip.last_selection=origStrat;
              this.moveOnBoard(origChip, origPosition, origStrat);
  
            }

          })
          .catch(error => {
            this.sendNotice('Error Placing Bet' + JSON.stringify(error));
            console.log('error initializing')
            console.log(error)
            // eslint-disable-next-line react/no-is-mounted
            origChip.position=origPosition;
            origChip.last_selection=origStrat;

            this.moveOnBoard(origChip, origPosition, origStrat);

            this.setState({
              rankingLoading: false,
              rankingError: error
            });
          });
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
  
  render() {
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

    if (this.state.loading) {
        return ( 

          <Aux>
            
            <center>
             <ClockLoader show={loading} />
             <br/><br/>
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
      
      return (

        <Aux>

          <LiveDashboard sendNotice={this.sendNotice} initializeLive={this.initializeLive}
            />
          <div className={classes.ActionRow} style={{background:actionBg, color:heatmapTxt}}>
              <span style={{color:switchTxt, "float": "left", "width": "30%", "height":"75px", "textAlign": "left", "verticalAlign":"middle"}}>
                <Toggle
                onClick={this.toggleMode}
                on={<h2 style={{marginTop:"12px",color:switchTxt,}}>Live Mode</h2>}
                off={<h2  style={{marginTop:"12px"}}>Practice Mode</h2>}
                size="sm"
                active={this.state.toggleActive}
                style={{background:switchBg, color:switchTxt, height:"75px", lineHeight:"10px", verticalAlign:"middle"}}
                onstyle={"{background:" + switchBg + ", color:" + switchTxt + "}"}
                />
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </span>
              <span  style={{"float": "left", "width": "40%",  "minWidth":"600px", "height":"75px","whiteSpace": "nowrap","textAlign": "left", "verticalAlign":"top"}}>
                
                <Clock  loading={this.state.loading} sendNotice={this.sendNotice} initializeLive={this.initializeLive} />
              </span>
              <span style={{"float": "left", "width": "30%", "height":"90px", "textAlign": "right", "verticalAlign":"middle"}}>
                  <span style={{"float": "left", "width": "80%", "height":"90px", "textAlign": "left", "verticalAlign":"middle"}}> 
                    <div className="isLive">
                      <center><b style={{color:heatmapTxt}}>Heatmap Legend</b></center>
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
                        Low Reward / Risk
                        </span>
                        <span style={{"float": "left", "width": "50%", "textAlign": "right", color:heatmapTxt}}>
                        High Reward / Risk
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
                paddingTop: "150px",
                paddingBottom: "100px"
              } // marginTop: "5%",
            }
          >
            <div>
              <span style={{"marginTop":"-150px","float": "left", "width": "50%", "textAlign": "left", "display": "inline-block","verticalAlign": "top"}}>
              <img src="/images/edit_board_button.png" width="50"/><br/>  
              <img src="/images/leaderboard_button.png" width="50"/><br/>
              </span>
              <span style={{"marginTop":"-150px", "float": "right", "width": "50%",  "textAlign": "right",  "display": "inline-block", "verticalAlign":"top"}}>
                <img src="/images/infotext_button.png" width="22" style={{"margin":"10px"}} />
              </span>
            </div>
            <Panel
              isLive={true}
              accounts={this.props.accounts || {}}
              leftSystems={leftSystems || []}
              rightSystems={rightSystems || []}
              bottomSystems={bottomSystems || []}
              topSystems={topSystems || []}
              balanceChips={this.props.inGameChips.balanceChips || []}
              bettingChips={this.props.inGameChips.bettingChips || []}
              addBettingChip={this.addBettingChip}
              moveToBalance={this.moveToBalance}
            />
          </div>
        </Aux>
      );
    }
  }
}
