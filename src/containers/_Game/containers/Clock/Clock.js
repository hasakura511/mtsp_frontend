import React, { PureComponent } from "react";
import classes from "./Clock.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toSlashDate } from "../../../../util";

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

@connect(state => {
  return {
    simulatedDate: state.betting.simulatedDate
  };
})
export default class Clock extends PureComponent {
  static propTypes = {
    simulatedDate: PropTypes.string.isRequired
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
    const { simulatedDate } = this.props;
    return (
      <div className={classes.Widget}>
        <div className={classes.Left}>
            <span className="isLive" >
            <p  style={{ width: "140px", 
                        "margin-left":"15px",
                        "line-height":"1" }}>
              <font size="1">
              <br/>
            Next Lockdown: 01:29.59<br/>
            29 Markets<br/>
            @ Mon, 4/23  01:23PM<br/>
              </font>
            </p>
            </span>
            <span className="isSim" style={{"display":"none"}}>
            <p  style={{ width: "140px", 
                        "margin-left":"15px",
                        "line-height":"1" }}>
                    <br/><b>Practice Mode</b>
            </p>
            </span>
        </div>
        <div className={classes.Saperation} />
        <div className={classes.Right}>
          <span sytle={{"margin-left":"5px"}}>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <h3 style={{ width: "95px" }}>{this.clockTime[0]}</h3>
            <h3 style={{ width: "45px" }}>{this.clockTime[1]}</h3>
            <p>EST</p>
          </span>
          <span>
            <p>{Formatter.format(new Date(toSlashDate(simulatedDate)))}</p>
          </span>
        </div>
      </div>
    );
  }
}
