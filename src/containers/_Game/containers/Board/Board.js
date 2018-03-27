import React, { Component } from "react";
import Panel from "../Panel/Panel";
import classes from "./Board.css";
import bgBoard from "../../../../assets/images/boardBg.png";
import Config from "../../Config";
import ChipsConfig from "../../ChipsConfig";
// import protectedComponent from "../../../../hoc/ProtectedComponent/ProtectedComponent";
import Aux from "../../../../hoc/_Aux/_Aux";
import Dashboard from "../../components/Dashboard/Dashboard";
import Bettings from "../../BettingConfig";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { toWordedDate } from "../../../../util";

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
    isAuth: state.auth.token !== null,
    tosAccepted: state.auth.tosAccepted,
    rdAccepted: state.auth.rdAccepted,
    currentBets: state.betting.currentBets,
    simulatedDate: state.betting.simulatedDate
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
    reset: () => {
      dispatch(actions.reset());
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
    nextDay: PropTypes.func.isRequired,
    isAuth: PropTypes.bool.isRequired,
    tosAccepted: PropTypes.bool.isRequired,
    rdAccepted: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    currentBets: PropTypes.object.isRequired,
    simulatedDate: PropTypes.string.isRequired
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
      animateSimulateButton: false
    };
  }

  componentWillReceiveProps() {
    !Object.values(this.props.currentBets)
      .map(o => o.position)
      .reduce((acc, o) => {
        if (o != "off") acc["notoff"] = true;
        return acc;
      }, {})["notoff"] && this.setState({ animateSimulateButton: true });
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
  }

  /**
   *
   * @function addBettingChip transfers a chip from balanceChips to bettingChips
   * @param {any} chip a chip object
   * @param {any} position position of the bet, that could be a number or a system.
   * @todo find a better way to handle position of the bet.
   */
  addBettingChip = (chip, position) => {
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
    this.setState({ inGameChips });
    this.props.reset();
  };

  render() {
    const { isAuth, rdAccepted, tosAccepted, simulatedDate } = this.props;
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
      animateSimulateButton
    } = this.state;
    return (
      <Aux>
        <Dashboard {...Bettings} />
        <div className={classes.ActionRow}>
          <button
            onClick={this.props.nextDay}
            title={`Simulate market close for ${toWordedDate(simulatedDate)}`}
            className={
              animateSimulateButton
                ? classes.bounce + " " + classes.animated
                : ""
            }
          >
            Simulate Next Day
          </button>
          <button
            onClick={this.reset}
            title={"Reset the board to the first of February"}
          >
            Reset Board
          </button>
        </div>
        <div
          className={classes.Board}
          style={
            {
              backgroundImage: "url(" + bgBoard + ")",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              paddingTop: "200px",
              paddingBottom: "100px"
            } // marginTop: "5%",
          }
        >
          <Panel
            leftSystems={leftSystems || []}
            rightSystems={rightSystems || []}
            bottomSystems={bottomSystems || []}
            topSystems={topSystems || []}
            balanceChips={inGameChips.balanceChips || []}
            bettingChips={inGameChips.bettingChips || []}
            addBettingChip={this.addBettingChip}
            moveToBalance={this.moveToBalance}
          />
        </div>
      </Aux>
    );
  }
}
