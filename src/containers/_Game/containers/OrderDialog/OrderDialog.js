import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "../../../../components/UI/Modal/Modal";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import Order from "../../components/Order/Order";
import axios from "../../../../axios-gsm";
import { TARGET } from "../../Config";

/**
 * OrderDialog React component
 *
 * @export
 * @class OrderDialog
 * @extends {Component}
 */
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
      loading: true,
      /**
       * @type {boolean}
       */
      error: false,
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
      { portfolio, accountValue } = this.props.chip;

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
        this.setState({ loading: false, performance });
      })
      .catch(error => {
        this.setState({ loading: false, error: error });
      });
  }

  /**
   * @function toggle Toggles the state of the order dialog
   *
   * @memberof OrderDialog
   */
  toggle = () => {
    this.closeTimer = this.setState({ showModal: false });
    setTimeout(() => {
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
   *
   * @function render Render method of the OrderDialog component
   * @returns {ReactHTMLElement} returns jsx for OrderDialog component
   * @memberof OrderDialog
   */

  render() {
    const { performance, loading, error, showModal } = this.state;
    return (
      <Modal hidden={!showModal} toggle={this.toggle}>
        {loading ? (
          <Spinner />
        ) : (
          <Order
            {...this.props}
            performance={performance}
            toggleSystem={this.toggleSystem}
          />
        )}
        {error ? (
          <h1>
            {error.Message ||
              "Could not load performance data, contact us to report this bug."}
          </h1>
        ) : null}
      </Modal>
    );
  }

  static propTypes = {
    slot: PropTypes.object.isRequired,
    chip: PropTypes.object.isRequired,
    successHandler: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired
  };
}
