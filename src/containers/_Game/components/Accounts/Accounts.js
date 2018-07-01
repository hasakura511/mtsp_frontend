import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Accounts.css";
import LockdownTimetable from "../AccountCharts/LockdownTimetable/LockdownTimetable";
import PerformanceChart from "../AccountCharts/PerformanceChart/PerformanceChart";
import RankingChart from "../AccountCharts/RankingChart/RankingChart";
import PerformanceOrderChart from "../AccountCharts/PerformanceOrderChart/PerformanceOrderChart";
import OpenPositions from "../AccountCharts/OpenPositions/OpenPositions";
import PreviousPnL from "../AccountCharts/PreviousPnL/PreviousPnL";
import TradingCosts from "../AccountCharts/TradingCosts/TradingCosts";
import Spinner from "../../../../components/UI/Spinner/Spinner";
//import RankingChart from "./RankingChart/RankingChart";
import * as actions from "../../../../store/actions";
import { connect } from "react-redux";
import axios from "../../../../axios-gsm";
import ClockLoader from "../../../../components/UI/ClockLoader/ClockLoader";



const stateToProps = state => ({
  //themes:state.betting.themes,
  email: state.auth.email,
  //performance_account_id: state.betting.performance_account_id
});


const dispatchToProps = dispatch => {
  return {
    showPerformance:(action_id) => {
      dispatch(actions.showPerformance(action_id))
    },
    
  };
};

const loader = (
  <div
    style={{
      width: "100%",
      height: "100%",
      backgroundColor: "white"
    }}
  >
    <Spinner />
  </div>
);


@connect(stateToProps, dispatchToProps)
export default class Accounts extends Component {
  static propTypes = {
    performance: PropTypes.object,
    email:PropTypes.string.isRequired,
    rankingLoading: PropTypes.bool,
    rankingData: PropTypes.array,
    rankingError: PropTypes.object,
    chip: PropTypes.object,
    slot: PropTypes.object,
    close: PropTypes.func,
    toggle:PropTypes.func,
    showPerformance:PropTypes.func.isRequired,
    themes:PropTypes.object,
    isOrder:PropTypes.bool,
    moveChipToSlot:PropTypes.func,
    isAnti:PropTypes.bool,
  };
  constructor(props) {
    super(props);

    this.state = {
      isPerformance: true,
      isOpenPositions:false,
      isTradingCosts:false,
      isPreviousPnL:false,
      isLockdownTimetable:false,
      isRankingChart:false,
      loading:true
    };
  }
  componentWillUnmount() {
    //this.props.showPerformance('');
  }

  componentWillMount() {
    this.initializeAccounts();
  }

  
  initializeAccounts=(reinitialize=false) => {

    //if (this.state.refreshing)
    //  return;
    //else
    //  this.setState({refreshing:true})
    //this.forceUpdate();
    
    //console.log(this.props);
    var self=this;
    var reinit='false';
    if (reinitialize)
      reinit='true';
    axios
    .post("/utility/accounts_list_live/", {
    // accounts: [{ portfolio, target, accountValue }],
    //'initialize': reinit,
    'username':  self.props.email,
    //'chip_id':chip_id,
    //'last_date':last_date,
    //'board_config':board_config,
    
    },{timeout: 600000})
    .then(({ data }) => {
      console.log('received account list data')
      console.log(data);
      //var itemSelected = chip_id ?  chip_id : 'None';
      this.setState({
        editData:data,
        //itemSelected:itemSelected,
        loading:false,
      });
     
      //if (!chip_id)
      //  self.initializeLive();

    })
    .catch(error => {
      this.sendNotice('Account Data not received: ' + JSON.stringify(error));
      console.log('error initializing')
      console.log(error)
    // eslint-disable-next-line react/no-is-mounted
      this.setState({
        rankingLoading: false,
        rankingError: error,
        loading:false,
        refreshing:false
      });
    });

  }

  componentWillReceiveProps(newProps) {
    if (newProps.slot) {
      if (this.state.isRankingChart && newProps.slot.position != this.props.slot.position) {
        this.setState({isPerformance:true, isOpenPositions:false, isTradingCosts:false, isPreviousPnL:false,  isRankingChart:false});
      }
    }
  }
  render() {
    if (this.state.loading || this.state.refreshing) {
        return ( 

          <div>
            
            <center>
             <ClockLoader show={true} />
             <br/><br/>
             <b>Please wait while we load your board. This could take a couple of minutes.</b>
            </center>
          </div>

        );
      } else {
            const { editData, isPerformance, isOpenPositions, isTradingCosts, isPreviousPnL, isLockdownTimetable, isRankingChart } = this.state;

            const {
            
            performance,
            rankingLoading,
            rankingData,
            rankingError,
            chip,
            slot,

            } = this.props;
            var themes=editData.themes;
            var lines=themes.lines;
            var lines_horizontal_middle=themes.lines_horizontal_middle;
            var page_background=themes.page_background;
            var table_background=themes.table_background;
            var text_color=themes.text_color;
            var text_gain=themes.text_gain;
            var text_loess=themes.text_loss;

            var self=this;
            return (
            <div className={classes.Accounts} style={{background: page_background,
                color:text_color, borderColor:lines}}>
                        

                <div className={classes.Row} style={{background: page_background,
                color:text_color, borderColor:lines}}>

                        Accounts Page
                </div>

            

            </div>
            );
        }
  }
}


