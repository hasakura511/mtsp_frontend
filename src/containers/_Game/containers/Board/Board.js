import React, { Component } from "react";
import Panel from "../Panel/Panel";
import classes from "./Board.css";
import bgBoard from "../../../../assets/images/boardBg.png";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Config from "../../Config";
import ChipsConfig from "../../ChipsConfig";

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
const balanceChips = ChipsConfig.map(chip => {
  chip["count"] = 2;
  return chip;
});

class Board extends Component {
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

      /**
       * Balance Chips
       */
      balanceChips: []
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
      balanceChips
    });
  }

  render() {
    const {
      leftSystems,
      rightSystems,
      topSystems,
      bottomSystems,
      balanceChips
    } = this.state;
    return (
      <div
        className={classes.Board}
        style={{
          backgroundImage: "url(" + bgBoard + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          paddingTop: "200px",
          marginTop: "5%",
          paddingBottom: "100px"
        }}
      >
        <Panel
          leftSystems={leftSystems}
          rightSystems={rightSystems}
          bottomSystems={bottomSystems}
          topSystems={topSystems}
          balanceChips={balanceChips}
        />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Board);
