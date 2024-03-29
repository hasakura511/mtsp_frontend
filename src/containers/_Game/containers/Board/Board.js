
import React, { Component } from "react";
import Panel from "../Panel/Panel";
import classes from "./Board.css";
import bgBoard from "../../../../assets/images/boardBg.png";
import Config from "../../Config";
import ChipsConfig from "../../ChipsConfig";
import protectedComponent from "../../../../hoc/ProtectedComponent/ProtectedComponent";
import Aux from "../../../../hoc/_Aux/_Aux";
// import Dashboard from "../../components/Dashboard/Dashboard";
import Dashboard from "../../components/Dashboard/Dashboard";
import Bettings from "../../BettingConfig";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { toWordedDate, uniq, toStringDate } from "../../../../util";
import Clock from "../Clock/Clock";
import Toggle from 'react-bootstrap-toggle'
import axios from "../../../../axios-gsm";
import { Link } from "react-router-dom";

const systems = [];
for (let key in Config) {
  systems.push({
    id: key,
    ...Config[key]
  });
}

/**
 * create dummy systems arrays
 */
const { leftSystems, rightSystems, bottomSystems, topSystems } = systems.reduce(
  (acc, system) => {
    if (acc[system["position"] + "Systems"]) {
      acc[system["position"] + "Systems"].push(system);
    } else {
      acc[system["position"] + "Systems"] = [system];
    }
    return acc;
  },
  {}
);

/**
 * create dummy balanceChips array
 */

const inGameChips = {
  balanceChips: ChipsConfig.map(chip => {
    chip["count"] = 1;
    return chip;
  }),
  bettingChips: []
};

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
    tosAccepted: state.auth.tosAccepted,
    rdAccepted: state.auth.rdAccepted,
    currentBets: state.betting.currentBets,
    simulatedDate: state.betting.simulatedDate,
    last3DaysProfits: state.betting.last3DaysProfits,
    accounts:state.betting.accounts,
    initializeData:state.betting.initializeData,
    leftSystems:state.betting.leftSystems,
    topSystems:state.betting.topSystems,
    rightSystems:state.betting.rightSystems,
    bottomSystems:state.betting.bottomSystems,
    
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
    updateDate: (simdate) => {
      dispatch(actions.updateDate(simdate));

    },
    initializeData: (data) => {
      dispatch(actions.initializeData(data));
      
    },
    authSuccess: (user, token) => {
      dispatch(actions.authSuccess(user, token));
    },
    finishLoading: () => {
      dispatch(actions.finishLoading());
    }

  };
};

// @protectedComponent
@connect(stateToProps, dispatchToProps)

/**
 * Board component, that encapsulates our board-game, drag-drop-lifecycle
 *
 * @class Board
 * @extends {Component}
 */
export default class Board extends Component {
  static propTypes = {
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    authSuccess: PropTypes.func.isRequired,
    accounts:PropTypes.array.isRequired,
    finishLoading:PropTypes.func.isRequired,
    nextDay: PropTypes.func.isRequired,
    updateDate: PropTypes.func.isRequired,
    initializeData: PropTypes.func.isRequired,
    toggleMode: PropTypes.func.isRequired,
    isAuth: PropTypes.bool.isRequired,
    tosAccepted: PropTypes.bool.isRequired,
    rdAccepted: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    currentBets: PropTypes.object.isRequired,
    simulatedDate: PropTypes.string.isRequired,
    last3DaysProfits: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      /**
       * Systems on four sides, left/right/top/bottom
       */
      leftSystems: [],
      rightSystems: [],
      topSystems: [],
      bottomSystems: [],
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
      boardMode: 'practice',
      toggleActive:false,
      initializeData:{},
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
    this.setState({
      leftSystems,
      rightSystems,
      topSystems,
      bottomSystems,
      inGameChips
    });
    var date=new Date();
    var day = date.getDate().toString();
    if (day.length == 1)
      day = "0" + day;
    var monthIndex = date.getMonth().toString();
    if (monthIndex.length == 1)
      monthIndex="0" + monthIndex;
    var year = date.getFullYear();
    var datestr=year.toString()+monthIndex.toString()+day.toString();
    //this.props.updateDate(datestr);
    
  }

  componentDidMount() {

    
    console.log(this.props);
    this.props.finishLoading();


  }

  /**
   *
   * @function addBettingChip transfers a chip from balanceChips to bettingChips
   * @param {any} chip a chip object
   * @param {any} position position of the bet, that could be a number or a system.
   * @todo find a better way to handle position of the bet.
   */
  addBettingChip = (chip, position, isAnti, strat) => {
    this.setState(
      ({
        topSystems,
        bottomSystems,
        leftSystems,
        rightSystems,
        inGameChips
      }) => {
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
                  position: position
                }
              : c;
          });
          return {
            inGameChips: { balanceChips, bettingChips },
            topSystems: insertChip(topSystems, position, {
              ...chip,
              position
            }),
            bottomSystems: insertChip(bottomSystems, position, {
              ...chip,
              position
            }),
            leftSystems: insertChip(leftSystems, position, {
              ...chip,
              position
            }),
            rightSystems: insertChip(rightSystems, position, {
              ...chip,
              position
            })
          };
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
          const bettingChips = [
            ...inGameChips.bettingChips,
            { ...chip, position }
          ];
          return {
            inGameChips: { balanceChips, bettingChips },
            topSystems: insertChip(topSystems, position, {
              ...chip,
              position
            }),
            bottomSystems: insertChip(bottomSystems, position, {
              ...chip,
              position
            }),
            leftSystems: insertChip(leftSystems, position, {
              ...chip,
              position
            }),
            rightSystems: insertChip(rightSystems, position, {
              ...chip,
              position
            })
          };
        }
      }
    );
  };

  /**
   * Removes the chip from its older betting position to off location
   * That basically moves your chip to balance chips.
   * @function moveToBalance
   * @param {any} chip
   */
  moveToBalance = chip => {
    this.setState(
      ({
        topSystems,
        bottomSystems,
        leftSystems,
        rightSystems,
        inGameChips
      }) => {
        /**
         * When chip is moved to off location from some betting position.
         */
        const balanceChips = inGameChips.balanceChips.map(c => {
          return c.accountId === chip.accountId
            ? { ...c, count: c.count + 1 }
            : c;
        });
        const bettingChips = inGameChips.bettingChips.filter(
          c => c.accountId !== chip.accountId
        );
        return {
          inGameChips: { bettingChips, balanceChips },
          topSystems: insertChip(topSystems, "off", chip),
          bottomSystems: insertChip(bottomSystems, "off", chip),
          leftSystems: insertChip(leftSystems, "off", chip),
          rightSystems: insertChip(rightSystems, "off", chip)
        };
      }
    );
  };

  reset = () => {
    this.setState({
      inGameChips,
      leftSystems,
      rightSystems,
      topSystems,
      bottomSystems
    });
    this.props.reset();
    this.props.finishLoading();
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
      this.toggleSim();
      
    } else {
      window.location.href='/board';
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
  
  
  render() {
    const {
      isAuth,
      rdAccepted,
      tosAccepted,
      simulatedDate,
      last3DaysProfits
    } = this.props;
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
      leftSystems,
      rightSystems,
      topSystems,
      bottomSystems,
      inGameChips,
      animateSimulateButton,
      loading,
      boardMode,
      toggleActive,
    } = this.state;

    
    return (
      <Aux>

        <Dashboard 
           />
        <div className={classes.ActionRow}>
          <span style={{"float": "left", "width": "20%", "height":"75px", "textAlign": "left", "verticalAlign":"middle"}}>
          <table><tbody><tr>
                          <td  style={{border:0, textAlign:'right', minWidth:"30px"}}>
                              <Link  style={{textDecoration: "none", color:'black',textAlign:'left',fontSize: "12px"}} to="/board">
                            <span>
                              <img src="/images/vertical_toggle.png" style={{maxWidth:"22px"}} width={22} />
                            </span>
                            <span style={{marginLeft:"-20px"}}>
                            <img src="/images/switch_toggle.png" style={{marginTop:"24px", maxWidth:"20px"}} width={18} />
                            </span>                            
                              </Link>
                          </td>

                          <td style={{border:0, textAlign:'left', minWidth:"80px"}}>
                              <span>
                              <Link  style={{textDecoration: "none", color:'black',textAlign:'left',fontSize: "12px"}} to="/board">
            
                              <b>Live</b><br/>
                              </Link>
                              <b  style={{textDecoration: "none", color:'black',textAlign:'left',fontSize: "12px"}} >Demo</b>
                              </span>


                            </td></tr></tbody></table>

            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>
          <span  style={{"float": "left", "width": "80%",  "minWidth":"600px", "height":"75px","whiteSpace": "nowrap","textAlign": "left", "verticalAlign":"top"}}>
            
            <span  style={{ "float": "left", "width": "20%", "minWidth":"100px", "height":"60px", "textAlign": "right", "verticalAlign":"middle"}}>
              <button
                  className="isSim"
                  onClick={this.reset}
                  title={"Reset the board to the first of February"}
                >
                <font size="2">
                <b>
                Reset Board
                </b>
                </font>
              </button>
            </span>
            <span  style={{"float": "left", "width": "450px", "height":"75px", "textAlign": "left", "verticalAlign":"top"}}>
            <Clock />
            </span>
            <span style={{"float": "left", "width": "20%", "minWidth":"100px", "height":"60px", "textAlign": "left", "verticalAlign":"middle"}}>
              <button               
              disabled={!nextDate}
              onClick={this.nextDay}
              title={
                nextDate
                  ? `Simulate market close for ${toWordedDate(nextDate)}`
                  : ""
              }
              className={
                animateSimulateButton
                  ? classes.bounce + " " + classes.animated + " isSim"
                  : " isSim"
                  }
              
            >
                <font size="2">
                <b>
              Simulate Next Day
                </b>
                </font>
            </button>


            </span>
      </span>
     
    </div>
    <div
          className={classes.Board}
          style={
            {
              backgroundImage: "url(" + bgBoard + ")",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              paddingTop: "150px",
              paddingBottom: "100px"
            } // marginTop: "5%",
          }
        >
          <div>
            <span style={{"marginTop":"-150px","float": "left", "width": "50%", "textAlign": "left", "display": "inline-block","verticalAlign": "top"}}>
            </span>
            <span style={{"marginTop":"-150px", "float": "right", "width": "50%",  "textAlign": "right",  "display": "inline-block", "verticalAlign":"top"}}>
            </span>
          </div>
          <Panel
            isLive={false}
            accounts={this.props.accounts || {}}
            leftSystems={leftSystems || []}
            rightSystems={rightSystems || []}
            bottomSystems={bottomSystems || []}
            topSystems={topSystems || []}
            balanceChips={inGameChips.balanceChips || []}
            bettingChips={inGameChips.bettingChips || []}
            addBettingChip={this.addBettingChip}
            moveToBalance={this.moveToBalance}
          />

s        </div>
      </Aux>
    );
  }
}
