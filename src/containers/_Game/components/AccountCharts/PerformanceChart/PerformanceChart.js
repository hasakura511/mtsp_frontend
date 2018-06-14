import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate, numberWithCommas } from "../../../../../util";
import classes from "./PerformanceChart.css";
import Spinner from "../../../../../components/UI/Spinner/Spinner";
import axios from "../../../../../axios-gsm";
import * as actions from "../../../../../store/actions";

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
  performance_account_id: state.betting.performance_account_id,
  themes:state.betting.themes
});


const dispatchToProps = dispatch => {
  return {
    showPerformance:(action_id) => {
      dispatch(actions.showPerformance(action_id))
    },
    
  };
};


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


class CustomTooltip extends Component {
  render() {
    const { payload, active } = this.props;
    var self=this;
    if (active) {
      let {
        display_date,
        date,
        account_value,
        account_pnl_pct,
        account_pnl_cumpct,
        commissions,
        slippage,
        //antiPnlData,
        benchmark_pctchg,
        benchmark_cumpct,
        benchmark_value,
        benchmark_sym,
        //position
      } = payload[0].payload;
      // example payload for testing purpose:
      // const date = "20181212",
      // pnlData = { date: "20171221", pnl: "5000", changePercent: "0", cumulative: "0" },
      // antiPnlData = { date: "20171221", pnl: "5000", changePercent: "0", cumulative: "0" },
      // benchmarkData = { date: "20171221", pnl: "5000", changePercent: "0", cumulative: "0" },
      // position = 7;


      return (
        <div className={classes.ToolTip} >
          <div className={classes.Row}>{display_date}</div>
          <hr style={{ width: "100%" }} />
          <div className={classes.Row} style={{ color: this.props.colors.account_value }}>
            <p>
              <span><b>Account Value:</b></span> <span>$ {numberWithCommas(account_value.toString())}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: this.props.colors.account_value }}>
            <p>
              <span><b>Account Daily %Chg: </b></span>
              <span>
              {parseFloat(account_pnl_pct) ? (
                      <span style={parseFloat(account_pnl_pct) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                    <b>
                    {parseFloat(account_pnl_pct).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.live.dialog.text_color}}>
                    <b>
                    {parseFloat(account_pnl_pct).toLocaleString('en-US', { maximumFractionDigits: 12 })} % 
                    </b>
                    </span>
                    )}
              
              </span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: this.props.colors.account_value }}>
            <p>
              <span><b>Account Cum. %Chg: </b></span>
              <span>
              {parseFloat(account_pnl_cumpct) ? (
                      <span style={parseFloat(account_pnl_cumpct) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                    <b>
                    {parseFloat(account_pnl_cumpct).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.live.dialog.text_color}}>
                    <b>
                    {parseFloat(account_pnl_cumpct).toLocaleString('en-US', { maximumFractionDigits: 12 })} % 
                    </b>
                    </span>
                    )}
              
              </span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: this.props.colors.account_value }}>
            <p>
              <span><b>Commissions: </b></span>
              <span>$ {numberWithCommas(commissions.toString())}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: this.props.colors.account_value }}>
            <p>
              <span><b>Slippage: </b></span>
              <span>$ {numberWithCommas(slippage).toString()}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: this.props.colors.account_value }}>
            <p>
              <span><b>Bet: </b></span>
              <span>{this.props.chip.last_selection}</span>
            </p>
          </div>

          <div className={classes.Row} style={{ color: this.props.colors.benchmark_value }}>
            <p>
              <span><b>Benchmark Value: </b></span>
              <span>$ {numberWithCommas(benchmark_value.toString())}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: this.props.colors.benchmark_value }}>
            <p>
              <span><b>Benchmark Daily %Chg: </b></span>
              <span>
              {parseFloat(benchmark_pctchg) ? (
                      <span style={parseFloat(benchmark_pctchg) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                    <b>
                    {parseFloat(benchmark_pctchg).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.live.dialog.text_color}}>
                    <b>
                    {parseFloat(benchmark_pctchg).toLocaleString('en-US', { maximumFractionDigits: 12 })} % 
                    </b>
                    </span>
                    )}
                </span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: this.props.colors.benchmark_value }}>
            <p>
              <span><b>Benchmark Cum. %Chg: </b></span>
              <span>
              {parseFloat(benchmark_cumpct) ? (
                      <span style={parseFloat(benchmark_cumpct) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                    <b>
                    {parseFloat(benchmark_cumpct).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.live.dialog.text_color}}>
                    <b>
                    {parseFloat(benchmark_cumpct).toLocaleString('en-US', { maximumFractionDigits: 12 })} % 
                    </b>
                    </span>
                    )}
              
              </span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: this.props.colors.benchmark_value }}>
            <p>
              <span><b>Benchmark Symbol: </b></span>
              <span>{benchmark_sym}</span>
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
    payload: PropTypes.arrayOf(PropTypes.object),
    colors:PropTypes.object,
    chip:PropTypes.object,
    themes:PropTypes.object,
  };
}

@connect(stateToProps, dispatchToProps)

export default class PerformanceChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lookback: '',
      performance:{},
      performanceLoading:true,
      performanceError:'',
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

  componentDidMount() {
      var self=this;
    axios
    .post("/utility/account_performance_live/", {
      /**
       * @example {"portfolio": ["TU", "BO"], "systems": ["prev1", "prev5"], "target": 500, "account": 5000}
       *
       */
      account_id: self.props.chip.account_id
    })
    .then(response => {
      /**
       * @namespace {Performance}
       */
      var performance = response.data;
      console.log(performance);
      var specs=Object.keys(performance.chart_specs);
      var idx=0;
      var chart_data={};
      Object.keys(performance.chart_data).map(period => {
        var dataJson= JSON.parse(performance.chart_data[period]) 
        var data=[];
        Object.keys(dataJson).map(date => {

          var item=dataJson[date];
          item.date=date;
          data.push(item);

        });
        chart_data[specs[idx]]=data;
        idx+=1;

      });
      performance.chart_data=chart_data;
      
      console.log(chart_data);

      self.setState({
          performanceLoading: false,
          performance
        });
    })
    .catch(performanceError => {
      console.log(performanceError);
      self.setState({
        performanceLoading: true,
        performanceError: performanceError
      });
    });

  }

  
  render() {
    var { performance, lookback, performanceLoading, performanceError } = this.state;

    var self=this;
    var chartData={};
    var yticks=[];
    var xticks=[];

    if (!performanceLoading) {
      if (!lookback) {
        Object.keys(performance.chart_specs).map(date => {
            lookback=date;
        });
      }

        console.log('chart data');
        chartData=performance.chart_data[lookback];
        console.log(lookback);
        console.log(chartData);
        yticks=performance.chart_specs[lookback].yticks;
        xticks=performance.chart_specs[lookback].xticks;
        console.log('yticks');
        console.log(yticks);
    }
    return (
        <div className={classes.PerformanceChart}>
        
          {performanceLoading ? (
                <div>
                    <Spinner />
                </div>
        ) : performanceError ? (
            <div>
                
          <h1>
            {performanceError.Message ||
              "Could not load performance data, contact us to report this bug."}
          </h1>
          
          </div>
        ) : (

        <div className={classes.PerformanceChart}>
            <div className={classes.Tabs}>
            {Object.keys(performance.chart_specs).map(date => {
                console.log(date);
                return (
          <div key={date} className={classes.Tab} onClick={() => this.lookbackHandler(date)}>
            <p className={lookback === date ? classes.active : ""}>{date}</p>
          </div>
            )
            })}
        </div>
        <div className={classes.ChartContainer}>
          <ResponsiveContainer
            width="100%"
            height={innerHeight - 190}
            maxHeight="100%"
          >
            <LineChart
              data={chartData}
              
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="date"
                interval={0}
                tick={props => this.xTick(props)}
                ticks={xticks}
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
                  `${Math.floor(value).toLocaleString('en-US', { maximumFractionDigits: 12 })}`
                }
                ticks={yticks}
                domain={[dataMin => dataMin * 0.9, dataMax => dataMax * 1.1]}
              />
              <CartesianGrid strokeDasharray="3 1" />
              {<Tooltip 
              content={<CustomTooltip colors={performance.colors} chip={self.props.chip} themes={self.props.themes} />} />}
              <Legend />
              <Line
                type="monotone"
                dataKey={"benchmark_value" }
                stroke={performance.colors.benchmark_value}
                activeDot={{ r: 8 }}
               />
                <Line
                type="monotone"
                dataKey={"account_value" }
                stroke={performance.colors.account_value}
                activeDot={{ r: 8 }}
               />
            
            </LineChart>
          </ResponsiveContainer>
        </div>
        </div>
        )}
        </div>
    );
  }

  static propTypes = {
   
    //performance: PropTypes.object,
    //position: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    performance_account_id: PropTypes.string.isRequired,
    showPerformance:PropTypes.func.isRequired,
    themes:PropTypes.object.isRequired,
    chip:PropTypes.object,
  };
}
