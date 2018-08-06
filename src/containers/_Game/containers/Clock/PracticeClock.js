import React, { PureComponent } from "react";
import { toSlashDate } from "../../../../util";
import LiveClock from 'react-live-clock';
import Moment from 'react-moment';
import momentCountdown from 'moment-countdown';
import moment from 'moment-timezone';
import ClockLoader from "../../../../components/UI/ClockLoader/ClockLoader";
import classes from "./Clock.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as actions from "../../../../store/actions";

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const Formatter = Intl.DateTimeFormat(["en-GB"], {
  year: "numeric",
  month: "long",
  day: "2-digit",
  // timeZone: "America/New_York",
  weekend: "long",
  weekday: "long"
});



const stateToProps = state => {
  return {
    //simulatedDate: state.betting.simulatedDate,
    dashboard_totals:state.betting.dashboard_totals,
    initializeData:state.betting.initializeData,
    isLive:state.betting.isLive,
    themes:state.betting.themes,

    //liveDate:state.betting.liveDate,
  };
};

const dispatchToProps = dispatch => {
  return {
    updateDate: () => {
      dispatch(actions.updateDate());
    },
    showLockdownDialog: (show) => {
      dispatch(actions.showLockdownDialog(show));
    },
  };
};

@connect(stateToProps, dispatchToProps)


export default class Clock extends PureComponent {
  static propTypes = {
    //simulatedDate: PropTypes.string.isRequired,
    isLive:PropTypes.bool.isRequired,
    //liveDate: PropTypes.instanceOf(Date).isRequired,
    dashboard_totals:PropTypes.object.isRequired,
    updateDate:PropTypes.func.isRequired,
    initializeLive:PropTypes.func,
    nextSimulationDay:PropTypes.func,
    sendNotice:PropTypes.func,
    themes:PropTypes.object,
    loading:PropTypes.bool,
    initializeData:PropTypes.object.isRequired,
    date_picked:PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      estTime: "5:00:00 PM",
      refreshing:false,

    };
  }

  componentDidMount() {
    // this.timerInterval = setInterval(() => {
    //   this.setState({
    //     estTime: new Date().toLocaleTimeString([], {
    //       timeZone: "America/New_York"
    //     })
    //   });
    // }, 1000);
  }

  componentWillUnmount() {
    // clearInterval(this.timerInterval);
  }

  render() {
    var self=this;

    this.clockTime = this.state.estTime.split(/\s/);

    var clockTop="#347da6";
    var clockMid="#4797bc";
    var clockBot="#347da6";
    var clockText="#fafafa";
    if (this.props.themes.live.action_row) {
      clockTop=this.props.themes.live.action_row.clock_top;
      clockMid=this.props.themes.live.action_row.clock_middle;
      clockBot=this.props.themes.live.action_row.clock_bottom;
      clockText=this.props.themes.live.action_row.clock_text;      
    }
    var bgStyle={ "background" : "linear-gradient(" + clockTop + "," + clockMid + "," + clockBot + ")",
                  "color" : clockText,
                  "cursor": 'pointer', width:"541px"};
    const { updateDate,initializeData } = this.props;
    return (
     
          <div className={classes.Widget} style={bgStyle}  onClick={()=>{ if (self.props.isLive)
                                                                              self.props.showLockdownDialog(true); }} >
          <div className={classes.Left}>
             <table><tbody><tr><td style={{border:"0px", maxWidth:"30px"}}>
                    <span style={{cursor:'pointer', fontSize:"12px"}} onClick={() => {
                      self.props.initializeLive(undefined, undefined, this.props.date_picked);
                    }}>
                    <img src="/images/practice_reset.png" width={30} /><br/>
                    Reset
                    </span>

            </td>
            <td style={{border:"0px"}}>
            {this.props.isLive ? (
            <span className="isLive" >
            <p  style={{ width: "120px", 
                        "marginLeft":"15px",
                        "lineHeight":"1",
                        "fontSize" : "12px",
                        "textAlign":"right" }}>
              <br/>
            

            <span id={"next_lockdown"}> { initializeData.clock_text.clock_top } &nbsp;<br/></span>
            <span id={"countdown_time"}>{initializeData.clock_text.clock_middle } &nbsp;<br/></span>
            <span id={"next_unlock"}> { initializeData.clock_text.clock_bottom } &nbsp;<br/></span>
            <span id={"countdown_unlock_time"}></span>
            <Moment 
             style={{"display":"none"}}
             interval={1000} 
             onChange={(val) => { 
                                   
                                  }} 
            ></Moment>
           
            </p>
            </span>
          ) : (
            <span className="isSim">
            <p  style={{ width: "180px", 
                        "marginLeft":"15px",
                        "lineHeight":"1" }} 
                        align="center">
                    <br/><b><img src="/favicon.png"/></b>
            </p>
            </span>
          )}
          </td></tr></tbody></table>
        </div>
        <div className={classes.Saperation} />
        <div className={classes.Right}>
          <table><tbody><tr><td style={{border:"0px", minWidth:"222px"}}>
            <div style={{"marginLeft":"3px", "marginTop":"-10px"}}>
              <h3>
              <LiveClock format={'hh:mm:ss A '} ticking={true} timezone={'US/Eastern'} />
              &nbsp;
              EST </h3> 
              <p style={{ "marginTop":"-10px"}}>
              <LiveClock format={'dddd, DD MMM YYYY'} ticking={true} timezone={'US/Eastern'} /> 
              <Moment format={'YYYY-MM-DD HH:mm:ss'} onChange={(val) => { console.log(val); updateDate(val); }} interval={5000} tz="US/Eastern" style={{"display":"none"}} className="datetime" aria-hidden={true}/>
              </p>
            </div>
          </td><td style={{border:"0px", marginLeft:"-30px", minWidth:"90px", textAlign:"center"}}>
                <span style={{cursor:'pointer', fontSize:"12px"}} onClick={() => {
                                      self.props.nextSimulationDay();
                                    }}>
                <img src="/images/practice_simulate.png" width={30} /><br/>
                
                Next Day </span>
            </td></tr></tbody></table>
        </div>
      </div>
      );
  }
}
