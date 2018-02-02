import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./RankingChart.css";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Bar
} from "recharts";

const DEFAULT_LOOKBACK = "20 Days lookback";

class RankingChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // lookback,
      //if in future we decide to include filters
      //filters: []
      rankingChartData: []
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
    //     "20 days lookback": 4000,
    //     "5 days lookback": 2400,
    //     "1 day lookback": 2400
    //   },
    //   {
    //     name: "Page B",
    //     "20 days lookback": -3000,
    //     "5 days lookback": 1398,
    //     "1 day lookback": 2210
    //   },
    //   {
    //     name: "Page C",
    //     "20 days lookback": -2000,
    //     "5 days lookback": -9800,
    //     "1 day lookback": 2290
    //   },
    //   {
    //     name: "Page D",
    //     "20 days lookback": 2780,
    //     "5 days lookback": 3908,
    //     "1 day lookback": 2000
    //   },
    //   {
    //     name: "Page E",
    //     "20 days lookback": -1890,
    //     "5 days lookback": 4800,
    //     "1 day lookback": 2181
    //   },
    //   {
    //     name: "Page F",
    //     "20 days lookback": 2390,
    //     "5 days lookback": -3800,
    //     "1 day lookback": 2500
    //   },
    //   {
    //     name: "Page G",
    //     "20 days lookback": 3490,
    //     "5 days lookback": 4300,
    //     "1 day lookback": 2100
    //   }
    // ];
    const { rankingData, chip } = this.props;

    // console.log(JSON.stringify(rankingData));
    // const antiRankings = [];
    const rankingChartData = rankingData

      // Pick the result for the given account value
      .find(
        ({ account }) => account.accountValue === chip.accountValue.toString()
      )

      // Parse rankign results as required in the ReChart signed-stack-chart package
      .accountResult.map(({ position, result }) => {
        return {
          name: position,
          "20 Days lookback":
            result.find(r => r.lookback === "20").changePercent * 100,
          "5 Days lookback":
            result.find(r => r.lookback === "5").changePercent * 100,
          "1 Day lookback":
            result.find(r => r.lookback === "1").changePercent * 100
        };
      })

      // sort results by 20 days lookback by default
      .sort((r1, r2) => {
        return r2[lookback] - r1[lookback];
      })

      //put rank beside the system/slot name
      .map((rankingObj, index) => {
        return {
          ...rankingObj,
          name: `${rankingObj.name}  (${index + 1})`
        };
      });

    return rankingChartData;
  }

  getColor({ x, y, payload }) {
    // tickObj.payload.value will be the string value "1" or "2" or "prev1" etc but with ranks
    const value = payload.value.split(" ")[0];

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
      <text
        x={x}
        y={y - 13}
        dy={16}
        // fontFamily="Roboto"
        fontSize="16px"
        textAnchor="end"
        fill={color || "#8884d8"}
      >
        {payload.value}
      </text>
    );
  }

  changeLookbackHandler = ({ value }) => {
    this.setState({ rankingChartData: this.syncRankingChart(value) });
  };

  render() {
    const { rankingChartData } = this.state;
    return (
      <div className={classes.RankingChart}>
        <BarChart
          width={650}
          height={2000}
          data={rankingChartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          stackOffset="sign"
        >
          <XAxis type="number" tickFormatter={value => `${value}%`} />
          <YAxis
            type="category"
            dataKey="name"
            tick={props => this.getColor(props)}
            width={100}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={value => `${value.toFixed(2)}%`} />
          <Legend
            verticalAlign="top"
            wrapperStyle={{ lineHeight: "40px" }}
            onClick={this.changeLookbackHandler}
          />
          <ReferenceLine x={0} stroke="#000" />
          {/* <Brush dataKey="name" height={30} stroke="#8884d8" /> */}
          <Bar dataKey="1 Day lookback" stackId="stack" fill="#f00155" />
          <Bar dataKey="5 Days lookback" stackId="stack" fill="#ffde00" />
          <Bar dataKey="20 Days lookback" stackId="stack" fill="#02abca" />
        </BarChart>
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
