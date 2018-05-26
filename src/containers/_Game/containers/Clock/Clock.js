import React, { PureComponent } from "react";
import classes from "./Clock.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toSlashDate } from "../../../../util";
import LiveClock from 'react-live-clock';
import Moment from 'react-moment';
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
    isLive:state.betting.isLive,
    //liveDate:state.betting.liveDate,
  };
};

const dispatchToProps = dispatch => {
  return {
    updateDate: date => {
      dispatch(actions.updateDate(date));
    },
  };
};

@connect(stateToProps, dispatchToProps)


export default class Clock extends PureComponent {
  static propTypes = {
    //simulatedDate: PropTypes.string.isRequired,
    isLive:PropTypes.bool.isRequired,
    //liveDate: PropTypes.instanceOf(Date).isRequired,
    updateDate:PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      estTime: "5:00:00 PM"
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
    this.clockTime = this.state.estTime.split(/\s/);
    const { updateDate } = this.props;
    return (
      <div className={classes.Widget}>
        <div className={classes.Left}>
          {this.props.isLive ? (
            <span className="isLive" >
            <p  style={{ width: "140px", 
                        "marginLeft":"15px",
                        "lineHeight":"1" }}>
              <font size="1">
              <br/>
            Next Lockdown: 01:29.59<br/>
            29 Markets<br/>
            @ Mon, 4/23  01:23PM<br/>
              </font>
            </p>
            </span>
          ) : (
            <span className="isSim">
            <p  style={{ width: "150px", 
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
          <span sytle={{"margin-left":"5px"}}>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <h3>
            <LiveClock format={'HH:mm:ss A '} ticking={true} timezone={'US/Eastern'} />
            &nbsp;
            </h3>
            <br/>
          </span>
          <span>
            <p>
            <LiveClock format={'dddd, DD MMM YYYY'} ticking={true} timezone={'US/Eastern'} /> EST
            <Moment onChange={(val) => { console.log(val); updateDate(val); }} interval={1000} tz="US/Eastern" style={{"display":"none"}} className="datetime" aria-hidden={true}/>
            </p>
          </span>
        </div>
      </div>
    );
  }
}
