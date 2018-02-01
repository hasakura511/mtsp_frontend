import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "../../../../components/UI/Modal/Modal";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import Order from "../../components/Order/Order";
import axios from "../../../../axios-gsm";
import { TARGET } from "../../Config";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import { toSlashDate } from "../../../../util";

const stateToProps = state => {
  return {
    simulatedDate: state.betting.simulatedDate
  };
};

const dispatchToProps = dispatch => {
  return {
    addLast3DaysProfit: last3DaysProfit => {
      dispatch(actions.addLast3DaysProfit(last3DaysProfit));
    },
    addBet: bet => {
      dispatch(actions.addBet(bet));
    }
  };
};

/**
 * OrderDialog React component
 *
 * @export
 * @class OrderDialog
 * @extends {Component}
 */
@connect(stateToProps, dispatchToProps)
export default class OrderDialog extends Component {
  /**
   * Creates an instance of OrderDialog.
   * @constructor
   * @param {any} props
   * @memberof OrderDialog
   */

  constructor(props) {
    super(props);

    this.state = {
      /**
       * @type {boolean}
       */
      performanceLoading: true,
      /**
       * @type {boolean}
       */
      performanceError: false,
      /**
       * @type {Performance}
       */
      performance: null,
      /**
       * To make css transition of the modal possible
       * @type {boolean}
       */
      showModal: false,
      /**
       * Figures out the anti of the given set of systems
       * @type {boolean}
       */
      isAnti: false
    };
  }

  /**
   *
   * @function componentDidMount Component did mount hook to register timers and async tasks
   * @memberof OrderDialog
   */

  componentDidMount() {
    /**
     * Modal open css transition via a stacked call
     */
    this.openTimer = setTimeout(() => {
      this.setState({ showModal: true });
    }, 0);

    /**
     * @type {string[]}
     */
    const systems = Object.values(this.props.slot)
        .map(value => value.column)
        .filter(s => s),
      { portfolio, accountValue, accountId } = this.props.chip;

    /**
     * Fetch performance charts
     */
    axios
      .post("/utility/charts/", {
        /**
         * @example {"portfolio": ["TU", "BO"], "systems": ["prev1", "prev5"], "target": 500, "account": 5000}
         *
         */
        systems,
        portfolio,
        target: TARGET,
        account: accountValue
      })
      .then(response => {
        /**
         * @namespace {Performance}
         */
        const performance = response.data;
        this.setState({ performanceLoading: false, performance });

        // Adding last 3 days profit for simulation
        // __TEMPERORY__CODE__
        const profitObj = {};
        profitObj[accountId] = {
          position: this.props.slot.position,
          "20180105": {
            changePercent: Number(
              performance.pnlData.find(pnlObj => pnlObj.date === "20180105")[
                "changePercent"
              ]
            )
          },
          "20180108": {
            changePercent: Number(
              performance.pnlData.find(pnlObj => pnlObj.date === "20180108")[
                "changePercent"
              ]
            )
          },
          "20180109": {
            changePercent: Number(
              performance.pnlData.find(pnlObj => pnlObj.date === "20180109")[
                "changePercent"
              ]
            )
          }
        };
        this.props.addLast3DaysProfit(profitObj);
      })
      .catch(performanceError => {
        this.setState({
          performanceLoading: false,
          performanceError: performanceError
        });
      });
  }

  /**
   * @function toggle Toggles the state of the order dialog
   *
   * @memberof OrderDialog
   */
  toggle = () => {
    this.setState({ showModal: false });
    this.closeTimer = setTimeout(() => {
      this.props.toggle();
    }, 300);
  };

  /**
   * @function componentWillUnmount Component will unmount hook to clear timers and subscriptions.
   *
   * @memberof OrderDialog
   */

  componentWillUnmount() {
    clearTimeout(this.openTimer);
    clearTimeout(this.closeTimer);
  }

  toggleSystem = () => {
    this.setState(prevState => ({ isAnti: !prevState.isAnti }));
  };

  /**
   * @function submitBetHandler
   * Handles the order dialogue's submission event,
   * Basically adds this bet to today's (current) bets
   * @memberof OrderDialog
   */
  submitBetHandler = event => {
    event.preventDefault();
    const { slot, simulatedDate, addBet, chip } = this.props;
    const { isAnti } = this.state;
    const bet = new Object();
    // example bet:
    // {"5K_0_1516105730": {
    //   bettingDate: "2018/01/06",
    //   position: "1",
    //   bettingTime: null,
    // }}
    bet[chip.accountId] = {
      bettingDate: toSlashDate(simulatedDate),
      position: slot.position,
      isAnti
    };
    addBet(bet);
    this.props.successHandler(chip, slot.position);
    this.toggle();
  };

  /**
   *
   * @function render Render method of the OrderDialog component
   * @returns {ReactHTMLElement} returns jsx for OrderDialog component
   * @memberof OrderDialog
   */

  render() {
    const {
      performance,
      performanceLoading,
      performanceError,
      showModal
    } = this.state;
    const { rankingError, rankingData, rankingLoading } = this.props;
    return (
      <Modal hidden={!showModal} toggle={this.toggle}>
        {performanceLoading ? (
          <Spinner />
        ) : performanceError ? (
          <h1>
            {performanceError.Message ||
              "Could not load performance data, contact us to report this bug."}
          </h1>
        ) : (
          <Order
            {...this.props}
            performance={performance}
            toggleSystem={this.toggleSystem}
            rankingData={rankingData}
            rankingError={rankingError}
            rankingLoading={rankingLoading}
            submitBetHandler={this.submitBetHandler}
            close={this.toggle}
          />
        )}
      </Modal>
    );
  }

  static propTypes = {
    slot: PropTypes.object.isRequired,
    chip: PropTypes.object.isRequired,
    successHandler: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    rankingLoading: PropTypes.bool.isRequired,
    rankingData: PropTypes.array,
    rankingError: PropTypes.object,
    simulatedDate: PropTypes.string.isRequired,
    addLast3DaysProfit: PropTypes.func.isRequired,
    addBet: PropTypes.func.isRequired
  };
}