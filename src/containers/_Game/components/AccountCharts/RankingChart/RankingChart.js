import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate, numberWithCommas } from "../../../../../util";
import classes from "./RankingChart.css";
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
  Area,
  BarChart,
  ReferenceLine,
  Bar,
} from "recharts";

import { connect } from "react-redux";

const stateToProps = state => ({
  performance_account_id: state.betting.performance_account_id,
  themes:state.betting.themes,
  liveDateText:state.betting.liveDateText,
  email: state.auth.email,
  dictionary_strategy:state.betting.dictionary_strategy,
  strat:state.betting.strat
});


const dispatchToProps = dispatch => {
  return {
    showPerformance:(action_id) => {
      dispatch(actions.showPerformance(action_id))
    },
    setStrat(strat) {
      dispatch(actions.setStrat(strat));
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
    const { payload, active, dictionary_strategy, chart_specs, lookback, themes } = this.props;
    var self=this;
    if (active) {
      //console.log(payload[0].payload);
      var {
        start,
        end,
        cum_per,
        chip_location,
      } = payload[0].payload;
      // example payload for testing purpose:
      // const date = "20181212",
      // pnlData = { date: "20171221", pnl: "5000", changePercent: "0", cumulative: "0" },
      // antiPnlData = { date: "20171221", pnl: "5000", changePercent: "0", cumulative: "0" },
      // benchmarkData = { date: "20171221", pnl: "5000", changePercent: "0", cumulative: "0" },
      // position = 7;


      return (
        <div className={classes.ToolTip} >
          <div className={classes.Row}>
          <p>
              <span>
                <b>{chip_location}</b>
              </span> 
              <span style={{color:self.props.themes.live.dialog.text}}>
                <b>{end}</b>  
              </span>
            </p>
            </div>
          
          <hr style={{ width: "100%", margin:"0px", padding:"0px", border:"1px sold black" }} />
          {chart_specs.map(lookback => {
            var start=payload[0].payload['start_' + lookback]
            var cumper=payload[0].payload['cum_pers_' + lookback]
            var rank=payload[0].payload['rank_' + lookback]
            var color=payload[0].payload['color_' + lookback]
            var items=[];
            var idx=0;
            items.push(
                <div key={lookback + '_' +  idx} className={classes.Row} style={{ color:  color }}>
                <p>
                  <span><b>{lookback} Day Rank</b></span> 
                  <span style={{color:self.props.themes.live.dialog.text}}> {rank.toString()}</span>
                </p>
                </div>
                );
            idx+=1;
            items.push(
                <div key={lookback + '_' + idx} className={classes.Row} style={{ color: color }}>
                  <p>
                    <span><b>{lookback} Day Cumulative %: </b></span>
                    <span >
                    {parseFloat(cumper) ? (
                            <span style={parseFloat(cumper) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                          <b>
                          {parseFloat(cumper).toLocaleString('en-US', { maximumFractionDigits: 12 })} %
                          </b>
                          </span>
                          ) : (
                            <span style={{color:self.props.themes.live.dialog.text}}>
                          <b>
                          {parseFloat(cumper).toLocaleString('en-US', { maximumFractionDigits: 12 })} % 
                          </b>
                          </span>
                          )}
                    
                    </span>
                  </p>
                </div>
            );
            idx+=1;
            items.push(
                <div key={lookback + '_' + idx} className={classes.Row} style={{ color:  color }}>
                <p>
                  <span><b>{lookback} Start</b></span> <span style={{color:self.props.themes.live.dialog.text}}>{start}</span>
                </p>
                </div>
            );
            return items;

          })}

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
    dictionary_strategy:PropTypes.object,
    chart_specs:PropTypes.array,
    lookback:PropTypes.string,
  };
}

@connect(stateToProps, dispatchToProps)

export default class RankingChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lookback: '',
      filter: 'board',
      performance:{},
      performanceLoading:true,
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

  filterHandler = lookback => {
    this.setState({ filter:lookback });
  };

  lookbackHandler = lookback => {
    this.setState({ lookback:lookback });
  };

  xTick({ payload, x, y }) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" transform="rotate(-45)" style={{cursor:'pointer'}} onClick={() => {
          console.log("Clicked on " + payload);

          console.log(payload)

        } }>
        
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
      //console.log('area props')
      //console.log(this.area.props);
      let point = this.area.props.data[chart.activeTooltipIndex];

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
        //console.log(this.tooltip)
        //console.log('x'+x, 'y'+y)
      }
     } else {
      this.toolTipX=this.tooltip.props.viewBox.width -200;
      this.toolTipY=22
      if (!this.priorT || this.priorT != 'left')  {
        this.priorT='left';
        this.forceUpdate();
        //console.log(this.tooltip)
        //console.log('x'+x, 'y'+y)
      }
     }
    }
  }

  componentDidMount() {
    var self=this;
    var url="/utility/ranking_chart_live/";
    if (this.props.isPractice) {
      url="/utility/ranking_chart_practice/";
    }
    if (this.props.isEdit) {
      url="/utility/ranking_chart_newboard/";

    }

    axios
    .post(url, {
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
        //var specs=Object.keys(performance.chart_specs);
        var idx=0;
        var chart_dict={};
        var chart_specs=[];
        console.log(performance);
        Object.keys(performance.chart_dict).map(period => {
          var dataJson= performance.chart_dict[period] 
          dataJson.all=JSON.parse(dataJson.all);
          if (this.props.isEdit) {
            dataJson['anti-board']=JSON.parse(dataJson['anti']);
            dataJson.board=JSON.parse(dataJson['non-anti']);
            dataJson['anti']=JSON.parse(dataJson['anti']);
            dataJson['non-anti']=JSON.parse(dataJson['non-anti']);
          } else {
            dataJson['anti-board']=JSON.parse(dataJson['anti-board']);
            dataJson.board=JSON.parse(dataJson.board);
          }
          chart_dict[period]=dataJson;
          chart_specs.push(period);

          idx+=1;
  
        });
        performance.chart_dict=chart_dict;
        performance.chart_specs=chart_specs;
        
        
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

  getStrat = (strat, key) => {
    var self=this;
    console.log(strat);
    var order=strat;
    order=order.replace(/\ \(.*\)/,'');
    if (order.match(/^[\d]+$/)) {
      order=parseInt(order);
    } else {
      order=key.replace(/A-|Anti/i,'');
    }
    if (!self.props.isEdit) {
        //alert(self.props.chip.chip_location)
        //alert(key)
        if (key.match(/A-|Anti-/i)) {
          self.props.moveChipToSlot(self.props.chip, order, true);
        } else {
          self.props.moveChipToSlot(self.props.chip, order, false);
        }
        //self.props.moveChipToSlot(self.props.chip, key, false);
    } else {
          var s=Object.assign({}, this.props.stratParams.strat);
          //alert(order);
          //alert(key);
          s.id=key;
          s.strategy=key;
          s.display=key
          //console.log(self.props.stratParams);
          //console.log(s)
          this.props.moveStratToSlot(s, self.props.stratParams.position, false, self.props.stratParams.swapStrat, true, self.props.stratParams.slot);
          //, slot=null)
    }
  }

  getColor(props, chartData) {
    var self=this;
    //console.log(props);
    var { x, y, payload } = props;
    // tickObj.payload.value will be the string value "1" or "2" or "prev1" etc but with ranks
    const value = payload.index; //value.split("(")[0].trim();
    //console.log(chartData);
    //console.log('color value')
    //console.log(payload);

    let color = chartData[parseInt(value)].x_axis_colors;
    let chip_location = chartData[parseInt(value)].chip_location;
    let key = chartData[parseInt(value)].key;
    var dictionary_strategy=this.props.dictionary_strategy;
    //console.log(color)
    /*
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
      //color = "blue";
    }
    if (toSystem(position.toString()) === value) {
      //color = "red";
    }
    */
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
          style={{cursor:'pointer'}} 
          
          onClick={() => {
            console.log("Clicked on " + chip_location + ", " + key);
            
            self.getStrat(chip_location, key)

            /*
            var order=chip_location;
            order=order.replace(/\ \(.*\)/,'');
            if (order.match(/^[\d]+$/)) {
              order=parseInt(order);
            }
            if (!self.props.isEdit) {
                if (chip_location != key)
                  self.props.moveChipToSlot(self.props.chip, order, true);
                else
                  self.props.moveChipToSlot(self.props.chip, order, false);
            }            
            */
            //console.log(order)
  
          } }
        >
          {payload.value}
        </text>
      </g>
    );
  }

  changeLookbackHandler = ({ value }) => {
    
    var match=value;
    if (match.match(" Day Cumulative %")) {
      match=match.replace(" Day Cumulative %","");
      if (match) {
        //console.log("setting lookback " + match);
        this.setState({lookback:match});
      }
    }
    if (value == 'All') {
      this.setState({filter:'all'});
    } else if (value == 'Board') {
      this.setState({filter:'board'});

    } else if (value == 'Anti-Board') {
      this.setState({filter:'anti-board'});
    }
    /*
    this.setState({
      rankingChartData: this.syncRankingChart(value),
      lookback: value
    });
    */
  };
  
  render() {
    var { performance, lookback, performanceLoading, performanceError, filter } = this.state;

    var self=this;
    var chartData={};
    var yticks=[];
    var xticks=[]; 

    if (!performanceLoading && !performanceError && performance.chart_specs) {
      if (!lookback) {
        performance.chart_specs.map(date => {
            lookback=date;

        });
      }
      chartData=performance.chart_dict[lookback];
      chartData=Object.keys(chartData[filter]).map(key => {
        var item=chartData[filter][key];
        item.key=key;

        performance.chart_specs.map(period => {
         
            item['cum_pers_' + period]=performance.chart_dict[period][filter][key].cum_per;
            item['rank_' + period]=performance.chart_dict[period][filter][key].rank;
            item['start_' + period]=performance.chart_dict[period].start_date;
            item['end_' + period]=performance.chart_dict[period].end_date;
            item['color_' + period]=performance.chart_dict[period].color;
            
          if (period == lookback) {
            item['start']=performance.chart_dict[period].start_date;
            item['end']=performance.chart_dict[period].end_date;
            item['color']=performance.chart_dict[period].color;
            
          }
        });
        
        return item;

      });

      chartData = chartData
      .sort((r1, r2) => r1.rank - r2.rank)

      //put rank beside the system/slot name
      .map((item, index) => {
        return {
          ...item,
          name: `${item.key} (${index + 1})`
        };
      });

      performance.chart_specs.map(period => {
          chartData['color_' + period]=performance.chart_dict[period].color;
      });
      console.log('chart data');
      console.log(lookback);
      console.log(chartData);
      //yticks=performance.chart_specs[lookback].yticks;
      //xticks=performance.chart_specs[lookback].xticks;
      console.log('yticks');
      console.log(yticks);
       
      var filters=[];
      if (this.props.isEdit) {
        filters.push({'value':'all','name':'All'});
        filters.push({'value':'board','name':'Non-Anti'});
        filters.push({'value':'anti-board','name':'Anti'});
  
      } else {
        filters.push({'value':'all','name':'All'});
        filters.push({'value':'board','name':'Board'});
        filters.push({'value':'anti-board','name':'Anti-Board'});
  
      }
    }
    return (
        <div className={classes.RankingChart}>
        
          {performanceLoading ? (
                <div>
                    <Spinner />
                </div>
        ) : performanceError ? (
          <div style={{height: window.innerHeight - 172,  background: self.props.themes.live.dialog.tab_color_active} }>

          <center >  
          <br/> 
          <h4>
            {performanceError ? performanceError + "" :
              "Data not Available"}
          </h4>
          </center>
          
          </div>

        ) : (

      <div className={classes.RankingChart} style={{margin:"0px", background:self.props.themes.live.dialog.tab_color_active}}>
        <br/>
         <div className={classes.Tabs} style={{  margin:"0px", background:self.props.themes.live.dialog.tab_color_active}}>
            {performance.chart_specs.map(item => {
                //console.log(item);
                return (
          <div key={item} className={classes.Tab}  style={{marginTop: "0px", minWidth: "200px", background:self.props.themes.live.dialog.tab_color_active}} onClick={() => this.lookbackHandler(item)}>

            
            <div className={classes.box} style={{float:'left', marginTop:"2px", background:chartData['color_' + item]}}>&nbsp;</div>
            <div style={{float:'left'}}>&nbsp;&nbsp;
            </div>
            <p className={lookback === item ? classes.active : "" }  style={lookback == item ? {float:'left', color:self.props.themes.live.dialog.button_color_active} 
            : {float:'left', color:self.props.themes.live.dialog.button_color}} >{item} Day Cumulative %</p>
            <div style={{"clear": "both"}}></div>

          </div>
            )
            })}
        </div>
        <br/>
        <br/>
        <div className={classes.Tabs} style={{  margin:"0px", background:self.props.themes.live.dialog.tab_color_active}}>
            {filters.map(item => {
                //console.log(item);
                return (
          <div key={item.value} className={classes.Tab}  style={{marginTop: "0px", minWidth: "200px", background:self.props.themes.live.dialog.tab_color_active}} onClick={() => this.filterHandler(item.value)}>
            <center  className={classes.Tab} >
            <p className={filter === item.value ? classes.active : ""}  style={filter == item.value ? {color:self.props.themes.live.dialog.button_color_active} : {color:self.props.themes.live.dialog.button_color}}>{item.name}</p>
            </center>
          </div>
            )
            })}
        </div>
       
        <div className={classes.ChartContainer}>
        <ResponsiveContainer
          width="100%"
          height={window.innerHeight - 230}
          maxHeight="100%"
        >
          <BarChart
             onMouseMove={self.onChartMouseMove}
             onMouseLeave={self.onChartMouseLeave}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
            stackOffset="sign"
          >
            <YAxis type="number" tickFormatter={value => `${value}%`} />
            <XAxis
              type="category"
              dataKey="name"
              tick={props => this.getColor(props, chartData)}
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
            <Tooltip  
              position={{ 'x' :self.toolTipX, 'y' :self.toolTipY}} 
              
              content={<CustomTooltip  ref={ref => this.tooltip = ref} lookback={lookback} chart_specs={performance.chart_specs} slot_position={self.props.slot.position.toString()} chip={self.props.chip} 
              dictionary_strategy={self.props.dictionary_strategy} themes={self.props.themes} />} />  
              
              {/*
             <Legend
              verticalAlign="top"
              wrapperStyle={{ lineHeight: "40px" }}
              onClick={this.changeLookbackHandler}
              payload={
                 
                  performance.chart_specs.map(period => {
                    return {
                    value: period + " Day Cumulative %",
                    type: "square",
                    id: period + " Day  Cumulative %",
                    color:performance.chart_dict[period].color
                  
                    }
                  })

            }
            />
          */}
             <Bar
                ref={ref => this.area = ref}

                key={lookback}
                dataKey={'cum_per'}
                stackId="stack"
                fill={performance.chart_dict[lookback].color}
                onClick={(e) => {
                  console.log('Clicked on ' + e.chip_location + ' , ' + e.key);
                  self.getStrat(e.chip_location, e.key)
                }}
              />

            {performance.chart_specs.map(period => {   
              if (period != lookback) {
                return <Bar
                  ref={ref => this.area = ref}

                  key={period}
                  dataKey={'cum_pers_' + period}
                  stackId="stack"
                  fill={performance.chart_dict[period].color}
                  onClick={(e) => {
                    console.log('Clicked on ' + e.chip_location + ' , ' + e.key);
                    self.getStrat(e.chip_location,  e.key)
                  }}
                />
              }

            })}
            <ReferenceLine x={0} stroke="#000" />
           
          </BarChart>
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
    dictionary_strategy:PropTypes.object.isRequired,
    moveChipToSlot:PropTypes.func,
    moveStratToSlot:PropTypes.func,
    stratParams:PropTypes.object,
    isPractice:PropTypes.bool,
    isAnti:PropTypes.bool,
    isEdit:PropTypes.bool,
    setStrat:PropTypes.func,
    strat:PropTypes.string
  };
}
