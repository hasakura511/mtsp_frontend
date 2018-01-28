import React, { Component } from "react";
import Panel from "../Panel/Panel";
import classes from "./Board.css";
import bgBoard from "../../../../assets/images/boardBg.png";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Config from "../../Config";
import ChipsConfig from "../../ChipsConfig";
import protectedComponent from "../../../../hoc/ProtectedComponent/ProtectedComponent";
import Aux from "../../../../hoc/_Aux/_Aux";
import Dashboard from "../../components/Dashboard/Dashboard";
import Bettings from "../../BettingConfig";

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

// @protectedComponent
@DragDropContext(HTML5Backend)
/**
 * Board component, that encapsulates our board-game, drag-drop-lifecycle
 *
 * @class Board
 * @extends {Component}
 */
export default class Board extends Component {
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
        balanceChips: [],
        /**
         * Betting Chips
         */
        bettingChips: []
      }
    };
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
    this.setState(prevState => {
      if (chip.position) {
        /**
         * When chip is moved from one betting position to other.
         */
        const balanceChips = [...prevState.inGameChips.balanceChips];
        const bettingChips = prevState.inGameChips.bettingChips.map(c => {
          return c.accountId === chip.accountId
            ? { ...c, position: position }
            : c;
        });
        return {
          inGameChips: {
            balanceChips,
            bettingChips
          }
        };
      } else {
        /**
         * When chip is moved from off location to a betting position.
         */
        const balanceChips = prevState.inGameChips.balanceChips.map(c => {
          return c.accountId === chip.accountId
            ? { ...c, count: c.count - 1 }
            : c;
        });
        const bettingChips = [
          ...prevState.inGameChips.bettingChips,
          { ...chip, position }
        ];
        return {
          inGameChips: {
            balanceChips,
            bettingChips
          }
        };
      }
    });
  };

  render() {
    const {
      leftSystems,
      rightSystems,
      topSystems,
      bottomSystems,
      inGameChips
    } = this.state;
    return (
      <Aux>
        <Dashboard {...Bettings} />
        <div
          className={classes.Board}
          style={{
            backgroundImage: "url(" + bgBoard + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            paddingTop: "200px",
            // marginTop: "5%",
            paddingBottom: "100px"
          }}
        >
          <Panel
            leftSystems={leftSystems || []}
            rightSystems={rightSystems || []}
            bottomSystems={bottomSystems || []}
            topSystems={topSystems || []}
            balanceChips={inGameChips.balanceChips || []}
            bettingChips={inGameChips.bettingChips || []}
            addBettingChip={this.addBettingChip}
          />
        </div>
      </Aux>
    );
  }
}
