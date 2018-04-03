import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./RankingChart.css";
import Config from "../../../Config";

const LongShortMap = Object.values(Config).reduce((acc, { column, short }) => {
  acc[column] = short;
  return acc;
}, {});

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

const DEFAULT_LOOKBACK = "20 Day Cum. %Chg.";

class RankingChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // lookback,
      //if in future we decide to include filters
      //filters: []
      rankingChartData: [],
      lookback: "20 Day Cum. %Chg."
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
          name: position,
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
                name: "Anti-" + rank.name
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
        return { ...rankingObj, name: `${rankingObj.name} (${index + 1})` };
      });

    return rankingChartData;
  }

  getColor({ x, y, payload }) {
    // tickObj.payload.value will be the string value "1" or "2" or "prev1" etc but with ranks
    const value = payload.value.split(" ")[0];
    const rank = payload.value.split(" ")[1];

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
        .map(system => system.column)
        .indexOf(value) !== -1
    ) {
      color = "blue";
    }
    if (position.toString() === value) {
      color = "red";
    }
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill={color || "#8884d8"}
          transform="rotate(-70)"
          fontSize={14}
        >
          {LongShortMap[value] || value} {rank}
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
      <div className={classes.RankingChart}>
        <ResponsiveContainer
          width="100%"
          height={innerHeight - 190}
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
  /**
   *
   * @example rankingData = [
      {
        accountResult: [
          {
            position: "1",
            result: [
              { lookback: "1", changePercent: 0.0234781337 },
              { lookback: "5", changePercent: 0.03541606526107178 },
              { lookback: "20", changePercent: 0.3179592944773909 }
            ]
          },
          {
            position: "2",
            result: [
              { lookback: "1", changePercent: -0.0042865625 },
              { lookback: "5", changePercent: -0.0397214677123515 },
              { lookback: "20", changePercent: -0.11611727976955066 }
            ]
          },
          {
            position: "3",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: 0.018577875193976343 },
              { lookback: "20", changePercent: 0.15710512502222557 }
            ]
          },
          {
            position: "4",
            result: [
              { lookback: "1", changePercent: -0.0149050087 },
              { lookback: "5", changePercent: 0.05659907328413209 },
              { lookback: "20", changePercent: 0.016222990759001934 }
            ]
          },
          {
            position: "5",
            result: [
              { lookback: "1", changePercent: -0.0149050087 },
              { lookback: "5", changePercent: -0.12161390212182181 },
              { lookback: "20", changePercent: -1.0504670222315104 }
            ]
          },
          {
            position: "6",
            result: [
              { lookback: "1", changePercent: -0.0149050087 },
              { lookback: "5", changePercent: -0.06367174255870517 },
              { lookback: "20", changePercent: -0.45337966732806817 }
            ]
          },
          {
            position: "7",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: 0.042909131124526274 },
              { lookback: "20", changePercent: 0.4024962886070854 }
            ]
          },
          {
            position: "8",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: -0.11753332433602427 },
              { lookback: "20", changePercent: -0.2368803939206401 }
            ]
          },
          {
            position: "9",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: 0.0002783898547336947 },
              { lookback: "20", changePercent: 0.27856816222412717 }
            ]
          },
          {
            position: "10",
            result: [
              { lookback: "1", changePercent: 0.0234781337 },
              { lookback: "5", changePercent: 0.05993515812303687 },
              { lookback: "20", changePercent: 0.2762900293595273 }
            ]
          },
          {
            position: "11",
            result: [
              { lookback: "1", changePercent: -0.0234781337 },
              { lookback: "5", changePercent: -0.15269200420192816 },
              { lookback: "20", changePercent: -0.9119985258290934 }
            ]
          },
          {
            position: "12",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: -0.03249354961066376 },
              { lookback: "20", changePercent: -0.28927921164272513 }
            ]
          },
          {
            position: "13",
            result: [
              { lookback: "1", changePercent: 0.0234781337 },
              { lookback: "5", changePercent: 0.13710856972933955 },
              { lookback: "20", changePercent: 0.4185048280043749 }
            ]
          },
          {
            position: "14",
            result: [
              { lookback: "1", changePercent: -0.0234781337 },
              { lookback: "5", changePercent: -0.040244106763844975 },
              { lookback: "20", changePercent: -0.23795233715386782 }
            ]
          },
          {
            position: "15",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: 0.08434614617594545 },
              { lookback: "20", changePercent: 0.2935551490732178 }
            ]
          },
          {
            position: "16",
            result: [
              { lookback: "1", changePercent: -0.0149050087 },
              { lookback: "5", changePercent: 0.12862462491922716 },
              { lookback: "20", changePercent: 0.2982297710200929 }
            ]
          },
          {
            position: "17",
            result: [
              { lookback: "1", changePercent: -0.0149050087 },
              { lookback: "5", changePercent: -0.04350755078282688 },
              { lookback: "20", changePercent: -0.7981175166830348 }
            ]
          },
          {
            position: "18",
            result: [
              { lookback: "1", changePercent: -0.0149050087 },
              { lookback: "5", changePercent: 0.05404987721167283 },
              { lookback: "20", changePercent: -0.2522873329612382 }
            ]
          },
          {
            position: "19",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: 0.0899661767711447 },
              { lookback: "20", changePercent: 0.3899018566766769 }
            ]
          },
          {
            position: "20",
            result: [
              { lookback: "1", changePercent: -0.0042865625 },
              { lookback: "5", changePercent: -0.060758163208695086 },
              { lookback: "20", changePercent: -0.592274112673721 }
            ]
          },
          {
            position: "21",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: 0.03466661149402383 },
              { lookback: "20", changePercent: 0.10018593085594013 }
            ]
          },
          {
            position: "22",
            result: [
              { lookback: "1", changePercent: -0.0149050087 },
              { lookback: "5", changePercent: 0.05659907328413209 },
              { lookback: "20", changePercent: 0.04399097450114005 }
            ]
          },
          {
            position: "23",
            result: [
              { lookback: "1", changePercent: -0.0234781337 },
              { lookback: "5", changePercent: -0.06570601564080708 },
              { lookback: "20", changePercent: -0.7574754181992598 }
            ]
          },
          {
            position: "24",
            result: [
              { lookback: "1", changePercent: -0.0234781337 },
              { lookback: "5", changePercent: -0.02372805665747734 },
              { lookback: "20", changePercent: -0.4052236746087978 }
            ]
          },
          {
            position: "25",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: 0.0899661767711447 },
              { lookback: "20", changePercent: 0.4493614482238469 }
            ]
          },
          {
            position: "26",
            result: [
              { lookback: "1", changePercent: -0.0234781337 },
              { lookback: "5", changePercent: -0.059581209911307456 },
              { lookback: "20", changePercent: -0.4923907628150412 }
            ]
          },
          {
            position: "27",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: 0.03466661149402383 },
              { lookback: "20", changePercent: 0.2132386570410826 }
            ]
          },
          {
            position: "28",
            result: [
              { lookback: "1", changePercent: -0.0149050087 },
              { lookback: "5", changePercent: 0.05659907328413209 },
              { lookback: "20", changePercent: -0.014988859622831406 }
            ]
          },
          {
            position: "29",
            result: [
              { lookback: "1", changePercent: -0.0234781337 },
              { lookback: "5", changePercent: -0.12495430805902948 },
              { lookback: "20", changePercent: -0.9673327653595977 }
            ]
          },
          {
            position: "30",
            result: [
              { lookback: "1", changePercent: -0.0234781337 },
              { lookback: "5", changePercent: -0.02372805665747734 },
              { lookback: "20", changePercent: -0.5607281052514457 }
            ]
          },
          {
            position: "31",
            result: [
              { lookback: "1", changePercent: 0.0234781337 },
              { lookback: "5", changePercent: 0.13710856972933955 },
              { lookback: "20", changePercent: 0.4384952771263811 }
            ]
          },
          {
            position: "32",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: -0.09756914224249026 },
              { lookback: "20", changePercent: -0.029127698324615384 }
            ]
          },
          {
            position: "33",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: 0.014659578238730807 },
              { lookback: "20", changePercent: 0.16367519834463085 }
            ]
          },
          {
            position: "34",
            result: [
              { lookback: "1", changePercent: 0.0234781337 },
              { lookback: "5", changePercent: 0.020785266202943353 },
              { lookback: "20", changePercent: 0.2657127521751471 }
            ]
          },
          {
            position: "35",
            result: [
              { lookback: "1", changePercent: -0.0149050087 },
              { lookback: "5", changePercent: -0.06972329516273729 },
              { lookback: "20", changePercent: -0.751129168899804 }
            ]
          },
          {
            position: "36",
            result: [
              { lookback: "1", changePercent: 0.0234781337 },
              { lookback: "5", changePercent: 0.012351888340287802 },
              { lookback: "20", changePercent: 0.0819998826068446 }
            ]
          },
          {
            position: "riskOn",
            result: [
              { lookback: "1", changePercent: -0.0149050087 },
              { lookback: "5", changePercent: -0.015167204155282879 },
              { lookback: "20", changePercent: -0.4374679075161238 }
            ]
          },
          {
            position: "riskOff",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: 0.018577875193976343 },
              { lookback: "20", changePercent: 0.3229370729602858 }
            ]
          },
          {
            position: "prev1",
            result: [
              { lookback: "1", changePercent: 0.0234781337 },
              { lookback: "5", changePercent: 0.16186317494420127 },
              { lookback: "20", changePercent: 0.6051287596384812 }
            ]
          },
          {
            position: "antiPrev1",
            result: [
              { lookback: "1", changePercent: -0.0234781337 },
              { lookback: "5", changePercent: -0.18384249043946177 },
              { lookback: "20", changePercent: -1.5683334329434864 }
            ]
          },
          {
            position: "prev5",
            result: [
              { lookback: "1", changePercent: -0.0149050087 },
              { lookback: "5", changePercent: -0.03171564038965569 },
              { lookback: "20", changePercent: -0.052663187003144846 }
            ]
          },
          {
            position: "lowEq",
            result: [
              { lookback: "1", changePercent: 0.0042865625 },
              { lookback: "5", changePercent: 0.014520530270903345 },
              { lookback: "20", changePercent: 0.035496519848355564 }
            ]
          },
          {
            position: "highEq",
            result: [
              { lookback: "1", changePercent: 0.0149050087 },
              { lookback: "5", changePercent: -0.08834022099765265 },
              { lookback: "20", changePercent: -0.014126686308918184 }
            ]
          },
          {
            position: "antiHighEq",
            result: [
              { lookback: "1", changePercent: -0.0149050087 },
              { lookback: "5", changePercent: 0.08592238346680868 },
              { lookback: "20", changePercent: 0.034095502640539045 }
            ]
          },
          {
            position: "anti50",
            result: [
              { lookback: "1", changePercent: -0.0042865625 },
              { lookback: "5", changePercent: 0.046237471567350794 },
              { lookback: "20", changePercent: -0.2009322498371903 }
            ]
          },
          {
            position: "sea",
            result: [
              { lookback: "1", changePercent: -0.0234781337 },
              { lookback: "5", changePercent: -0.006404238335328512 },
              { lookback: "20", changePercent: -0.24242526334772285 }
            ]
          },
          {
            position: "antiSea",
            result: [
              { lookback: "1", changePercent: 0.0234781337 },
              { lookback: "5", changePercent: 0.008969264204609004 },
              { lookback: "20", changePercent: 0.21524737907633296 }
            ]
          }
        ],
        account: { portfolio: ["TU", "BO"], target: "250", accountValue: "5000" }
      }
    ]
   *
   */
  rankingData: PropTypes.array.isRequired,
  chip: PropTypes.object.isRequired,
  slot: PropTypes.object.isRequired
};

export default RankingChart;
