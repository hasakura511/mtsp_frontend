import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "../../../../components/UI/Modal/Modal";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import LockdownTimetable from "../../../../containers/_Game/components/AccountCharts/LockdownTimetable/LockdownTimetable";
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
    isLive: state.betting.isLive,
    dictionary_strategy: state.betting.dictionary_strategy,
    mute:state.betting.mute,
    themes:state.betting.themes,
  };
};

const dispatchToProps = dispatch => {
    return {
      showLockdownDialog: (show) => {
        dispatch(actions.showLockdownDialog(show));
      },
    };
  };


@connect(stateToProps, dispatchToProps)
export default class LockdownDialog extends Component {
    static propTypes = {
        mute:PropTypes.bool,
        showLockdownDialog:PropTypes.func.isRequired,
        themes:PropTypes.object.isRequired,
    };
  
  /**
   * Creates an instance of OrderDialog.
   * @constructor
   * @param {any} props
   * @memberof OrderDialog
   */

  constructor(props) {
    super(props);

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
    };
    this._isMounted = false;
  }

  componentDidMount() {
    /**
     * Modal open css transition via a stacked call
     */
    this.openTimer = setTimeout(() => {
      this.setState({ showModal: true });
    }, 0);


    this.setState({
        performanceLoading: false,
        });
  }

  /**
   * @function toggle Toggles the state of the order dialog
   *
   */
  toggle = () => {
    this.props.showLockdownDialog(false);
    this.setState({ showModal: false });
  };

  componentWillUnmount() {
      console.log("Lockdown Dialog will unmount");
      this.props.showLockdownDialog(false);
      this._isMounted = false;
  }

  componentWillMount() {
    this._isMounted = true;
  }


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
    var self=this;
    return (
      <Modal hidden={!showModal} toggle={this.toggle} isLarge
       >
        {performanceLoading ? (
          <Spinner />
        ) : performanceError ? (
          <h1>
            {performanceError.Message ||
              "Could not load performance data, contact us to report this bug."}
          </h1>
        ) : (
          <div  style={{background:self.props.themes.live.dialog.background,
            color:self.props.themes.live.dialog.text}}
            >
         
              <div style={{ "width": "100%", "padding":"0px", "margin":"0px", background:self.props.themes.live.dialog.background}}>
              <span style={{
                float: "left",
                width: "33.33333%",
                
                textAlign: "left"
                }}
              >
              &nbsp;
              </span>
              <span style={{
                float: "left",
                width: "33.33333%",
                textAlign: "center",
                marginTop: "5px"
                }}
              >
              <br/><h3>Lockdown Timetables</h3>
              </span>
              <span style={{
                float: "left",
                width: "33.33333%",
                textAlign: "right"
                }}
              >
                <br/>
                <span style={{textAlign:"right",marginTop:"5px", padding:"5px", "cursor":"pointer", background:self.props.themes.live.dialog.background}} 
                onClick={() => { self.toggle(); }}
                >
                  <button onClick={() => {self.toggle(); } } >
                  <font style={{fontSize:"16px"}}>Close</font>
                  </button>
                </span>
                </span>
              </div>
               <div style={{clear: "both"}}></div>​

         
            <LockdownTimetable gap={107} />
          </div>            
        )}
        {showModal && !this.props.mute ? (
        <Sound
            url="/sounds/chipLay2.wav"
            playStatus={Sound.status.PLAYING}
            playFromPosition={0 /* in milliseconds */}
            //onLoading={this.handleSongLoading}
            //onPlaying={this.handleSongPlaying}
            //onFinishedPlaying={this.handleSongFinishedPlaying}
          />
        ) : null}
      </Modal>
    );
  }

}
