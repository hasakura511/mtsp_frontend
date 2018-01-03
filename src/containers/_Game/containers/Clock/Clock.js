import React, { PureComponent } from "react";
import classes from "./Clock.css";

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
  timeZone: "America/New_York",
  weekend: "long",
  weekday: "long"
});

class Clock extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      estTime: null
    };
  }

  componentDidMount() {
    this.timerInterval = setInterval(() => {
      this.setState({
        estTime: new Date().toLocaleTimeString([], {
          timeZone: "America/New_York"
        })
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }

  render() {
    return (
      <div className={classes.Widget}>
        <div className={classes.Left}>
          <i className={"fa fa-clock-o"} />
        </div>
        <div className={classes.Saperation} />
        <div className={classes.Right}>
          <span>
            <h3>{this.state.estTime}</h3>
            <p>EST</p>
          </span>
          <span>
            <p>{Formatter.format(new Date())}</p>
          </span>
        </div>
      </div>
    );
  }
}

export default Clock;