import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Panel.css";
import Slot from "../Slot/Slot";
import RiskStrip from "../../components/_RiskStrip/_RiskStrip";
import Config from "../../Config";
import BottomSection from "../../components/Sections/BottomSection/BottomSection";
import LeftSection from "../../components/Sections/LeftSection/LeftSection";
import RightSection from "../../components/Sections/RightSection/RightSection";
import TopSection from "../../components/Sections/TopSection/TopSection";

const blankSystem = {
  id: "BLANK",
  ...Config.BLANK
};

/**
 * Panel component that holds the state of the board game and all the board components.
 *
 * @class Panel
 * @extends {Component}
 */
class Panel extends Component {
  /**
   * Creates an instance of Panel.
   * @param {Object} props
   * @memberof Panel
   */
  constructor(props) {
    super(props);
    this.state = {
      /**
       * @example slot = {topSystem={}, bottomSystem: {}, leftSystem: {}, rightSystem: {}, heldChips: []}
       */
      slots: [],
      maxHeight: 0,
      maxWidth: 0,
      topSystems:
        props.topSystems && props.topSystems.length
          ? props.topSystems
          : [blankSystem],
      bottomSystems:
        props.bottomSystems && props.bottomSystems.length
          ? props.bottomSystems
          : [blankSystem],
      leftSystems: props.leftSystems,
      rightSystems: props.rightSystems
    };
  }
  /**
   * @function componentWillMount Component will mount hook of Panel component that builds the [static] board
   * @memberof Panel
   */
  componentWillMount() {
    const { topSystems, bottomSystems, leftSystems, rightSystems } = this.state;
    const slots = [],
      sideSystems = [],
      maxHeight = Math.max(leftSystems.length, rightSystems.length) + 1,
      maxWidth =
        topSystems.length * bottomSystems.length ||
        topSystems.length ||
        bottomSystems.length;
    for (let i = 0; i < maxHeight; i++) {
      sideSystems.push({
        left: leftSystems[i] || blankSystem,
        right: rightSystems[i] || blankSystem
      });
    }
    bottomSystems.forEach(bottomSystem => {
      topSystems.forEach(topSystem => {
        sideSystems.forEach(sideSystem => {
          slots.push({
            leftSystem: sideSystem.left,
            rightSystem: sideSystem.right,
            topSystem,
            bottomSystem,
            heldChips: []
          });
        });
      });
    });
    this.setState({ slots, maxHeight, maxWidth });
  }

  addChipToSlot = (chip, slot) => {
    debugger;
  };

  render() {
    const slotsGrid = [];
    const { maxWidth, maxHeight, slots, topSystems } = this.state;
    let slot = null;
    for (let xIndex = 0; xIndex < maxWidth; xIndex++) {
      const column = [];
      for (let yIndex = 0; yIndex < maxHeight; yIndex++) {
        slot = slots[xIndex * maxHeight + yIndex];
        column.push(
          <Slot
            key={"slot-" + xIndex + "-" + yIndex}
            position={yIndex + maxHeight * xIndex + 1}
            topSystem={slot.topSystem}
            bottomSystem={slot.bottomSystem}
            leftSystem={slot.leftSystem}
            rightSystem={slot.rightSystem}
            heldChips={slot.heldChips}
          />
        );
      }
      slotsGrid.push(
        <div key={"slotColumn-" + xIndex} className={classes.Column}>
          <RiskStrip system={topSystems[xIndex % topSystems.length]} />
          {column}
        </div>
      );
    }
    return (
      <div className={classes.Panel}>
        {slotsGrid}
        <BottomSection
          systems={this.props.bottomSystems}
          topSystems={this.props.topSystems}
        />
        <LeftSection systems={this.props.leftSystems} />
        <RightSection systems={this.props.rightSystems} />
        <TopSection
          systems={this.props.topSystems}
          balanceChips={this.props.balanceChips}
        />
      </div>
    );
  }
}

Panel.propTypes = {
  topSystems: PropTypes.array,
  bottomSystems: PropTypes.array,
  leftSystems: PropTypes.array,
  rightSystems: PropTypes.array,
  balanceChips: PropTypes.array
};

export default Panel;
