import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate, numberWithCommas } from "../../../../../util";
import classes from "./PerformanceOrderChart.css";
import Spinner from "../../../../../components/UI/Spinner/Spinner";
import axios from "../../../../../axios-gsm";
import * as actions from "../../../../../store/actions";
import { toSystem, toAntiSystem } from "../../../Config";

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
  Area
} from "recharts";

import { connect } from "react-redux";

const stateToProps = state => ({
  performance_account_id: state.betting.performance_account_id,
  themes:state.betting.themes,
  liveDateText:state.betting.liveDateText,
  email: state.auth.email,
  dictionary_strategy:state.betting.dictionary_strategy

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
      const { payload, active, colors, slot_position, dictionary_strategy, performance } = this.props;
      var self=this;
      if (active) {
        let {
          display_date,
          strategy_value,
          strategy_per,
          strategy_cumper,
          anti_value,
          anti_per,
          anti_cumper,
          benchmark_value,
          benchmark_per,
          benchmark_cumper,
          
          
        } = payload[0].payload;
        var strategy_color=colors.strategy;
        var anti_strategy_color=colors.anti_strategy;
        var benchmark_color=colors.benchmark;
        var position=slot_position;
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
            <div className={classes.Row} style={{ color: strategy_color }}>
              <p>
                <span><b>{toSystem(position)}:</b></span> 
                <span style={{color:self.props.themes.live.dialog.text}}>$ {numberWithCommas(strategy_value.toString())}</span>
              </p>
            </div>
            <div className={classes.Row} style={{ color:  strategy_color }}>
              <p>
                <span><b>{toSystem(position)} Daily %Chg: </b></span>
                <span >
                {parseFloat(strategy_per) ? (
                        <span style={parseFloat(strategy_per) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                      <b>
                      {parseFloat(strategy_per).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                      </b>
                      </span>
                      ) : (
                        <span style={{color:self.props.themes.live.dialog.text}}>
                      <b>
                      {parseFloat(strategy_per).toLocaleString('en-US', { maximumFractionDigits: 12 })} % 
                      </b>
                      </span>
                      )}
                
                </span>
              </p>
            </div>
            <div className={classes.Row} style={{ color:  strategy_color }}>
              <p>
                <span><b>{toSystem(position)} Cumulative %Chg: </b></span>
                <span >
                {parseFloat(strategy_cumper) ? (
                        <span style={parseFloat(strategy_cumper) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                      <b>
                      {parseFloat(strategy_cumper).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                      </b>
                      </span>
                      ) : (
                        <span style={{color:self.props.themes.live.dialog.text}}>
                      <b>
                      {parseFloat(strategy_cumper).toLocaleString('en-US', { maximumFractionDigits: 12 })} % 
                      </b>
                      </span>
                      )}
                
                </span>
              </p>
            </div>


            <div className={classes.Row} style={{ color: anti_strategy_color }}>
              <p>
                <span><b>{toAntiSystem(position, self.props.dictionary_strategy)}:</b></span> 
                <span style={{color:self.props.themes.live.dialog.text}}>$ {numberWithCommas(anti_value.toString())}</span>
              </p>
            </div>
            <div className={classes.Row} style={{ color:  anti_strategy_color }}>
              <p>
                <span><b>{toAntiSystem(position, self.props.dictionary_strategy)} Daily %Chg: </b></span>
                <span >
                {parseFloat(anti_per) ? (
                        <span style={parseFloat(anti_per) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                      <b>
                      {parseFloat(anti_per).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                      </b>
                      </span>
                      ) : (
                        <span style={{color:self.props.themes.live.dialog.text}}>
                      <b>
                      {parseFloat(anti_per).toLocaleString('en-US', { maximumFractionDigits: 12 })} % 
                      </b>
                      </span>
                      )}
                
                </span>
              </p>
            </div>
            <div className={classes.Row} style={{ color:  anti_strategy_color }}>
              <p>
                <span><b>{toAntiSystem(position, self.props.dictionary_strategy)} Cumulative %Chg: </b></span>
                <span >
                {parseFloat(anti_cumper) ? (
                        <span style={parseFloat(anti_cumper) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                      <b>
                      {parseFloat(anti_cumper).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                      </b>
                      </span>
                      ) : (
                        <span style={{color:self.props.themes.live.dialog.text}}>
                      <b>
                      {parseFloat(anti_cumper).toLocaleString('en-US', { maximumFractionDigits: 12 })} % 
                      </b>
                      </span>
                      )}
                
                </span>
              </p>
            </div>
            
            
            <div className={classes.Row} style={{ color: benchmark_color }}>
              <p>
                <span><b>{performance.benchmark_display} :</b></span> 
                <span style={{color:self.props.themes.live.dialog.text}}>$ {numberWithCommas(benchmark_value.toString())}</span>
              </p>
            </div>
            <div className={classes.Row} style={{ color:  benchmark_color }}>
              <p>
                <span><b>{performance.benchmark_display} Daily %Chg: </b></span>
                <span >
                {parseFloat(benchmark_per) ? (
                        <span style={parseFloat(benchmark_per) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                      <b>
                      {parseFloat(benchmark_per).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                      </b>
                      </span>
                      ) : (
                        <span style={{color:self.props.themes.live.dialog.text}}>
                      <b>
                      {parseFloat(benchmark_per).toLocaleString('en-US', { maximumFractionDigits: 12 })} % 
                      </b>
                      </span>
                      )}
                
                </span>
              </p>
            </div>
            <div className={classes.Row} style={{ color:  benchmark_color }}>
              <p>
                <span><b>{performance.benchmark_display} Cumulative %Chg: </b></span>
                <span >
                {parseFloat(benchmark_cumper) ? (
                        <span style={parseFloat(benchmark_cumper) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                      <b>
                      {parseFloat(benchmark_cumper).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                      </b>
                      </span>
                      ) : (
                        <span style={{color:self.props.themes.live.dialog.text}}>
                      <b>
                      {parseFloat(benchmark_cumper).toLocaleString('en-US', { maximumFractionDigits: 12 })} % 
                      </b>
                      </span>
                      )}
                
                </span>
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
      dictionary_strategy:PropTypes.object,
      slot_position:PropTypes.string,
      performance:PropTypes.object
    };
  }
  

@connect(stateToProps, dispatchToProps)

export default class PerformanceOrderChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lookback: '',
      performance:{},
      performanceLoading:true,
      performanceError:'',
      isAnti:false
      // endDate:   20180201
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
      var self=this;
    axios
    .post("/utility/performance_chart_live/", {
      chip_id:self.props.chip.chip_id,
      strategy: self.props.slot.position.toString(),
      username: self.props.email,
      last_date:self.props.liveDateText,
      board_config: JSON.stringify(self.props.chip.board_config_fe),
    })
    .then(response => {
      /**
       * @namespace {Performance}
       */
      var performance = response.data;
      console.log(performance);
      if (performance.data_not_available) {
        var performanceError=performance.data_not_available_message;
        if (!performanceError)
          performanceError="Data Not Available";
        this.setState({
          performanceLoading: false,
          performanceError: performanceError
        });
      } else {
        var specs=Object.keys(performance.chart_specs);
        var idx=0;
        var chart_dict={};
        Object.keys(performance.chart_dict).map(period => {
          var dataJson= JSON.parse(performance.chart_dict[period]) 
          var data=[];
          Object.keys(dataJson).map(date => {
  
            var item=dataJson[date];
            item.date=date;
            data.push(item);
  
          });
          chart_dict[specs[idx]]=data;
          idx+=1;
  
        });
        performance.chart_dict=chart_dict;
        $('#system-label').css('color',performance.colors.strategy)
        $('#anti-system-label').css('color',performance.colors.anti_strategy)
        $('#system-radio').on('click', function(e) {
          self.setState({isAnti:false});
        });      
        $('#anti-system-radio').on('click', function(e) {
          self.setState({isAnti:true});
        });      
        console.log(performance);
  
        self.setState({
            performanceLoading: false,
            performance
          });
      }

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

    if (!performanceLoading && !performanceError && performance.chart_specs) {
      if (!lookback) {
        Object.keys(performance.chart_specs).map(date => {
            lookback=date;
        });
      }

        console.log('chart data');
        chartData=performance.chart_dict[lookback];
        console.log(lookback);
        console.log(chartData);
        yticks=performance.chart_specs[lookback].yticks;
        xticks=performance.chart_specs[lookback].xticks;
        console.log('yticks');
        console.log(yticks);
    }
    console.log('slot position')
    console.log(self.props.slot.position)
    return (
        <div className={classes.PerformanceOrderChart}>
        
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

      <div className={classes.PerformanceOrderChart} style={{margin:"0px", background:self.props.themes.live.dialog.tab_color_active}}>
        <div className={classes.Tabs} style={{  margin:"0px", background:self.props.themes.live.dialog.tab_color_active}}>
            {Object.keys(performance.chart_specs).map(date => {
                console.log(date);
                return (
          <div key={date} className={classes.Tab}  style={{marginTop: "0px", background:self.props.themes.live.dialog.tab_color_active}} onClick={() => this.lookbackHandler(date)}>
            <p className={lookback === date ? classes.active : "" }  style={lookback == date ? {color:self.props.themes.live.dialog.button_color_active} : {color:self.props.themes.live.dialog.button_color}}>{date}</p>
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
              onMouseMove={self.onChartMouseMove}
              onMouseLeave={self.onChartMouseLeave}
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
                tick={props => this.yTick(props)}
                type={'number'}
                tickFormatter={(value) =>
                  {'$ ' + Math.floor(value).toLocaleString('en-US', { maximumFractionDigits: 12 })}
                }
                ticks={yticks}
                domain={[yticks[yticks.length-1], yticks[0]]}
              />
              
              <CartesianGrid strokeDasharray="3 1" />
              <Tooltip  position={{ 'x' :self.toolTipX, 'y' :self.toolTipY}} 
              
              content={<CustomTooltip  ref={ref => this.tooltip = ref} slot_position={self.props.slot.position.toString()} colors={performance.colors} chip={self.props.chip} 
              dictionary_strategy={self.props.dictionary_strategy} performance={performance} themes={self.props.themes} />} />  
              <Legend />
                <Line
                ref={ref => this.area = ref}
                type="monotone"
                name={ self.props.slot.position.toString()}
                dataKey={"strategy_value" }
                stroke={performance.colors.strategy}
                activeDot={{ r: 8 }}
                strokeWidth={self.state.isAnti ? 1 : 3} 
               />
               <Legend />
                <Line
                ref={ref => this.area = ref}
                type="monotone"
                name={performance.anti_strategy}
                dataKey={"anti_value" }
                stroke={performance.colors.anti_strategy}
                activeDot={{ r: 8 }}
                strokeWidth={self.state.isAnti ? 3 : 1} 
               />
              <Line
                ref={ref => this.area = ref}
                type="monotone"
                dataKey={"benchmark_value" }
                name={performance.benchmark_display     }
                stroke={performance.colors.benchmark}
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
    liveDateText:PropTypes.string.isRequired,
    slot:PropTypes.object,
    dictionary_strategy:PropTypes.object.isRequired
  };
}
