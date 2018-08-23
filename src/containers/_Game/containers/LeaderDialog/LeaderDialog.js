import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "../../../../components/UI/Modal/Modal";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import LockdownTimetable from "../../../../containers/_Game/components/AccountCharts/LockdownTimetable/LockdownTimetable";
import LeaderBoardCopiedChips from "../../../../containers/_Game/components/AccountCharts/LeaderBoardCopiedChips/LeaderBoardCopiedChips";
import LeaderBoardLive from "../../../../containers/_Game/components/AccountCharts/LeaderBoardLive/LeaderBoardLive";
import Order from "../../components/Order/Order";
import axios from "../../../../axios-gsm";
import { TARGET } from "../../Config";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import { toSlashDate, getDemoProfitObj } from "../../../../util";
import { withRouter } from "react-router-dom";
import { toSystem } from "../../Config";
import classes from "./LeaderDialog.css";
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
      showLeaderDialog: (show) => {
        dispatch(actions.showLeaderDialog(show));
      },
    };
  };


@connect(stateToProps, dispatchToProps)
export default class LeaderDialog extends Component {
    static propTypes = {
        mute:PropTypes.bool,
        showLeaderDialog:PropTypes.func.isRequired,
        themes:PropTypes.object.isRequired,
        initializeLive:PropTypes.func
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
      isLeaderBoard: true,
      isLeaderboardCopiedChips: false

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
    this.props.showLeaderDialog(false);
    this.setState({ showModal: false });
  };

  componentWillUnmount() {
      console.log("Lockdown Dialog will unmount");
      this.props.showLeaderDialog(false);
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
      isAnti,
      isLeaderBoard,
      isLeaderboardCopiedChips
    } = this.state;
    var self=this;
    return (
      <Modal 
        hidden={!showModal} 
        toggle={this.toggle} 
        isLarge
      
       >
        {performanceLoading ? (
          <Spinner />
        ) : performanceError ? (
          <h1>
            {performanceError.Message ||
              "Could not load performance data, contact us to report this bug."}
          </h1>
        ) : (
          <div  style={{
            background:self.props.themes.live.dialog.background,
            color:self.props.themes.live.dialog.text,
            //maxHeight: innerHeight - 230
          }}
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
              <br/><h3> Leaderboard </h3>
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
            
               <div className={classes.Tabs} style={{ 
                  background:self.props.themes.live.dialog.background,
                  color:self.props.themes.live.dialog.text, 
                  textAlign:'center',
                  

                 }}>
                      
                      
                      <div
                      style={ isLeaderBoard ? {borderColor:self.props.themes.live.dialog.lines, borderLeft:"1px solid " + self.props.themes.live.dialog.lines,  borderTop:"1px solid " + self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'}
                      : {borderTop:"1px solid " + self.props.themes.live.dialog.lines, borderLeft:"1px solid " + self.props.themes.live.dialog.lines,   borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} } 
                      className={
                        classes.Tab
                      }
        
                      onClick={() => this.setState({isLeaderBoard:true, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false, isLeaderboardCopiedChips:false}) }
                    >
                     Paper-Live
                    </div>
                    <div
                      style={ isLeaderboardCopiedChips ? {borderColor:self.props.themes.live.dialog.lines,  borderRight:"1px solid " + self.props.themes.live.dialog.lines, borderLeft:"1px solid " + self.props.themes.live.dialog.lines, borderTop:"1px solid " + self.props.themes.live.dialog.lines,  background:self.props.themes.live.dialog.tab_color_active, minWidth:'180px'} 
                      : {borderTop:"1px solid " + self.props.themes.live.dialog.lines,   borderLeft:"1px solid " + self.props.themes.live.dialog.lines,  borderRight:"1px solid " + self.props.themes.live.dialog.lines, borderColor:self.props.themes.live.dialog.lines, background:self.props.themes.live.dialog.tab_color_inactive, minWidth:'180px'} }
                      className={
                        classes.Tab
                      }
                      onClick={() => this.setState({isLeaderBoard:false, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false, isLeaderboardCopiedChips:true})
                    }
                    >
                      Copied Chips
                    </div>
              </div>
         
              <div className={classes.Contents}>
              {isLeaderBoard ? (
                <div className={classes.Content}
                
                >
                  <LeaderBoardLive initializeLive={this.props.initializeLive} isdialog={true} gap={-107} toggle={self.toggle} />
                </div>
              ) : (
              null
              )}

              {isLeaderboardCopiedChips ? (
                <div className={classes.Content}
                
                >
                 <LeaderBoardCopiedChips initializeLive={this.props.initializeLive} isdialog={true} gap={-107} toggle={self.toggle} />
                </div>
              ) : (
              null
              )}
              </div>
            
          </div>            
        )}
        
      </Modal>
    );
  }

}
