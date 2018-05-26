import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "../../../../components/UI/Modal/Modal";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import Order from "../../components/Order/Order";
import axios from "../../../../axios-gsm";
import { TARGET } from "../../Config";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import { toSlashDate, getDemoProfitObj } from "../../../../util";
import { withRouter } from "react-router-dom";
import { toSystem } from "../../Config";

const stateToProps = state => {
  return {
    simulatedDate: state.betting.simulatedDate,
    isAuth: state.auth.token !== null,
    isLive: state.betting.isLive,
    dictionary_strategy: state.betting.dictionary_strategy
  };
};

const dispatchToProps = dispatch => {
  return {
    addLast3DaysProfit: last3DaysProfit => {
      dispatch(actions.addLast3DaysProfit(last3DaysProfit));
    },
    addBet: bet => {
      dispatch(actions.addBet(bet));
    },
    addTimedToaster(toaster) {
      dispatch(actions.addTimedToaster(toaster));
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
@withRouter
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
      isAnti: false,

      /**
       * Stores the last 3 days profits object
       * @type {Object}
       */
      last3DaysProfit: null
    };
    this._isMounted = false;
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
      { portfolio, accountValue, accountId, qty, target } = this.props.chip;

      /**
       * Fetch performance charts
       */
      if (!this.props.isLive) {
        axios
        .post("/utility/charts/", {
          /**
           * @example {"portfolio": ["TU", "BO"], "systems": ["prev1", "prev5"], "target": 500, "account": 5000}
           *
           */
          systems,
          portfolio,
          qty,
          target,
          account: accountValue
        })
        .then(response => {
          /**
           * @namespace {Performance}
           */
          const performance = response.data;

          // Adding last 3 days profit for simulation
          // __TEMPERORY__CODE__
          var profitObj = getDemoProfitObj(100, performance, this.props.slot.position);
          
          this._isMounted &&
            this.setState({
              last3DaysProfit: profitObj,
              performanceLoading: false,
              performance
            });
        })
        .catch(performanceError => {
          this.setState({
            performanceLoading: false,
            performanceError: performanceError
          });
        });
      } else {

        this.setState({
          performanceLoading: false,
        });
      }
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
    this._isMounted = false;
  }

  /**
   * @function componentWillMount Component will Mount hook to check isAuth.
   *
   * @memberof OrderDialog
   */

  componentWillMount() {
    const { chip, history, isAuth, addTimedToaster } = this.props;
    if (chip.display !== "25K" && chip.display !== "50K" && !isAuth) {
      history.push("/auth");
      addTimedToaster({
        id: "board-auth-error",
        text: `Only signed in users can play ${
          chip.display
        } chip. If you don't have an account please sign up first.`
      });
    }
    this._isMounted = true;
  }

  toggleSystem = event => {
    this.setState(prevState => ({ isAnti: !prevState.isAnti }));
  };

  setNotAnti = event=> {
    console.log(event.target.id);
    if (event.target.id == 'system-radio') {
      this.setState({ isAnti: false});
    }
  };

  setAnti = event => {
    console.log(event.target.id);
    if (event.target.id == 'anti-system-radio') {
        this.setState({ isAnti: true});
    }
  };

  toAntiSystem = pos => {
    if (pos in this.props.dictionary_strategy) {
      console.log(this.props.dictionary_strategy[pos]);
      return this.props.dictionary_strategy[pos].anti_tile_name;
    }
  
    if (pos.toString().toLowerCase() === "riskon") {
      return toSystem("riskOff");
    }
  
    if (pos.toString().toLowerCase() === "riskoff") {
      return toSystem("riskOn");
    }
  
    if (isNaN(Number(pos))) {
      return toSystem(pos).indexOf("Anti-") === -1 &&
        toSystem(pos).indexOf("A-") === -1
        ? "Anti-" + toSystem(pos)
        : toSystem(pos)
            .replace("Anti-", "")
            .replace("A-", "");
    } else {
      return "Anti-" + pos;
    }
  };
  
  /**
   * @function submitBetHandler
   * Handles the order dialogue's submission event,
   * Basically adds this bet to today's (current) bets
   * @memberof OrderDialog
   */
  submitBetHandler = event => {
    event.preventDefault();
    //alert(this.state.isAnti);
    if (!this.props.isLive) {
        const {
          slot,
          simulatedDate,
          addBet,
          chip,
          addLast3DaysProfit,
          successHandler,
        } = this.props;
        var { last3DaysProfit } = this.state;
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
          isAnti: this.state.isAnti
        };
        last3DaysProfit[chip.accountId]=last3DaysProfit;
        //console.log(bet[chip.accountId]);
        addLast3DaysProfit(last3DaysProfit);
        addBet(bet);
        successHandler(chip, slot.position, this.state.isAnti, strat);
        this.toggle();
    } else {
      const {
        slot,
        simulatedDate,
        addBet,
        chip,
        successHandler,
      } = this.props;
      //console.log(chip);
      //console.log(slot);

      var strat=toSystem(slot.position);
      if (this.state.isAnti) 
        strat=this.toAntiSystem(strat);
        chip.board_config_fe.map(function (s) {
          if (s.id == strat) {
            slot.position=strat;
          }
        });

      
      //alert(slot.position);
      //alert(strat);
      const bet = new Object();
      bet[chip.accountId] = {
        bettingDate: toSlashDate(simulatedDate),
        position: slot.position,
        isAnti: this.state.isAnti
      };
      
      addBet(bet);
      successHandler(chip, slot.position, this.state.isAnti, strat);
      this.toggle();
  
  
    }
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
      showModal,
      isAnti
    } = this.state;
    const { rankingError, rankingData, rankingLoading } = this.props;
    return (
      <Modal hidden={!showModal} toggle={this.toggle} isLarge>
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
            dictionary_strategy={this.props.dictionary_strategy}
            isLive={this.props.isLive}
            performance={performance}
            setAnti={this.setAnti}
            setNotAnti={this.setNotAnti}
            rankingData={rankingData}
            rankingError={rankingError}
            rankingLoading={rankingLoading}
            submitBetHandler={this.submitBetHandler}
            toAntiSystem={this.toAntiSystem}
            close={this.toggle}
            isAnti={isAnti}
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
    addBet: PropTypes.func.isRequired,
    isAuth: PropTypes.bool.isRequired,
    isLive: PropTypes.bool.isRequired,
    dictionary_strategy:PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    addTimedToaster: PropTypes.func.isRequired,
  };
}
