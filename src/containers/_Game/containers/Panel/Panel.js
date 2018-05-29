import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Panel.css";
import Slot from "../Slot/Slot";
import RiskStrip from "../../components/_RiskStrip/_RiskStrip";
import Config from "../../Config";
import ChipsConfig from "../../ChipsConfig";
import BottomSection from "../../components/Sections/BottomSection/BottomSection";
import LeftSection from "../../components/Sections/LeftSection/LeftSection";
import RightSection from "../../components/Sections/RightSection/RightSection";
import TopSection from "../../components/Sections/TopSection/TopSection";
import OrderDialog from "../OrderDialog/OrderDialog";
import axios from "../../../../axios-gsm";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import { toSlashDate,  getDateNowStr  } from "../../../../util";
import Title from "../OrderDialog/OffOrderDialogTitle";
/**
 * returns state to `Props` mapping object with keys that would later become props.
 * @function stateToProps
 * @param {Object} state redux current state
 * @returns {Object} props enhancement object
 */
const stateToProps = state => {
  return { simulatedDate: state.betting.simulatedDate,
           heatmap:state.betting.heatmap,
           heatmap_selection:state.betting.heatmap_selection 
           
          };
};

/**
 * returns distpatch to `Props` mapping object with keys that would later become props.
 * @function dispatchToProps
 * @param {function} dispatch dispatch redux action dispatcher function
 * @returns {Object} props enhancement object
 */
const dispatchToProps = dispatch => {
  return {

    addLast3DaysProfit(last3DaysProfit) {
      dispatch(actions.addLast3DaysProfit(last3DaysProfit));
    },
    addBet(bet) {
      dispatch(actions.addBet(bet));
    },
    showDialog() {
      dispatch(actions.showDialog(...arguments));
    },
    killDialog() {
      dispatch(actions.killDialog());
    },
    addTimedToaster(toaster) {
      dispatch(actions.addTimedToaster(toaster, -1));
    },
    showHeatmap(id) {
      dispatch(actions.showHeatmap(id));
    }

  };
};

const blankSystem = {
  id: "BLANK",
  ...Config.BLANK
};

// Redux connect
@connect(stateToProps, dispatchToProps)
/**
 * Panel component that holds the state of the board game and all the board components.
 *
 * @class Panel
 * @extends {Component}
 *
 */
export default class Panel extends Component {

  
  static propTypes = {
    topSystems: PropTypes.array,
    bottomSystems: PropTypes.array,
    leftSystems: PropTypes.array,
    rightSystems: PropTypes.array,
    balanceChips: PropTypes.array,
    bettingChips: PropTypes.array,
    accounts: PropTypes.array.isRequired,
    addBettingChip: PropTypes.func.isRequired,
    addLast3DaysProfit: PropTypes.func.isRequired,
    moveToBalance: PropTypes.func.isRequired,
    addBet: PropTypes.func.isRequired,
    simulatedDate: PropTypes.string.isRequired,
    showDialog: PropTypes.func.isRequired,
    killDialog: PropTypes.func.isRequired,
    addTimedToaster: PropTypes.func.isRequired,
    isLive:PropTypes.bool.isRequired,
    heatmap:PropTypes.object.isRequired,
    showHeatmap:PropTypes.func.isRequired,
    heatmap_selection:PropTypes.string,
    themes:PropTypes.object,
  };

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
      // showOrderDialog: true,
      // orderChip: {
      //   accountId: "5K_0_1516105730",
      //   display: "5K",
      //   accountValue: 5000,
      //   portfolio: ["TU", "BO"],
      //   qty: "{'TU': 2, 'BO': 1}",
      //   target: 250,
      //   totalMargin: 1925,
      //   maxCommissions: 8.100000000000001,
      //   created: 1516105728,
      //   updated: 1516105730,
      //   count: 1
      // },
      // orderSlot: {
      //   position: 7,
      //   topSystem: {
      //     id: "RISK_OFF",
      //     color: "black",
      //     position: "top",
      //     display: "Risk Off",
      //     description:
      //       "Opposite of RiskOn signals. (Fixed Signals consisting of Long precious metals and bonds, Short all other risky assets)",
      //     column: "riskOff"
      //   },
      //   bottomSystem: {
      //     id: "HIGHEST_EQ",
      //     color: "#0049c1",
      //     position: "bottom",
      //     display: "Highest Eq.",
      //     description:
      //       "Machine learning system prioritizing signals from best performing systems.",
      //     column: "highEq"
      //   },
      //   leftSystem: {
      //     id: "PREVIOUS_1_DAY",
      //     color: "pink",
      //     position: "left",
      //     display: "Previous (1 day)",
      //     description:
      //       "Previous trading days signals. For example if gold went up the previous day, the signal would be LONG.",
      //     column: "prev1"
      //   },
      //   rightSystem: {
      //     id: "PREVIOUS_5_DAYS",
      //     color: "yellow",
      //     position: "right",
      //     display: "Previous (5 days)",
      //     description:
      //       "Previous trading days signals. For example if gold went up the previous day, the signal would be LONG.",
      //     column: "prev5"
      //   },
      //   heldChips: []
      // }
      showOrderDialog: false,
      orderChip: null,
      orderSlot: null,
      rankingLoading: true,
      rankingData: [],
      rankingError: null
    };
    this._isMounted = false;
  }

  /**
   * @function componentWillMount Component will mount hook of Panel component that builds the [static] board
   * @memberof Panel
   *
   *
   *
   */

  componentWillMount() {

    
    this.makeBoard(this.props);
  }

  componentWillReceiveProps(newProps) {

    //console.log("Panel received new prop");
    //console.log(newProps.balanceChips);
    //console.log(newProps.bettingChips);
    this.makeBoard(newProps);

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

  makeBoard = (propData) => {
    const { topSystems, leftSystems, rightSystems, bottomSystems } = propData;
    this.setState({
      topSystems: topSystems && topSystems.length ? topSystems : [blankSystem],
      bottomSystems:
        bottomSystems && bottomSystems.length ? bottomSystems : [blankSystem],
      leftSystems: leftSystems,
      rightSystems: rightSystems
    });
    var slots = [],
      sideSystems = [],
      maxHeight = Math.max(leftSystems.length, rightSystems.length),
      maxWidth =
        topSystems.length * bottomSystems.length ||
        topSystems.length ||
        bottomSystems.length;

    if (maxHeight < 3) maxHeight+=1;
    
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
    this._isMounted = true;
  }
  moveChipToSlot = (chip, position) => {
    // Open order dialogue
    const {
      topSystems,
      bottomSystems,
      leftSystems,
      rightSystems,
      moveToBalance,
      addLast3DaysProfit,
      addBet,
      simulatedDate,
      showDialog,
      killDialog,
      addTimedToaster
    } = this.props;

    const system = [
      ...topSystems,
      ...bottomSystems,
      ...leftSystems,
      ...rightSystems
    ].find(sys => sys.column === position);
    const slot = this.state.slots.find(slot => slot.position === position);

    // __TEMPERORY_CODE__
    // disallow multiple chip on same position
    const betChip = this.props.bettingChips.find(c => c.position === position);
    if (betChip && !this.props.isLive)  {
      addTimedToaster({
        id: "move-chip-error",
        text: `This strategy is already in use for ${betChip.display} account.
               Multiple accounts on one strategy is available only in Live Mode.`
      });
      return undefined;
    }
    if (slot) {
      this.setState({
        showOrderDialog: true,
        orderChip: chip,
        orderSlot: slot
      });
    } else if (system) {
      const systemToSlot = {
        position: system.column,
        topSystem: blankSystem,
        bottomSystem: blankSystem,
        leftSystem: blankSystem,
        rightSystem: blankSystem
      };
      systemToSlot[`${system.position}System`] = system;
      this.setState({
        showOrderDialog: true,
        orderChip: chip,
        orderSlot: systemToSlot
      });
    } else if (position === "off") {
        showDialog(
          Title({ chip, canDrag: false }),
          "All positions for this account will be cleared at the market close, your funds will be held in cash.",
          () => {
            // Here you first need to remove the bet in the state so it's location
            // appears correctly on the board
            chip.position="off";
            moveToBalance(chip);

            // Then we need to reflect this in our redux store:
            // 1. add default off location's last3DaysProfit (basically 0 changePercent)
            if (!this.props.isLive) {
              const profitObj = {};
              profitObj[chip.accountId] = {
                position: "off",
                "20180201": { changePercent: 0 },
                "20180202": { changePercent: 0 },
                "20180205": { changePercent: 0 },
                "20180206": { changePercent: 0 },
                "20180207": { changePercent: 0 },
                "20180208": { changePercent: 0 }
              };
              addLast3DaysProfit(profitObj);
              const bet = {};
              bet[chip.accountId] = {
                bettingDate: toSlashDate(simulatedDate),
                position: "off",
                isAnti: false
              };

              // 2. append a new currentBet on off location
              addBet(bet);
              killDialog();
  
            } else {

              const bet = {};
              bet[chip.accountId] = {
                bettingDate: toSlashDate(getDateNowStr()),
                position: "off",
                isAnti: false
              };

              // 2. append a new currentBet on off location
              addBet(bet);
              killDialog();
            }
          },
          null,
          "Clear all positions",
          "Cancel"
      );
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
      orderChip,
      rankingLoading,
      rankingData,
      rankingError,
    } = this.state;

    const {
      heatmap_selection,
      heatmap,
      showHeatmap
    } = this.props;
    let slot = null;

    for (let xIndex = 0; xIndex < maxWidth; xIndex++) {
      const column = [];
      for (let yIndex = 0; yIndex < maxHeight; yIndex++) {
        slot = slots[xIndex * maxHeight + yIndex];
        var slotHeatmap={};

        var textColor="#000000";
        var bgColor="#86dde0";
        if (heatmap_selection && heatmap_selection.length > 0) {
            slotHeatmap['color_fill']=heatmap[heatmap_selection].color_fill[slot.position.toString()];
            slotHeatmap['color_text']=heatmap[heatmap_selection].color_text[slot.position.toString()];
            slotHeatmap['rank']=heatmap[heatmap_selection].rank[slot.position.toString()];
            slotHeatmap['score']=heatmap[heatmap_selection].score[slot.position.toString()];
            textColor=slotHeatmap['color_text'];
            bgColor=slotHeatmap['color_fill'];
        }
        column.push(
          <Slot
            key={"slot-" + xIndex + "-" + yIndex}
            position={slot.position}
            slotHeatmap={slotHeatmap}
            topSystem={slot.topSystem}
            bottomSystem={slot.bottomSystem}
            leftSystem={slot.leftSystem}
            rightSystem={slot.rightSystem}
            heldChips={this.heldChips(yIndex + maxHeight * xIndex + 1)}
            moveChipToSlot={this.moveChipToSlot}
            style={{
              backgroundColor: bgColor,
              text: textColor,
              zIndex:1,
            }}
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

    var sectionHeatmap={};

    if (heatmap_selection && heatmap_selection.length > 0) {
      sectionHeatmap=heatmap[heatmap_selection];
    }

    var panelBgColor="#86dde0";
    var panelTextColor="#000000";

    if (this.props.themes != undefined && this.props.themes.live.board) {
      if (this.props.themes.live.board.background)
        panelBgColor=this.props.themes.board.background;
      if (this.props.themes.live.board.text)
        panelTextColor=this.props.themes.board.text;
        
    }
    const panel = (
      <div className={classes.Panel} style={{"backgroundColor": panelBgColor, "text":panelTextColor}}>

        {slotsGrid}
        <BottomSection
          systems={this.state.bottomSystems}
          topSystems={this.state.topSystems}
          moveChipToSlot={this.moveChipToSlot}
          sectionHeatmap={sectionHeatmap}
        />
        <LeftSection
          systems={this.state.leftSystems}
          moveChipToSlot={this.moveChipToSlot}
          sectionHeatmap={sectionHeatmap}
        />
        <RightSection
          systems={this.state.rightSystems}
          moveChipToSlot={this.moveChipToSlot}
          sectionHeatmap={sectionHeatmap}
        />
        <TopSection
          systems={this.state.topSystems}
          balanceChips={this.props.balanceChips}
          moveChipToSlot={this.moveChipToSlot}
          sectionHeatmap={sectionHeatmap}
        />
        {showOrderDialog ? (
          <div             id={"modalDialog"}>

          <OrderDialog
            slot={orderSlot}
            chip={orderChip}
            toggle={this.toggleOrderDialog}
            successHandler={this.props.addBettingChip}
            rankingLoading={rankingLoading}
            rankingData={rankingData}
            rankingError={rankingError}
          />
          </div>
        ) : null}
      </div>
    );

    // Lets try with non blocking approach
    // return rankingLoading ? <Spinner /> : panel;
    return panel;
  }

  /**
   *
   *
   * @function componentDidMount Component did mount hook of the Panel component,
   *  called after the thing has been rendered
   *
   * @memberof Panel
   *
   *
   */

  componentDidMount() {
    // Do the api call for ranking charts
    // the request params would be containing
    // array of chip configurations, call it accounts array
    // array of tiles-systems configurations
    // response would be lookback(1, 5, 20) scoped aggregated pnl for all the tiles
    //   for all the different account sizes.
    // example params:
    // {
    //   "accounts": [
    //     {
    //       "portfolio": ["TU", "BO"],
    //       "target": "500",
    //       "accountValue": 5000
    //     }
    //   ],
    //   "slots": [
    //     {
    //       "position": 1,
    //       "systems": ["prev1", "prev5"]
    //     },
    //     {
    //       "position": 2,
    //       "systems": ["lowEq", "antiHighEq"]
    //     }
    //   ],
    //   "lookback": 23
    // }
    const { slots } = this.state;
    if (!this.props.isLive) {
      this.setState({ rankingLoading: true });
      // const { portfolio, target, accountValue } = ChipsConfig[0];

      axios
        .post("/utility/ranking_charts/", {
          // .get("https://api.myjson.com/bins/11pqxf", {
          //only 5k chip for tier 0
          // accounts: [{ portfolio, target, accountValue }],
          accounts: ChipsConfig,
          slots: slots.map(
            ({ position, topSystem, bottomSystem, leftSystem, rightSystem }) => {
              return {
                position: position.toString(),
                systems: [topSystem, bottomSystem, leftSystem, rightSystem]
                  .map(system => system.column)
                  .filter(system => system)
              };
            }
          ),
          lookback: 23
        })
        .then(({ data }) => {
          // eslint-disable-next-line react/no-is-mounted
          this._isMounted &&
            this.setState({
              rankingLoading: false,
              rankingData: data.rankingData
            });
        })
        .catch(error => {
          // eslint-disable-next-line react/no-is-mounted
          this._isMounted &&
            this.setState({
              rankingLoading: false,
              rankingError: error
            });
        });
      }
  }

  /**
   * Set the _isMounted property to be false for the component to handle Promise case.
   * @function componentWillUnmount as the name suggests its pre-unmount hook for the panel component
   * @memberof Panel
   */
  componentWillUnmount() {
    this._isMounted = false;
  }

}
