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
import OrderDialog from "../OrderDialog/OrderDialog";
// import { connect } from "react-redux";
// import * as actions from "../../../../store/actions";

const blankSystem = {
  id: "BLANK",
  ...Config.BLANK
};

// /**
//  *
//  * @function dispatchToProps returns object with keys that would later become props.
//  * @param {function} dispatch redux action dispatcher function
//  * @returns nothing
//  */
// const dispatchToProps = dispatch => {
//   return {
//     showDialog: (title, message, onSuccess, onCancel) => {
//       dispatch(actions.showDialog(title, message, onSuccess, onCancel));
//     },
//     killDialog: () => {
//       dispatch(actions.killDialog());
//     }
//   };
// };

// /**
//  * Redux connect
//  */
// @connect(null, dispatchToProps)
// /**
//  * Panel component that holds the state of the board game and all the board components.
//  *
//  * @class Panel
//  * @extends {Component}
//  *
//  */
export default class Panel extends Component {
  /**
   * Creates an instance of Panel.
   * @constructor
   * @param {Object} props
   * @memberof Panel
   *
   *
   *
   */

  constructor(props) {
    super(props);
    this.state = {
      /**
       * @example slot = {topSystem={}, bottomSystem: {}, leftSystem: {}, rightSystem: {}, heldChips: []}
       *
       *
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
      rightSystems: props.rightSystems,
      /**
       * Related to Order Dialogue
       */
      // showOrderDialog: false,
      // orderChip: null,
      // orderSlot: null
      showOrderDialog: true,
      orderChip: {
        accountId: "5K_0_1516105730",
        display: "5K",
        accountValue: 5000,
        portfolio: ["TU", "BO"],
        qty: "{'TU': 2, 'BO': 1}",
        target: 250,
        totalMargin: 1925,
        maxCommissions: 8.100000000000001,
        created: 1516105728,
        updated: 1516105730,
        count: 1
      },
      orderSlot: {
        position: 7,
        topSystem: {
          id: "RISK_OFF",
          color: "black",
          position: "top",
          display: "Risk Off",
          description:
            "Opposite of RiskOn signals. (Fixed Signals consisting of Long precious metals and bonds, Short all other risky assets)",
          column: "riskOff"
        },
        bottomSystem: {
          id: "HIGHEST_EQ",
          color: "#0049c1",
          position: "bottom",
          display: "Highest Eq.",
          description:
            "Machine learning system prioritizing signals from best performing systems.",
          column: "highEq"
        },
        leftSystem: {
          id: "PREVIOUS_1_DAY",
          color: "pink",
          position: "left",
          display: "Previous (1 day)",
          description:
            "Previous trading days signals. For example if gold went up the previous day, the signal would be LONG.",
          column: "prev1"
        },
        rightSystem: {
          id: "PREVIOUS_5_DAYS",
          color: "yellow",
          position: "right",
          display: "Previous (5 days)",
          description:
            "Previous trading days signals. For example if gold went up the previous day, the signal would be LONG.",
          column: "prev5"
        },
        heldChips: []
      }
    };
  }

  /**
   * @function componentWillMount Component will mount hook of Panel component that builds the [static] board
   * @memberof Panel
   *
   *
   *
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
    let position = 1;
    bottomSystems.forEach(bottomSystem => {
      topSystems.forEach(topSystem => {
        sideSystems.forEach(sideSystem => {
          slots.push({
            leftSystem: sideSystem.left,
            rightSystem: sideSystem.right,
            topSystem,
            bottomSystem,
            position
          });
          position++;
        });
      });
    });
    this.setState({ slots, maxHeight, maxWidth });
  }

  /**
   *
   * @function moveChipToSlot Puts the betting of size of the chip on a particular position
   * @param {{accountId: string, display: string}} chip
   * @param {int|string} slotNumber
   *
   *
   *
   */

  moveChipToSlot = (chip, position) => {
    // Open order dialogue
    const slot = this.state.slots.find(slot => slot.position === position);
    if (slot) {
      this.setState({
        showOrderDialog: true,
        orderChip: chip,
        orderSlot: slot
      });
    }
  };

  /**
   *
   * @function heldChips returns the array of chips held at a particular position.
   * @param {int|string} position gets position
   * @returns {chips[]} returns array of betting chips
   * @memberof Panel
   *
   *
   *
   */

  heldChips(position) {
    return this.props.bettingChips.filter(chip => chip.position === position);
  }

  toggleOrderDialog = () => {
    this.setState(prevState => ({
      showOrderDialog: !prevState.showOrderDialog
    }));
  };

  /**
   *
   * @function render Render of Panel component
   * @returns {object} jsx element
   * @memberof Panel
   *
   *
   *
   */

  render() {
    const slotsGrid = [];
    const {
      maxWidth,
      maxHeight,
      slots,
      topSystems,
      showOrderDialog,
      orderSlot,
      orderChip
    } = this.state;

    let slot = null;

    for (let xIndex = 0; xIndex < maxWidth; xIndex++) {
      const column = [];
      for (let yIndex = 0; yIndex < maxHeight; yIndex++) {
        slot = slots[xIndex * maxHeight + yIndex];
        column.push(
          <Slot
            key={"slot-" + xIndex + "-" + yIndex}
            position={slot.position}
            topSystem={slot.topSystem}
            bottomSystem={slot.bottomSystem}
            leftSystem={slot.leftSystem}
            rightSystem={slot.rightSystem}
            heldChips={this.heldChips(yIndex + maxHeight * xIndex + 1)}
            moveChipToSlot={this.moveChipToSlot}
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
          systems={this.state.bottomSystems}
          topSystems={this.state.topSystems}
        />
        <LeftSection systems={this.state.leftSystems} />
        <RightSection systems={this.state.rightSystems} />
        <TopSection
          systems={this.state.topSystems}
          balanceChips={this.props.balanceChips}
        />
        {showOrderDialog ? (
          <OrderDialog
            slot={orderSlot}
            chip={orderChip}
            toggle={this.toggleOrderDialog}
            successHandler={this.props.addBettingChip}
          />
        ) : null}
      </div>
    );
  }

  static propTypes = {
    topSystems: PropTypes.array,
    bottomSystems: PropTypes.array,
    leftSystems: PropTypes.array,
    rightSystems: PropTypes.array,
    balanceChips: PropTypes.array,
    bettingChips: PropTypes.array,
    addBettingChip: PropTypes.func.isRequired
  };
}
