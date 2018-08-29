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
import Sound from 'react-sound';
const stateToProps = state => {
  return {
    simulatedDate: state.betting.simulatedDate,
    isAuth: state.auth.token !== null,
    isLive: state.betting.isLive,
    dictionary_strategy: state.betting.dictionary_strategy,
    mute:state.betting.mute,
    themes:state.betting.themes,
    accounts:state.betting.accounts,

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

  static propTypes = {
    slot: PropTypes.object,
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
    isPractice: PropTypes.bool,
    dictionary_strategy:PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    addTimedToaster: PropTypes.func.isRequired,
    mute:PropTypes.bool.isRequired,
    isPerformance: PropTypes.bool,
    performance_account_id: PropTypes.string,
    themes:PropTypes.object.isRequired,
    accounts:PropTypes.array.isRequired,
    moveChipToSlot:PropTypes.func,
    orderAnti:PropTypes.bool,
  };

  constructor(props) {
    super(props);

    var isAnti=false;
    if (props.orderAnti)
      isAnti=true;
    this.state = {
      performance_account_id:'',
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
      isAnti: isAnti,

      /**
       * Stores the last 3 days profits object
       * @type {Object}
       */
      last3DaysProfit: null,
      playing:Sound.status.PLAYING
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

    var isPerformance=this.props.isPerformance;
    /**
     * @type {string[]}
     */
    if (!this.props.isPerformance) {
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

            var profitObj = getDemoProfitObj(100, performance, accountId);

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
          isPerformance=true;
          this.setState({
            performanceLoading: false
          });
        }
    }
    if (isPerformance) {

        this.setState({
          performance_account_id:this.props.performance_account_id,
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
    const { chip, history, isAuth, addTimedToaster, isPerformance, performance_account_id } = this.props;
    if (performance_account_id)
      this.setState({performance_account_id:performance_account_id})
    
    /*
      if (chip.display !== "25K" && chip.display !== "50K" && !isAuth) {
      history.push("/auth");
      addTimedToaster({
        id: "board-auth-error",
        text: `Only signed in users can play ${
          chip.display
        } chip. If you don't have an account please sign up first.`
      });
    }
    */
    
    this._isMounted = true;
  }

  componentWillReceiveProps(newProps) {
    console.log("OrderDialog Received New Props")
    console.log(newProps);

    if (newProps.slot && this.props.slot) {
      //if (newProps.slot.position != this.props.slot.position) {
      //  this.setState({ isAnti: false});
     // }
    }
    if (newProps.orderAnti && (!this.props.orderAnti || !this.state.isAnti)) {
      this.setState({isAnti:true});
    } else if (!newProps.orderAnti && (this.props.orderAnti || this.state.isAnti)) {
      if (newProps.slot.position != this.props.slot.position) {
        this.setState({isAnti:false});
      }
    }
    if (this.state.performance_account_id && this.state.isPerformance) {
      if (newProps.accounts) {
          var orderChip='';
          var updated=false;
          newProps.accounts.map(account => {
              if (account.account_id == this.state.performance_account_id) {
                orderChip=account;
                self.setState({orderChip:orderChip});
                console.log("new state for chip " + account.account_id);
                console.log(orderChip);
                updated=true;
              }
          });
          if (updated) 
            self.forceUpdate();

      }
    }

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

      chip.orig_position=chip.position;
      chip.orig_last_selection=chip.last_selection;

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
    const { rankingError, rankingData, rankingLoading, accounts } = this.props;
    var self=this;
    var background='white';
    var text='black';
    if (this.props.isLive && this.props.themes) {
      background=self.props.themes.live.dialog.background;
      text=self.props.themes.live.dialog.text;
    }
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
          <div style={{background:background,
            color:text}}>
            
          <Order
            {...this.props}
            chip={this.props.chip}
            dictionary_strategy={this.props.dictionary_strategy}
            isLive={this.props.isLive}
            isPractice={this.props.isPractice}
            isPerformance={this.props.isPerformance}
            performance_account_id={this.state.performance_account_id}
            performance={performance}
            setAnti={this.setAnti}
            setNotAnti={this.setNotAnti}
            rankingData={rankingData}
            rankingError={rankingError}
            rankingLoading={rankingLoading}
            submitBetHandler={this.submitBetHandler}
            toggle={this.props.toggle}
            toAntiSystem={this.toAntiSystem}
            themes={this.props.themes}
            close={this.toggle}
            isAnti={isAnti}
            moveChipToSlot={this.props.moveChipToSlot}
          />
          </div>

        )}
        {showModal && !this.props.mute && !this.props.isPerformance ? (
        <Sound
            url="/sounds/chipLay2.wav"
            playStatus={this.state.playing}
            playFromPosition={0 /* in milliseconds */}
            //onLoading={this.handleSongLoading}
            //onPlaying={this.handleSongPlaying}
            onFinishedPlaying={() => {
              self.setState({playing:Sound.status.STOPPED});
            }}
          />
        ) : null}
      </Modal>
    );
  }


}
