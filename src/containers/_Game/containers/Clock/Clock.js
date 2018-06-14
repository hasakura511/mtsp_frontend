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
    sendNotice:PropTypes.func,
    themes:PropTypes.object,
    loading:PropTypes.bool
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
                  "cursor": 'pointer'};
    const { updateDate,dashboard_totals } = this.props;
    return (
     
          <div className={classes.Widget} style={bgStyle}  onClick={()=>{ if (self.props.isLive)
                                                                              self.props.showLockdownDialog(true); }} >
          <div className={classes.Left}>
            {this.props.isLive ? (
            <span className="isLive" >
            <p  style={{ width: "180px", 
                        "marginLeft":"15px",
                        "lineHeight":"1",
                        "fontSize" : "12px" }}>
              <br/>
            

            <span id={"next_lockdown"}> { dashboard_totals.lockdown_text.top_text } &nbsp;<span id={"countdown_time"}></span><br/></span>
            <span id={"next_unlock"} style={{"display":"none"}}> { dashboard_totals.lockdown_text.top_text } &nbsp;<span id={"countdown_unlock_time"}></span><br/></span>
            <Moment 
             style={{"display":"none"}}
             interval={1000} 
             onChange={(val) => {  const ts=dashboard_totals.lockdown_text.next_refresh_time.countdown();
                                   var days=ts.days;

                                   var hour=ts.hours;
                                   var minutes=ts.minutes;
                                   var seconds=ts.seconds;
                                   //console.log(days);
                                   hour += days * 24;
                                   /*

                                   const ts2=dashboard_totals.lockdown_text.next_unlock_time.countdown();
                                   var hour2=ts2.hours;
                                   var minutes2=ts2.minutes;
                                   var seconds2=ts2.seconds;
                                   */
                                   if (dashboard_totals.lockdown_text.next_refresh_time < new moment().tz("US/Eastern")) {
                                     if (this.props.isLive && !this.props.loading) {  
                                       if (seconds < 10 && !this.state.refreshing) {
                                         this.setState({refreshing:true});
                                         this.props.initializeLive();

                                         
                                       }
                                     }
                                    }
                                    if (seconds > 50 && this.state.refreshing) {
                                      this.setState({refreshing:false});
                                    }

                                   if (minutes < 10)
                                    minutes="0" + minutes;
                                   if (hour < 10)
                                     hour="0" + hour;
                                   if (seconds < 10)
                                     seconds="0" + seconds;

                                   var diff=hour + ":" + minutes + ":" + seconds
                                   if (dashboard_totals.lockdown_text.next_refresh_time < new moment().tz("US/Eastern")) {
                                      diff="-" + diff;
                                      //$('#next_lockdown').hide();
                                      //$('#next_unlock').show();
                                   } else {
                                      //$('#next_lockdown').show();
                                      //$('#next_unlock').hide();
                                   }
                                   $('#countdown_time').html(diff);

                                   /*
                                   
                                   if (minutes2 < 10)
                                    minutes2="0" + minutes2;
                                   if (hour2 < 10)
                                     hour="0" + hour2;
                                   if (seconds2 < 10)
                                     seconds2="0" + seconds2;

                                   var diff2=hour2 + ":" + minutes2 + ":" + seconds2
                                   if (dashboard_totals.lockdown_text.next_unlock_time < new moment().tz("US/Eastern")) {
                                      diff2="-" + diff2;
                                   } else {
                                      $('#countdown_unlock_time').html(diff2);
                                    }

                                  */
                                   
                                  }} 
            ></Moment>
            { dashboard_totals.lockdown_text.mid_text }<br/>
            { dashboard_totals.lockdown_text.bottom_text }<br/>
           
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
        </div>
        <div className={classes.Saperation} />
        <div className={classes.Right}>
          <span  style={{"marginLeft":"12px", "marginTop":"27px"}}>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <h3>
            <LiveClock format={'hh:mm:ss A '} ticking={true} timezone={'US/Eastern'} />
            &nbsp;
            </h3> EST
            <br/>
          </span>
          <span  style={{"marginLeft":"28px", "marginTop":"8px"}}>
            <p>
            <LiveClock format={'dddd, DD MMM YYYY'} ticking={true} timezone={'US/Eastern'} /> 
            <Moment format={'YYYY-MM-DD HH:mm:ss'} onChange={(val) => { console.log(val); updateDate(val); }} interval={30000} tz="US/Eastern" style={{"display":"none"}} className="datetime" aria-hidden={true}/>
            </p>
          </span>
        </div>
      </div>
      );
  }
}
