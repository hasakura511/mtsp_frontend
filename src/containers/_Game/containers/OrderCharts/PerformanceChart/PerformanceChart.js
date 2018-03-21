import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate } from "../../../../../util";
import classes from "./PerformanceChart.css";
import { LongShortMap } from "../../../Config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from "recharts";

import { connect } from "react-redux";

const stateToProps = state => ({
  simulatedDate: state.betting.simulatedDate
});

const convert = pnlObj => {
  return {
    pnl: Number(pnlObj.pnl).toFixed(2),
    cumulative: (pnlObj.cumulative * 100).toFixed(2),
    changePercent: (pnlObj.changePercent * 100).toFixed(2)
  };
};

const RED = "#e12f48",
  BLUE = "#8884d8",
  GREEN = "#63a57c";

const mergeChartData = (performance, lookback, endDate, position) => {
  // Example data is like this:
  // pnlData = [{
  //   date: "20171221",
  //   pnl: "5000",
  //   changePercent: "0",
  //   cumulative: "0"
  // }];
  // antiPnlData = [{
  //   date: "20171221",
  //   pnl: "5000",
  //   changePercent: "0",
  //   cumulative: "0"
  // }];
  // benchmarkData = [{
  //   date: "20171221",
  //   pnl: "5000",
  //   changePercent: "0",
  //   cumulative: "0"
  // }];
  // antiBenchmarkData = [{
  //   date: "20171221",
  //   pnl: "5000",
  //   changePercent: "0",
  //   cumulative: "0"
  // }];

  const {
    pnlData,
    antiPnlData,
    benchmarkData,
    antiBenchmarkData
  } = performance;

  const len = pnlData.length,
    chartData = [];
  for (let index = 0; index < len; index++) {
    chartData.push({
      date: Number(pnlData[index].date),
      axisDate: toSlashDate(pnlData[index].date),
      "P&L": pnlData[index].pnl,
      "Anti P&L": antiPnlData[index].pnl,
      "S&P 500": benchmarkData[index].pnl,
      "Anti Benchmark": antiBenchmarkData[index].pnl,
      pnlData: convert(pnlData[index]),
      antiPnlData: convert(antiPnlData[index]),
      benchmarkData: convert(benchmarkData[index]),
      position
    });
  }
  let index = 0;
  chartData.forEach((data, i) => {
    if (data.date <= endDate) {
      index = i;
    }
  });

  // check all chartData till now:
  // return chartData;

  // check chartData till simulation Date:
  return chartData.slice(index - lookback > 0 ? index - lookback : 0, index);
};

class CustomTooltip extends Component {
  render() {
    const { payload, active } = this.props;
    if (active) {
      let {
        date,
        pnlData,
        antiPnlData,
        benchmarkData,
        position
      } = payload[0].payload;
      position = LongShortMap[position];
      // example payload for testing purpose:
      // const date = "20181212",
      // pnlData = { date: "20171221", pnl: "5000", changePercent: "0", cumulative: "0" },
      // antiPnlData = { date: "20171221", pnl: "5000", changePercent: "0", cumulative: "0" },
      // benchmarkData = { date: "20171221", pnl: "5000", changePercent: "0", cumulative: "0" },
      // position = 7;

      return (
        <div className={classes.ToolTip}>
          <div className={classes.Row}>{toWordedDate(date)}</div>
          <hr style={{ width: "100%" }} />
          <div className={classes.Row} style={{ color: BLUE }}>
            <p>
              <span>{position}:</span> <span>{pnlData.pnl}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: BLUE }}>
            <p>
              <span>{position} Daily %Chg.: </span>
              <span>{pnlData.changePercent}%</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: BLUE }}>
            <p>
              <span>{position} Cum. %Chg.: </span>
              <span>{pnlData.cumulative}%</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: GREEN }}>
            <p>
              <span>Anti {position}: </span>
              <span>{antiPnlData.pnl}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: GREEN }}>
            <p>
              <span>Anti {position} Daily %Chg.: </span>
              <span>{antiPnlData.changePercent}%</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: GREEN }}>
            <p>
              <span>Anti {position} Cum. %Chg.:</span>{" "}
              <span>{antiPnlData.cumulative}%</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: RED }}>
            <p>
              <span>S&P 500: </span>
              <span>{benchmarkData.pnl}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: RED }}>
            <p>
              <span>S&P 500 Cum. %Chg.: </span>
              <span>{benchmarkData.cumulative}%</span>
            </p>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  static propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.object)
  };
}

@connect(stateToProps)
class PerformanceChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lookback: 20
      // endDate: 20180201
    };
  }

  lookbackHandler = lookback => {
    this.setState({ lookback });
  };

  xTick({ payload, x, y }) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" transform="rotate(-45)">
          {payload.value}
        </text>
      </g>
    );
  }

  render() {
    const { performance, position, simulatedDate } = this.props;
    const { lookback } = this.state;
    return (
      <div className={classes.PerformanceChart}>
        <div className={classes.Tabs}>
          <div className={classes.Tab} onClick={() => this.lookbackHandler(1)}>
            <p className={lookback === 1 ? classes.active : ""}>1 day</p>
          </div>
          <div className={classes.Tab} onClick={() => this.lookbackHandler(3)}>
            <p className={lookback === 3 ? classes.active : ""}>3 days</p>
          </div>
          <div className={classes.Tab} onClick={() => this.lookbackHandler(5)}>
            <p className={lookback === 5 ? classes.active : ""}>5 days</p>
          </div>
          <div className={classes.Tab} onClick={() => this.lookbackHandler(10)}>
            <p className={lookback === 10 ? classes.active : ""}>10 days</p>
          </div>
          <div className={classes.Tab} onClick={() => this.lookbackHandler(20)}>
            <p className={lookback === 20 ? classes.active : ""}>20 days</p>
          </div>
        </div>
        <div className={classes.ChartContainer}>
          <ResponsiveContainer width="100%" height={440} maxHeight="100%">
            <LineChart
              data={mergeChartData(
                performance,
                lookback,
                simulatedDate,
                position
              )}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="axisDate"
                interval={0}
                tick={props => this.xTick(props)}
                height={100}
              >
                <Label
                  position="bottom"
                  offset={-15}
                  value="Hypothetical Historical Performance for Market-on-Close orders"
                />
              </XAxis>
              <YAxis
                tickFormatter={value =>
                  `${Math.floor(value).toLocaleString("en")}`
                }
                domain={["dataMin", "dataMax"]}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="P&L"
                stroke={BLUE}
                // activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="Anti P&L"
                stroke={GREEN}
                // activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="S&P 500" stroke={RED} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

PerformanceChart.propTypes = {
  /**
   * @example 
   * 
   * performance = {
      "pnlData": [
        {
          "date": "20171221",
          "pnl": "5000",
          "changePercent": "0",
          "cumulative": "0"
        },
        {
          "date": "20180110",
          "pnl": 3567.1987,
          "changePercent": -0.28656026,
          "cumulative": -0.28656026
        },
        {
          "date": "20180109",
          "pnl": 4535.8531,
          "changePercent": 0.27154483993280215,
          "cumulative": -0.015015420067197827
        },
        {
          "date": "20180105",
          "pnl": 5242.1636,
          "changePercent": 0.15571723431695791,
          "cumulative": 0.1407018142497601
        },
        {
          "date": "20180104",
          "pnl": 5726.4908,
          "changePercent": 0.0923907067684801,
          "cumulative": 0.2330925210182402
        },
        {
          "date": "20180103",
          "pnl": 7885.7829,
          "changePercent": 0.3770707358859286,
          "cumulative": 0.6101632569041688
        },
        {
          "date": "20171229",
          "pnl": 11457.696,
          "changePercent": 0.45295605335520966,
          "cumulative": 1.0631193102593786
        },
        {
          "date": "20171228",
          "pnl": 15029.6091,
          "changePercent": 0.31174793780529697,
          "cumulative": 1.3748672480646755
        },
        {
          "date": "20171227",
          "pnl": 16240.4271,
          "changePercent": 0.08056217510008294,
          "cumulative": 1.4554294231647584
        },
        {
          "date": "20171222",
          "pnl": 17047.6391,
          "changePercent": 0.04970386523886432
        }
      ],
      "antiPnlData": [
        {
          "date": "20171221",
          "pnl": "5000",
          "changePercent": "0",
          "cumulative": "0"
        },
        {
          "date": "20180110",
          "pnl": 6432.8013,
          "changePercent": 0.28656026,
          "cumulative": 0.28656026
        },
        {
          "date": "20180109",
          "pnl": 5464.1469,
          "changePercent": -0.1505804943796414,
          "cumulative": 0.13597976562035857
        },
        {
          "date": "20180105",
          "pnl": 4757.8364,
          "changePercent": -0.12926272168854025,
          "cumulative": 0.006717043931818328
        },
        {
          "date": "20180104",
          "pnl": 4273.5092,
          "changePercent": -0.10179568175147846,
          "cumulative": -0.09507863781966014
        },
        {
          "date": "20180103",
          "pnl": 2114.2171,
          "changePercent": -0.5052737689203992,
          "cumulative": -0.6003524067400593
        },
        {
          "date": "20171229",
          "pnl": -1457.696,
          "changePercent": -1.68947318607914,
          "cumulative": -2.2898255928191995
        },
        {
          "date": "20171228",
          "pnl": -5029.6091,
          "changePercent": 2.450382727262749,
          "cumulative": 0.16055713444354944
        },
        {
          "date": "20171227",
          "pnl": -6240.4271,
          "changePercent": 0.240737992938656,
          "cumulative": 0.40129512738220546
        },
        {
          "date": "20171222",
          "pnl": -7047.6391,
          "changePercent": 0.12935204386892044
        }
      ],
      "benchmarkData": [
        {
          "date": "20171221",
          "pnl": "5000",
          "changePercent": "0",
          "cumulative": "0"
        },
        {
          "date": "20180110",
          "pnl": 5121.0818,
          "changePercent": 0.02421636,
          "cumulative": 0.02421636
        },
        {
          "date": "20180109",
          "pnl": 5524.6878,
          "changePercent": 0.078812644625204,
          "cumulative": 0.103029004625204
        },
        {
          "date": "20180105",
          "pnl": 6917.1285,
          "changePercent": 0.2520397080175282,
          "cumulative": 0.35506871264273215
        },
        {
          "date": "20180104",
          "pnl": 7865.6026,
          "changePercent": 0.13711962991579527,
          "cumulative": 0.4921883425585274
        },
        {
          "date": "20180103",
          "pnl": 9217.6827,
          "changePercent": 0.17189784035110037,
          "cumulative": 0.6640861829096277
        },
        {
          "date": "20171229",
          "pnl": 9944.1735,
          "changePercent": 0.07881490648403422,
          "cumulative": 0.742901089393662
        },
        {
          "date": "20171228",
          "pnl": 9964.3538,
          "changePercent": 0.002029359202149882,
          "cumulative": 0.7449304485958119
        },
        {
          "date": "20171227",
          "pnl": 10085.4356,
          "changePercent": 0.012151495463760029,
          "cumulative": 0.757081944059572
        },
        {
          "date": "20171222",
          "pnl": 9944.1735,
          "changePercent": -0.014006544248817572
        }
      ],
      "antiBenchmarkData": [
        {
          "date": "20171221",
          "pnl": "5000",
          "changePercent": "0",
          "cumulative": "0"
        },
        {
          "date": "20180110",
          "pnl": 4878.9182,
          "changePercent": -0.02421636,
          "cumulative": -0.02421636
        },
        {
          "date": "20180109",
          "pnl": 4475.3122,
          "changePercent": -0.08272448593214783,
          "cumulative": -0.10694084593214782
        },
        {
          "date": "20180105",
          "pnl": 3082.8715,
          "changePercent": -0.3111382262895536,
          "cumulative": -0.41807907222170143
        },
        {
          "date": "20180104",
          "pnl": 2134.3974,
          "changePercent": -0.3076593039962905,
          "cumulative": -0.7257383762179919
        },
        {
          "date": "20180103",
          "pnl": 782.3173,
          "changePercent": -0.6334715831269284,
          "cumulative": -1.3592099593449203
        },
        {
          "date": "20171229",
          "pnl": 55.8265,
          "changePercent": -0.9286395686251602,
          "cumulative": -2.2878495279700806
        },
        {
          "date": "20171228",
          "pnl": 35.6462,
          "changePercent": -0.3614824500909066,
          "cumulative": -2.649331978060987
        },
        {
          "date": "20171227",
          "pnl": -85.4356,
          "changePercent": -3.3967659946922812,
          "cumulative": -6.046097972753269
        },
        {
          "date": "20171222",
          "pnl": 55.8265,
          "changePercent": -1.6534336974282384
        }
      ]
    }
   * 
   */
  performance: PropTypes.object,
  position: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  simulatedDate: PropTypes.string.isRequired
};

export default PerformanceChart;
