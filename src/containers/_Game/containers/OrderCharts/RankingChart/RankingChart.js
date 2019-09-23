import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./RankingChart.css";
import { toSystem, toAntiSystem } from "../../../Config";

import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Bar,
  ResponsiveContainer,
  Label
} from "recharts";

const DEFAULT_LOOKBACK = "1 Day Cum. %Chg.";

class RankingChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // lookback,
      //if in future we decide to include filters
      //filters: []
      rankingChartData: [],
      lookback: "1 Day Cum. %Chg."
    };
  }

  componentWillMount() {
    //parse ranking data and setState
    this.setState({
      rankingChartData: this.syncRankingChart(DEFAULT_LOOKBACK)
    });
  }

  syncRankingChart(lookback) {
    // const data = [
    //   {
    //     name: "Page A",
    //     "20 Day Cum. %Chg.": 4000,
    //     "5 Day Cum. %Chg.": 2400,
    //     "1 Day Cum. %Chg.": 2400
    //   },
    //   {
    //     name: "Page B",
    //     "20 Day Cum. %Chg.": -3000,
    //     "5 Day Cum. %Chg.": 1398,
    //     "1 Day Cum. %Chg.": 2210
    //   },
    //   {
    //     name: "Page C",
    //     "20 Day Cum. %Chg.": -2000,
    //     "5 Day Cum. %Chg.": -9800,
    //     "1 Day Cum. %Chg.": 2290
    //   },
    //   {
    //     name: "Page D",
    //     "20 Day Cum. %Chg.": 2780,
    //     "5 Day Cum. %Chg.": 3908,
    //     "1 Day Cum. %Chg.": 2000
    //   },
    //   {
    //     name: "Page E",
    //     "20 Day Cum. %Chg.": -1890,
    //     "5 Day Cum. %Chg.": 4800,
    //     "1 Day Cum. %Chg.": 2181
    //   },
    //   {
    //     name: "Page F",
    //     "20 Day Cum. %Chg.": 2390,
    //     "5 Day Cum. %Chg.": -3800,
    //     "1 Day Cum. %Chg.": 2500
    //   },
    //   {
    //     name: "Page G",
    //     "20 Day Cum. %Chg.": 3490,
    //     "5 Day Cum. %Chg.": 4300,
    //     "1 Day Cum. %Chg.": 2100
    //   }
    // ];
    const { rankingData, chip } = this.props;

    // console.log(JSON.stringify(rankingData));
    // const antiRankings = [];
    let rankingChartData = rankingData

      // Pick the result for the given account value
      .find(
        ({ account }) => account.accountValue === chip.accountValue.toString()
      )

      // Parse rankign results as required in the ReChart signed-stack-chart package
      .accountResult.map(({ position, result }) => {
        return {
          name: toSystem(position),
          "20 Day Cum. %Chg.":
            result.find(r => r.lookback === "20").changePercent * 100,
          "5 Day Cum. %Chg.":
            result.find(r => r.lookback === "5").changePercent * 100,
          "1 Day Cum. %Chg.":
            result.find(r => r.lookback === "1").changePercent * 100
        };
      });

    //push anti values
    rankingChartData.push(
      ...rankingChartData
        .map(rank => {
          return !isNaN(Number(rank.name.split(/\s/)[0]))
            ? {
                "1 Day Cum. %Chg.": rank["1 Day Cum. %Chg."] * -1,
                "5 Day Cum. %Chg.": rank["5 Day Cum. %Chg."] * -1,
                "20 Day Cum. %Chg.": rank["20 Day Cum. %Chg."] * -1,
                name: toAntiSystem(rank.name)
              }
            : null;
        })
        .filter(item => item)
    );

    rankingChartData = rankingChartData
      // sort results by 20 Day Cum. %Chg. by default
      .sort((r1, r2) => {
        return r2[lookback] - r1[lookback];
      })

      //put rank beside the system/slot name
      .map((rankingObj, index) => {
        return {
          ...rankingObj,
          name: `${rankingObj.name} (${index + 1})`
        };
      });

    return rankingChartData;
  }

  getColor({ x, y, payload }) {
    // tickObj.payload.value will be the string value "1" or "2" or "prev1" etc but with ranks
    const value = payload.value.split("(")[0].trim();

    let color = "black";
    const {
      topSystem,
      leftSystem,
      rightSystem,
      bottomSystem,
      position
    } = this.props.slot;
    if (
      [topSystem, leftSystem, rightSystem, bottomSystem]
        .map(system => system.short)
        .indexOf(value) !== -1
    ) {
      color = "blue";
    }
    if (toSystem(position.toString()) === value) {
      color = "red";
    }
    return (
      <g transform={`translate(${x - 10},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill={color || "#8884d8"}
          transform="rotate(-70)"
          fontSize={14}
        >
          {payload.value}
        </text>
      </g>
    );
  }

  changeLookbackHandler = ({ value }) => {
    this.setState({
      rankingChartData: this.syncRankingChart(value),
      lookback: value
    });
  };

  render() {
    const { rankingChartData, lookback } = this.state;
    const look = lookback.split(" ")[0];
    const [look1, look2] = ["1", "5", "20"].filter(x => x !== look);
    const fill = { "20": "#02abca", "1": "#f00155", "5": "#ffde00" };
    return (
      <div className={"Ranking " + classes.RankingChart}>
        <ResponsiveContainer
          width="100%"
          height={window.innerHeight - 190}
          maxHeight="100%"
        >
          <BarChart
            data={rankingChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
            stackOffset="sign"
          >
            <YAxis type="number" tickFormatter={value => `${value}%`} />
            <XAxis
              type="category"
              dataKey="name"
              tick={props => this.getColor(props)}
              interval={0}
              height={100}
            >
              <Label
                position="bottom"
                offset={15}
                value="Hypothetical Historical Ranking for Market-on-Close (MOC) Orders"
              />
            </XAxis>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip formatter={value => `${value.toFixed(2)}%`} />
            <Legend
              verticalAlign="top"
              wrapperStyle={{ lineHeight: "40px" }}
              onClick={this.changeLookbackHandler}
              payload={[
                {
                  value: "1 Day Cum. %Chg.",
                  type: "square",
                  id: "1 Day Cum. %Chg."
                },
                {
                  value: "5 Day Cum. %Chg.",
                  type: "square",
                  id: "5 Day Cum. %Chg."
                },
                {
                  value: "20 Day Cum. %Chg.",
                  type: "square",
                  id: "20 Day Cum. %Chg."
                }
              ]}
              // content={({ payload }) => {
              //   return <ul>{payload.map(leg => <li key={leg.id} />)}</ul>;
              // }}
            />
            <ReferenceLine x={0} stroke="#000" />
            <Bar dataKey={lookback} stackId="stack" fill={fill[look]} />
            <Bar
              dataKey={look1 + " Day Cum. %Chg."}
              stackId="stack"
              fill={fill[look1]}
            />
            <Bar
              dataKey={look2 + " Day Cum. %Chg."}
              stackId="stack"
              fill={fill[look2]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

RankingChart.propTypes = {
  rankingData: PropTypes.array.isRequired,
  chip: PropTypes.object.isRequired,
  slot: PropTypes.object.isRequired,
  moveChipToSlot:PropTypes.func

};

export default RankingChart;
