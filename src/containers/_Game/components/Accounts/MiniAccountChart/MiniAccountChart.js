import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate, numberWithCommas } from "../../../../../util";
import classes from "./MiniAccountChart.css";
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
  Label,
  AreaChart, 
  Area
} from "recharts";

import { connect } from "react-redux";

const stateToProps = state => ({
  performance_account_id: state.betting.performance_account_id,
  themes:state.betting.themes,

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
      var {
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
        last_selection,
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
          <div className={classes.Row}><b>{display_date}</b>    </div>
          <hr style={{ width: "100%", margin:"0px", padding:"0px", border:"1px sold black" }} />
          <div className={classes.Row} style={{ color: this.props.colors.account_value }}>
            <p>
              <span><b>Account Value:</b></span> <span style={{color:self.props.themes.live.dialog.text}}>$ {numberWithCommas(account_value.toString())}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: this.props.colors.account_value }}>
            <p>
              <span><b>Account Daily %Chg: </b></span>
              <span >
              {parseFloat(account_pnl_pct) ? (
                      <span style={parseFloat(account_pnl_pct) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                    <b>
                    {parseFloat(account_pnl_pct).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                    </b>
                    </span>
                    ) : (
                      <span style={{color:self.props.themes.live.dialog.text}}>
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
                      <span style={{color:self.props.themes.live.dialog.text}}>
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
              <span style={{color:self.props.themes.live.dialog.text}}>$ {numberWithCommas(commissions.toString())}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: this.props.colors.account_value }}>
            <p>
              <span><b>Slippage: </b></span>
              <span style={{color:self.props.themes.live.dialog.text}}> $ {numberWithCommas(slippage).toString()}</span>
            </p>
          </div>
          <div className={classes.Row} style={{ color: this.props.colors.account_value }}>
            <p>
              <span><b>Bet: </b></span>
              <span style={{color:self.props.themes.live.dialog.text}}>{last_selection}</span>
            </p>
          </div>

          <div className={classes.Row} style={{ color: this.props.colors.benchmark_value }}>
            <p>
              <span><b>Benchmark Value: </b></span>
              <span style={{color:self.props.themes.live.dialog.text}}>$ {numberWithCommas(benchmark_value.toString())}</span>
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
                      <span style={{color:self.props.themes.live.dialog.text}}>
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
                      <span style={{color:self.props.themes.live.dialog.text}}>
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
              <span style={{color:self.props.themes.live.dialog.text}}>{benchmark_sym}</span>
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

export default class MiniAccountChart extends Component {

static propTypes = {

    //performance: PropTypes.object,
    //position: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    performance_account_id: PropTypes.string.isRequired,
    showPerformance:PropTypes.func.isRequired,
    themes:PropTypes.object.isRequired,
    chip:PropTypes.object,
    chartData: PropTypes.object.isRequired,
    accountsData: PropTypes.object.isRequired,
    chart_id: PropTypes.string.isRequired
};
    
  constructor(props) {
    super(props);

    this.state = {
      lookback: '',
      performance:{},
      performanceLoading:false,
      performanceError:'',
      // endDate: 20180201
    };

    this.area = null;
    this.tooltip = null;
    this.point = null;
    this.toolTipX=0
    this.toolTipY=0
    
    this.onChartMouseMove = this.onChartMouseMove.bind(this);
    this.onChartMouseLeave = this.onChartMouseLeave.bind(this);
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

  yTick({ payload, x, y }) {
    return (
      <g transform={`translate(${x},${y+5})`}>
        <text  x={0} y={0} textAnchor="end" >
          $ {Math.floor(payload.value).toLocaleString('en-US', { maximumFractionDigits: 12 })}
        </text>
      </g>
    );
  }

  onChartMouseMove(chart) {
    if (chart.isTooltipActive) {
      let point = this.area.props.points[chart.activeTooltipIndex];

      if (point != this.point) {
        this.point = point;
        this.updateTooltip();
      }
    }
  }

  onChartMouseLeave() {
    this.point = null;
    this.updateTooltip();
  }

  updateTooltip() {
    if (this.point) {
      let x = Math.round(this.point.x);
      let y = Math.round(this.point.y);

      //this.tooltip.style.opacity = '1';
      //this.tooltip.props.coordinate = { 'x': x, 'y': y } 
      //this.tooltip.childNodes[0].innerHTML = this.point.payload['value'];
    
     if (x > this.tooltip.props.viewBox.width / 2) {
      this.toolTipX=100
      this.toolTipY=22
      if (!this.priorT || this.priorT != 'right')  {
        this.priorT='right';
        this.forceUpdate();
        console.log(this.tooltip)
        console.log('x'+x, 'y'+y)
      }
     } else {
      this.toolTipX=this.tooltip.props.viewBox.width -200;
      this.toolTipY=22
      if (!this.priorT || this.priorT != 'left')  {
        this.priorT='left';
        this.forceUpdate();
        console.log(this.tooltip)
        console.log('x'+x, 'y'+y)
      }
     }
    }
  }

  componentDidMount() {
  
   
  }

  
  render() {
    var { performanceLoading, performanceError } = this.state;

    var self=this;
    var chartData=[];
    var yticks=[];
    var xticks=[]; 


    console.log('chart data');
    Object.keys(self.props.chartData[self.props.chart_id].data).map(date => {

        var value=self.props.chartData[self.props.chart_id].data[date];
        var item={};
        item['date']=date;
        item['value']=value;
        chartData.push(item);        

    });
        
    console.log(chartData);
    return (
        <div className={classes.MiniAccountChart}>
        
          {performanceLoading ? (
                <div>
                    <Spinner />
                </div>
        ) : performanceError ? (
          <div style={{height: innerHeight - 172,  background: self.props.themes.live.dialog.tab_color_active} }>

          <center >  
          <br/> 
          <h4>

            {performanceError ? performanceError + "" :
              "Data not Available"}
          </h4>
          </center>
          
          </div>

        ) : (

            <AreaChart width={100} height={60} 
              data={chartData}
              
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              //onMouseMove={self.onChartMouseMove}
              //onMouseLeave={self.onChartMouseLeave}
            >
             <Area type='monotone' dataKey='value' 
              stroke={self.props.accountsData.themes.lines_horizontal_middle}
              fill={self.props.chartData[self.props.chart_id].color} />
             
              
            
            </AreaChart>
         )}
         </div>
    );
  }

  
}
