import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate } from "../../../../../util";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const mergeChartData = performance => {
  // Example data is like this:
  // pnlData = [{
  //   date: "20171221",
  //   pnl: "5000",
  //   changePercent: "0",
  //   cummulative: "0"
  // }];
  // antiPnlData = [{
  //   date: "20171221",
  //   pnl: "5000",
  //   changePercent: "0",
  //   cummulative: "0"
  // }];
  // benchmarkData = [{
  //   date: "20171221",
  //   pnl: "5000",
  //   changePercent: "0",
  //   cummulative: "0"
  // }];
  // antiBenchmarkData = [{
  //   date: "20171221",
  //   pnl: "5000",
  //   changePercent: "0",
  //   cummulative: "0"
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
      date: pnlData[index].date,
      pnl: pnlData[index].pnl,
      antiPnl: antiPnlData[index].pnl,
      benchmark: benchmarkData[index].pnl,
      antiBenchmarkData: antiBenchmarkData[index].pnl
    });
  }
  return chartData;
};

class CustomTooltip extends Component {
  render() {
    const { payload, active } = this.props;
    return active ? <div>{toWordedDate(payload[0].payload.date)}</div> : null;
  }

  static propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.object)
  };
}

const performanceChart = props => {
  const { performance } = props;
  return (
    <LineChart
      width={600}
      height={300}
      data={mergeChartData(performance)}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line
        type="monotone"
        dataKey="pnl"
        stroke="#8884d8"
        // activeDot={{ r: 8 }}
      />
      <Line
        type="monotone"
        dataKey="antiPnl"
        stroke="#8884d8"
        // activeDot={{ r: 8 }}
      />
      <Line type="monotone" dataKey="benchmark" stroke="#82ca9d" />
    </LineChart>
  );
};

performanceChart.propTypes = {
  /**
   * @example 
   * 
   * performance = {
      "pnlData": [
        {
          "date": "20171221",
          "pnl": "5000",
          "changePercent": "0",
          "cummulative": "0"
        },
        {
          "date": "20180110",
          "pnl": 3567.1987,
          "changePercent": -0.28656026,
          "cummulative": -0.28656026
        },
        {
          "date": "20180109",
          "pnl": 4535.8531,
          "changePercent": 0.27154483993280215,
          "cummulative": -0.015015420067197827
        },
        {
          "date": "20180105",
          "pnl": 5242.1636,
          "changePercent": 0.15571723431695791,
          "cummulative": 0.1407018142497601
        },
        {
          "date": "20180104",
          "pnl": 5726.4908,
          "changePercent": 0.0923907067684801,
          "cummulative": 0.2330925210182402
        },
        {
          "date": "20180103",
          "pnl": 7885.7829,
          "changePercent": 0.3770707358859286,
          "cummulative": 0.6101632569041688
        },
        {
          "date": "20171229",
          "pnl": 11457.696,
          "changePercent": 0.45295605335520966,
          "cummulative": 1.0631193102593786
        },
        {
          "date": "20171228",
          "pnl": 15029.6091,
          "changePercent": 0.31174793780529697,
          "cummulative": 1.3748672480646755
        },
        {
          "date": "20171227",
          "pnl": 16240.4271,
          "changePercent": 0.08056217510008294,
          "cummulative": 1.4554294231647584
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
          "cummulative": "0"
        },
        {
          "date": "20180110",
          "pnl": 6432.8013,
          "changePercent": 0.28656026,
          "cummulative": 0.28656026
        },
        {
          "date": "20180109",
          "pnl": 5464.1469,
          "changePercent": -0.1505804943796414,
          "cummulative": 0.13597976562035857
        },
        {
          "date": "20180105",
          "pnl": 4757.8364,
          "changePercent": -0.12926272168854025,
          "cummulative": 0.006717043931818328
        },
        {
          "date": "20180104",
          "pnl": 4273.5092,
          "changePercent": -0.10179568175147846,
          "cummulative": -0.09507863781966014
        },
        {
          "date": "20180103",
          "pnl": 2114.2171,
          "changePercent": -0.5052737689203992,
          "cummulative": -0.6003524067400593
        },
        {
          "date": "20171229",
          "pnl": -1457.696,
          "changePercent": -1.68947318607914,
          "cummulative": -2.2898255928191995
        },
        {
          "date": "20171228",
          "pnl": -5029.6091,
          "changePercent": 2.450382727262749,
          "cummulative": 0.16055713444354944
        },
        {
          "date": "20171227",
          "pnl": -6240.4271,
          "changePercent": 0.240737992938656,
          "cummulative": 0.40129512738220546
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
          "cummulative": "0"
        },
        {
          "date": "20180110",
          "pnl": 5121.0818,
          "changePercent": 0.02421636,
          "cummulative": 0.02421636
        },
        {
          "date": "20180109",
          "pnl": 5524.6878,
          "changePercent": 0.078812644625204,
          "cummulative": 0.103029004625204
        },
        {
          "date": "20180105",
          "pnl": 6917.1285,
          "changePercent": 0.2520397080175282,
          "cummulative": 0.35506871264273215
        },
        {
          "date": "20180104",
          "pnl": 7865.6026,
          "changePercent": 0.13711962991579527,
          "cummulative": 0.4921883425585274
        },
        {
          "date": "20180103",
          "pnl": 9217.6827,
          "changePercent": 0.17189784035110037,
          "cummulative": 0.6640861829096277
        },
        {
          "date": "20171229",
          "pnl": 9944.1735,
          "changePercent": 0.07881490648403422,
          "cummulative": 0.742901089393662
        },
        {
          "date": "20171228",
          "pnl": 9964.3538,
          "changePercent": 0.002029359202149882,
          "cummulative": 0.7449304485958119
        },
        {
          "date": "20171227",
          "pnl": 10085.4356,
          "changePercent": 0.012151495463760029,
          "cummulative": 0.757081944059572
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
          "cummulative": "0"
        },
        {
          "date": "20180110",
          "pnl": 4878.9182,
          "changePercent": -0.02421636,
          "cummulative": -0.02421636
        },
        {
          "date": "20180109",
          "pnl": 4475.3122,
          "changePercent": -0.08272448593214783,
          "cummulative": -0.10694084593214782
        },
        {
          "date": "20180105",
          "pnl": 3082.8715,
          "changePercent": -0.3111382262895536,
          "cummulative": -0.41807907222170143
        },
        {
          "date": "20180104",
          "pnl": 2134.3974,
          "changePercent": -0.3076593039962905,
          "cummulative": -0.7257383762179919
        },
        {
          "date": "20180103",
          "pnl": 782.3173,
          "changePercent": -0.6334715831269284,
          "cummulative": -1.3592099593449203
        },
        {
          "date": "20171229",
          "pnl": 55.8265,
          "changePercent": -0.9286395686251602,
          "cummulative": -2.2878495279700806
        },
        {
          "date": "20171228",
          "pnl": 35.6462,
          "changePercent": -0.3614824500909066,
          "cummulative": -2.649331978060987
        },
        {
          "date": "20171227",
          "pnl": -85.4356,
          "changePercent": -3.3967659946922812,
          "cummulative": -6.046097972753269
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
  performance: PropTypes.object
};

export default performanceChart;
