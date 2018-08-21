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
import AccountsLive from "./AccountsLive/AccountsLive"
import Spinner from "../../../../components/UI/Spinner/Spinner";
//import RankingChart from "./RankingChart/RankingChart";
import * as actions from "../../../../store/actions";
import { connect } from "react-redux";
import axios from "../../../../axios-gsm";
import ClockLoader from "../../../../components/UI/ClockLoader/ClockLoader";
import { axiosOpen } from "../../../../axios-gsm";
import withErrorHandler from "../../../../hoc/withErrorHandler/withErrorHandler";
import { withRouter } from "react-router-dom";
import protectedComponent from "../../../../hoc/ProtectedComponent/ProtectedComponent";
import AccountsNew from "./AccountsNew/AccountsNew";


const stateToProps = state => ({
  //themes:state.betting.themes,
  email: state.auth.email,
  firstName: state.auth.firstName,
  lastName: state.auth.lastName,
  isAuth: state.auth.token !== null,
  tosAccepted: state.auth.tosAccepted,
  rdAccepted: state.auth.rdAccepted,
  initializeData:state.betting.initializeData,
    
  //performance_account_id: state.betting.performance_account_id
});


const dispatchToProps = dispatch => {
  return {
    showPerformance:(action_id) => {
      dispatch(actions.showPerformance(action_id))
    },
    authSuccess: (user, token) => {
      dispatch(actions.authSuccess(user, token));
    },
    initializeData: (data) => {
      dispatch(actions.initializeData(data));
      
    },
    showHtmlDialog: (htmlContent) => {
      dispatch(actions.showHtmlDialog(htmlContent));
      
    },
    silenceHtmlDialog: () => {
      dispatch(actions.silenceHtmlDialog());
      
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

//@withErrorHandler(axiosOpen)
//@withRouter
@protectedComponent
@connect(stateToProps, dispatchToProps)
export default class Accounts extends Component {
  static propTypes = {
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    isAuth: PropTypes.bool.isRequired,
    tosAccepted: PropTypes.bool.isRequired,
    rdAccepted: PropTypes.bool.isRequired,
    authSuccess: PropTypes.func.isRequired,
    rankingLoading: PropTypes.bool,
    rankingData: PropTypes.array,
    rankingError: PropTypes.object,
    showPerformance:PropTypes.func,
    themes:PropTypes.object,
    isOrder:PropTypes.bool,
    isPopup:PropTypes.bool,
    moveChipToSlot:PropTypes.func,
    moveStratToSlot:PropTypes.func,
    isAnti:PropTypes.bool,
    initializeData:PropTypes.func.isRequired,
    showHtmlDialog:PropTypes.func.isRequired,
    silenceHtmlDialog:PropTypes.func.isRequired,
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
    //this.initializeAccounts();
  }

  
  componentDidMount() {
    var self=this;
    if (!self.props.isPopup)
      self.initializeLive();
    else
      self.initializeAccounts();
  }


  
  
  initializeLive=(reinitialize=false, update_bets="" ) => {
    console.log("NEW BOARD Initialize")
    var self=this;
    if (this.state.refreshing)
      return;
    else
      this.setState({refreshing:true})

    var reinit='false';
    if (reinitialize)
      reinit='true';

    axios
    .post("/utility/initialize_live/", {
    // accounts: [{ portfolio, target, accountValue }],
    'username':  this.props.email,
    'reinitialize': reinit,
    'update_bets':update_bets
    },{timeout: 600000})
    .then(({ data }) => {


      console.log('received initialize_live data')
      console.log(data);
      this.props.initializeData(data);
      self.initializeAccounts();
      if (data.update_bets) {
        Object.keys(data.update_bets).map(key => {
          var item=data.update_bets[key];
          var chip_id=key;

          axios
          .post("/utility/update_bet_live/", {
          // accounts: [{ portfolio, target, accountValue }],
          'account_id':  item[1],
          'strategy':    item[0],
          'chip_id':     chip_id
          },{timeout: 600000})
          .then(({ data }) => {
            console.log(data);
          });

        });
      } 
      
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
      window.location='/board'

    });

  }

  initializeAccounts=(reinitialize=false) => {

    var self=this;
    var reinit='false';

    axios
    .post("/utility/accounts_list_live/", {
        // accounts: [{ portfolio, target, accountValue }],
        //'initialize': reinit,
        'username':  self.props.email,
        //'chip_id':chip_id,
        //'last_date':last_date,
        //'board_config':board_config,
    },
    {timeout: 600000}
    )
    .then(({ data }) => {
      console.log('received account list data')
      //console.log(data.accounts); 
      //console.log(data);
      //var itemSelected = chip_id ?  chip_id : 'None';

      var dataJson= JSON.parse(data.accounts);
      data.accounts=dataJson;
      Object.keys(data.accounts).map(key => {
        data.accounts[key]['chip_id']=key;
        data.accounts[key]['portfolio']=JSON.parse(data.accounts[key]['portfolio'])
        data.accounts[key]['starting_value']=parseInt(data.accounts[key]['starting_value']);
        data.accounts[key]['account_value']=parseInt(data.accounts[key]['account_value']);
      })

      dataJson=JSON.parse(data.margins);
      data.margins=dataJson;
      
      Object.keys(data.sparklines).map(key => {
        data.sparklines[key]['data']=JSON.parse(data.sparklines[key]['data'])

      })
      

      var themes=data.themes;
      themes['live']={}
      themes.live['dialog']={}
      themes.live.dialog.table_left_background=themes.table_background;
      themes.live.dialog.table_right_background=themes.table_background;
      data.themes=themes;
      console.log(data);
      this.setState({
        editData:data,
        //itemSelected:itemSelected,
        refreshing:false,
        loading:false,
      });
 
     
      //if (!chip_id)
      //  self.initializeLive();

    })
    .catch(error => {
      //this.sendNotice('Account Data not received: ' + JSON.stringify(error));
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

  }

  render() {
    var self=this;
            
    if (this.state.loading || this.state.refreshing || !this.state.editData || !this.state.editData.themes) {
        return ( 

          <div>
            
            <center>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
             <ClockLoader show={true} />
             <br/><br/>
             {!self.props.isPopup ? <b>Please wait while we load your accounts. This could take a couple of minutes.</b> : null}
            </center>
          </div>

        );
      } else {
            const { editData, isPerformance, isOpenPositions, isTradingCosts, isPreviousPnL, isLockdownTimetable, isRankingChart } = this.state;

            const {
            
            rankingLoading,
            rankingData,
            rankingError,

            } = this.props;
            var themes=editData.themes;
            var lines=themes.lines;
            var lines_horizontal_middle=themes.lines_horizontal_middle;
            var page_background=themes.page_background;
            var table_background=themes.table_background;
            var text_color=themes.text_color;
            var text_gain=themes.text_gain;
            var text_loess=themes.text_loss;

            console.log(themes)
            return (
            <div className={classes.Accounts} style={{background: page_background,
                color:text_color, borderColor:lines}}>


                <div className={classes.Row} style={{background: page_background,
                color:text_color, borderColor:lines}}>

                       <AccountsLive performance={self.state.editData} isPopup={this.props.isPopup} initializeLive={this.initializeLive} themes={themes} />

                </div>

            

            </div>
            );
        }
  }
}


