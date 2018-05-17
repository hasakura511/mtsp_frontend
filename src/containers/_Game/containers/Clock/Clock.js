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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="41"
            height="42"
            viewBox="0 0 41 42"
          >
            <g>
              <g transform="translate(-891 -233)">
                <image
                  width="41"
                  height="42"
                  transform="translate(891 233)"
                  xlinkHref="data:image/png;base64,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"
                />
              </g>
            </g>
          </svg>
        </div>
        <div className={classes.Saperation} />
        <div className={classes.Right}>
          <span>
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
