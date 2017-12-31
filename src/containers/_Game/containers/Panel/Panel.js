import React, { Component } from "react";
// import PropTypes from "prop-types";
import classes from "./Panel.css";
import Slot from "../Slot/Slot";
import RiskStrip from "../../components/_RiskStrip/_RiskStrip";
import Config, * as SystemTypes from "../../Config";
import BottomSection from "../../components/Sections/BottomSection/BottomSection";
import LeftSection from "../../components/Sections/LeftSection/LeftSection";
import RightSection from "../../components/Sections/RightSection/RightSection";
import TopSection from "../../components/Sections/TopSection/TopSection";
class Panel extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    const slotsGrid = [];
    let off = true;
    for (let xIndex = 0; xIndex < 12; xIndex++) {
      let column = [];
      for (let yIndex = 0; yIndex < 3; yIndex++) {
        column.push(
          <Slot
            key={"slot-" + xIndex + "-" + yIndex}
            position={yIndex + 3 * xIndex + 1}
          />
        );
      }
      slotsGrid.push(
        <div key={"slotColumn-" + xIndex} className={classes.Column}>
          <RiskStrip
            system={off ? SystemTypes.RISK_OFF : SystemTypes.RISK_ON}
          />
          {column}
        </div>
      );
      off = !off;
    }
    return (
      <div className={classes.Panel}>
        {slotsGrid}
        <BottomSection systems={Object.keys(Config)} />
        <LeftSection systems={Object.keys(Config)} />
        <RightSection systems={Object.keys(Config)} />
        <TopSection systems={Object.keys(Config)} />
      </div>
    );
  }
}

export default Panel;
