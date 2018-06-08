import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Markets.css";
import FormatModal from "../../components/UI/FormatModal/FormatModal";
import Input from "../../components/UI/Input/Input";
import { clone } from "../../util";
import { withRouter } from "react-router-dom";
import { axiosOpen } from "../../axios-gsm";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import initialControls from "./InitialControls";
import { toUnderScore, andify, toSlashDate, toTitleCase, numberWithCommas } from "../../util";
import moment from 'moment-timezone';

const Aux = props => props.children;

const disclaimer = (
  <Aux>
    <p>
      {`We may use your inputs below if and to the extent we decide in our discretion that the use may contribute to our development of product features. The private information that you provided to us will be kept confidential according to our `}
      <a href="/privacy_policy" target="_blank">
        privacy policy
      </a>
      {`.`}
    </p>
  </Aux>
);

const toOptionsList = obj => {
  const arr = [];
  for (let key in obj) {
    arr.push({
      value: obj[key],
      displayValue: key
    });
  }
  return arr.sort((x, y) => x.value > y.value);
};



const stateToProps = state => {
  return {
    liveDate:state.betting.liveDate,
    liveDateText:state.betting.liveDateText,
    email:state.auth.email
    
  };
};

/**
 *
 * @function dispatchToProps React-redux dispatch to props mapping function
 * @param {any} dispatch
 * @returns {Object} object with keys which would later become props to the `component`.
 */

const dispatchToProps = dispatch => {
  return {
    updateDate: () => {
      dispatch(actions.updateDate());

    },
    initializeData: (data) => {
      dispatch(actions.initializeData(data));
      
    },
    authSuccess: (user, token) => {
      dispatch(actions.authSuccess(user, token));
    },
    addTimedToaster: toaster => {
        dispatch(actions.addTimedToaster(toaster, 5000))
    },
  };
};

@withErrorHandler(axiosOpen)
@withRouter
@connect(stateToProps, dispatchToProps)





export default class Markets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: initialControls,
      formIsValid: false,
      loading: true,
      fetched: false,
      error: false,
      submitTitle: "",
      symbol:"",
      date:"",
      chartData:{},
      data:{},
      specifications:{},
      themes:{},
      liveDateText:this.props.liveDateText,
      date_str:"",
      selected_period:"",
      firstPeriod:"",
    };
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    addTimedToaster: PropTypes.func.isRequired,
    liveDate:PropTypes.instanceOf(moment).isRequired,
    liveDateText:PropTypes.string.isRequired,
    email:PropTypes.string
  };

  getSubmitTitle(controls) {
    const errors = [];
    for (let key in controls) {
      if (!controls[key].valid) {
        errors.push(key);
      }
    }
    return errors.length
      ? "Please fill valid " + andify(errors)
      : "Click to send message";
  }

  componentWillMount() {
    this.setState({
      submitTitle: this.getSubmitTitle({ ...this.state.controls })
    });
  }



  componentDidMount() {
    this.setState({loading:true})
    axiosOpen
      .post("/utility/market_heatmap/", {
          'username':  this.props.email,
          'date':this.state.liveDateText,

      })
      .then(response => {
        console.log(response);
        var data=response.data;
        var liveDateText=response.data.date;
        var date_str=response.data.date_str;
        //alert(response.data.date_str)
        //alert(response.data.date)
        var groups= JSON.parse(response.data.groups)
        var markets= JSON.parse(response.data.markets)
        var themes = response.data.themes
        data.groups=groups;
        data.markets=markets;
        data.themes=themes;
        console.log(data);
        console.log(groups)
        console.log(markets)
        console.log(themes)
        /*
        const controls = { ...initialControls };
        for (let key in controls) {
          if (key.indexOf("Experience") !== -1) {
            controls[key].elementConfig.options = toOptionsList(
              response.data["experience"]
            );
            controls[key].value = controls[key].elementConfig.options[0].value;
          }
        }
        controls.riskAssets.elementConfig.options = toOptionsList(
          response.data["risk_assets"]
        );
        controls.riskAssets.value =
          controls.riskAssets.elementConfig.options[0].value;
        */
       this.setState({
          //controls: controls,
          liveDateText:liveDateText,
          date_str:date_str,
          data:data,
          themes:themes,
          loading: false,
          fetched: true
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: true, loading: false });
        this.props.addTimedToaster({
          id: "contact-us-error",
          text: "Server error, please wait till we fix."
        });
      });
  }

  inputChangeHandler = (event, identifier) => {
    const updatedValue = event.target.value,
      isValid = this.checkValidity(
        updatedValue,
        this.state.controls[identifier].validation
      );
    this.setState(prevState => {
      const controls = clone(prevState.controls);
      controls[identifier]["value"] = updatedValue;
      controls[identifier]["valid"] = isValid;
      let formIsValid = true;
      for (let key in controls) {
        formIsValid = formIsValid && controls[key].valid;
      }
      return {
        controls: controls,
        formIsValid: formIsValid,
        submitTitle: this.getSubmitTitle(controls)
      };
    });
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.trim().length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.trim().length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isValid = pattern.test(value.trim()) && isValid;
    }

    if (rules.cantBe) {
      isValid = value.toLowerCase() !== rules.cantBe.toLowerCase() && isValid;
    }

    return isValid;
  }

  onFormSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const nameArr = this.state.controls.name.value.split(" ");
    const feedback = Object.keys(this.state.controls)
      .filter(key => key !== "name")
      .reduce((acc, curr) => {
        acc[toUnderScore(curr)] = this.state.controls[curr].value;
        return acc;
      }, {});
    feedback["first_name"] = nameArr[0];
    feedback["last_name"] = nameArr[1];
    axiosOpen
      .post("/utility/feedback/", feedback)
      .then(() => {
        this.setState({ loading: false });
        this.props.history.goBack();
        this.props.addTimedToaster({
          id: "contact-us",
          text: "Message successfully sent",
          success: true
        });
      })
      .catch(err => {
        this.setState({ error: true, loading: false });
        this.props.addTimedToaster({
          id: "contact-us-error",
          text: err.message || "Server error, please wait till we fix."
        });
      });
  };

  onBlurHandler = (event, key) => {
    this.setState(prev => {
      const controls = { ...prev.controls };
      controls[key] = { ...controls[key], touched: true };
      return { controls };
    });
  };

  onGetChart = (symbol, date) => {
    this.setState({symbol:symbol,
                    date:date});

    axiosOpen
    .post("/utility/market_chart/", {

        'date':this.state.liveDateText,
        'symbol':symbol

    })
    .then(response => {
        console.log(response.data)

        var finalData={};
        var firstPeriod="";
        Object.keys(response.data.data).map(date => {
          console.log(response.data)
          if (!firstPeriod) {
            firstPeriod=date;
          }
          var chartData= JSON.parse(response.data.data[date]);
          var cd=[];

          Object.keys(chartData).map(key => {
            var tick=chartData[key];
            tick.Date=key;
            cd.push(tick);
          })
          finalData[date]=cd;
          

   
      })
     
        var spec=response.data.specifications;
        spec['status']='item';
        this.setState({chartData:finalData,
            specifications:spec,
            themes:response.data.themes,
          firstPeriod:firstPeriod,
          selected_period:firstPeriod});
        this.onGetChartDate(symbol, date, firstPeriod)
        $('#chartArea').show()
        
    })
    .catch((error) => {
      console.log(error);
      this.setState({ error: true, loading: false });
      this.props.addTimedToaster({
        id: "contact-us-error",
        text: "Server error, please wait till we fix."
      });
    });
    
  }

  onGetChartDate = (symbol, date, period) => {
        var chartData=this.state.chartData[period];
        var self=this;

        this.setState({symbol:symbol,
          date:date,
        selected_period:period});

        var color;
        var chart = AmCharts.makeChart( "chartdiv", {
          "type": "stock",
          "theme": "light",
        
          //"color": "#fff",
          "dataSets": [ {
            "title":  symbol + " " + period,
            "fieldMappings": [ {
              "fromField": "Open",
              "toField": "open"
            }, {
              "fromField": "High",
              "toField": "high"
            }, {
              "fromField": "Low",
              "toField": "low"
            }, {
              "fromField": "Close",
              "toField": "close"
            }, {
              "fromField": "Volume",
              "toField": "volume"
            },  {
              "fromField": "display_date",
              "toField": "display_date"
            },  {
              "fromField": "Seasonality",
              "toField": "Seasonality"
            },  {
              "fromField": "OpenInterest",
              "toField": "OpenInterest"
            },  {
              "fromField": "Contract",
              "toField": "Contract"
            },  {
              "fromField": "VolumeColor",
              "toField": "VolumeColor"
            } ],
            "compared": false,
            "dataProvider": chartData,
            "categoryField": "Date",
          } ],
          "dataDateFormat": "YYYY-MM-DD",
        
          "panels": [ {
              "percentHeight": 80,
              "autoMarginOffset":70,
              "autoDisplay":true,
              "marginsUpdated":true,
              "marginBottom":70,
              "stockGraphs": [  {
                  "title": "Seasonality",
                "type": "line",
                "id": "g2",
                "valueAxis":"v1",
                "valueField": "Seasonality",
                "lineColor": self.state.themes.seasonality,
                "fillColors": self.state.themes.seasonality,
                "fillAlphas": 0.03,
                "comparedGraphLineThickness": 2,
                "columnWidth": 0.7,
                "useDataSetColors": false,
                
               
                "showBalloon": true,
                "balloonText": "[[display_date]]<hr style='margin-left:-8px;margin-right:-8px;margin-top:1px;margin-bottom:1px;color:" +  self.state.themes.text_color + ";border: 3px;border-top: 1px solid " +  self.state.themes.text_color + "' />" +
                              "<span style='float:left;'>Open:</span> <span style='float:right'>[[open]]</span><br/>" +
                              "<span style='float:left;'>High:</span> <span style='float:right'>[[high]]</span><br/>" +
                              "<span style='float:left;'>Low:</span> <span style='float:right'>[[low]]</span><br/>" +
                              "<span style='float:left;'>Close:</span> <span style='float:right'>[[close]]</span><br/>" +
                              "<span style='float:left;'>Seasonality:</span> <span style='float:right'>[[Seasonality]]</span><br/>" +
                              "<span style='float:left;'>Volume:</span> <span style='float:right'>[[volume.value]]</span><br/>" +
                              "<span style='float:left;'>OpenInterest:&nbsp;</span> <span style='float:right'>[[OpenInterest]]</span><br/>" +
                              "<span style='float:left;'>Contract:</span> <span style='float:right'>[[Contract]]</span><br/>" +
                              "<span style='float:left;'>Currency:</span> <span style='float:right'>[[Currency]]</span><br/>"

              }, {
                "title": "Close",
                "type": "candlestick",
                "id": "g1",
                "valueAxis":"v2",
                "openField": "open",
                "closeField": "close",
                "highField": "high",
                "lowField": "low",
                "valueField": "close",
                "lineColor": self.state.themes.color_gain,
                "fillColors": self.state.themes.color_gain,
                "negativeLineColor": self.state.themes.color_loss,
                "negativeFillColors": self.state.themes.color_loss,
                "legendColor":self.state.themes.color_gain,

                "colorField":"VolumeColor",
                "lineColorField":"VolumeColor",
                "labelColorField":"VolumeColor",
                "useDataSetColors": true,

                "fillAlphas": 1,
                "columnWidth": 0.7,
                "showBalloonAt":"close",
                "proCandlesticks": false,
                "showAllValueLabels": true,
                "showHandOnHover":true,                
               
                "showBalloon": true,
                "balloonFunction": function(item) {

                  return "<b style='margin-left:5px'>" + item.serialDataItem.dataContext.display_date + "</b>" +
                              "<hr style='margin-left:-8px;margin-right:-8px;margin-top:1px;margin-bottom:1px;color:" +  self.state.themes.text_color + ";border: 3px;border-top: 1px solid " +  self.state.themes.text_color + "' />" +
                              "<span style='float:left;'><b>Open:</b></span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext.Open.toString()) + "</span><br/>" +
                              "<span style='float:left;'><b>High:</b></span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext.High.toString()) + "</span><br/>" +
                              "<span style='float:left;'><b>Low:</b></span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext.Low.toString()) + "</span><br/>" +
                              "<span style='float:left;'><b>Close:</b></span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext.Close.toString()) + "</span><br/>" + 
                              //"<span style='float:left;'><b>Seasonality:</b></span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext.Seasonality.toString()) + "</span>" +
                              //"<span style='float:left;'><b>Volume:</b></span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext.Volume.toString()) + "</span><br/>" +
                              //"<span style='float:left;'><b>OpenInterest:</b></span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext.OpenInterest.toString()) + "</span>" +
                              //"<span style='float:right;margin-right:5px'><span style='float:left;'><b></b></span> <span style='float:right'></span><br/>" +
                              "<span style='float:left;'><b>Currency:</b></span> <span style='float:right'>" + item.serialDataItem.dataContext.Currency.toString() + "</span><br/>" +
                              "<span style='float:left;'><b>Contract:</b></span> <span style='float:right'>" + item.serialDataItem.dataContext.Contract.toString() + "</span><br/>"
                }
              }
              ],
        
              "stockLegend": {
                "valueTextRegular": undefined,
                "periodValueTextComparing": "[[percents.value.close]]%"
              },
              
              "valueAxes": [{
                "id":"v1",
                "color":self.state.themes.seasonality,
                "titleColor":self.state.themes.seasonality,
                "axisColor": "transparent",
                "axisThickness": 0,
                "axisAlpha": 0.0001,
                "position": "left",
                "gridAlpha":0.0001,
                "gridCount":0,
                "gridThickness":0

              }, {
                  "id":"v2",
                  "axisColor": "#FCD202",
                  "axisThickness": 2,
                  "axisAlpha": 1,
                  "position": "right",
              }]
            
        
            },
        
            {
              "percentHeight": 20,
        
              "stockGraphs": [  {
                "title": "OpenInterest",
                "valueAxis":"v3",
                "type": "line",
                "id": "g3",
                "valueField": "OpenInterest",
                "lineColor": self.state.themes.open_interest,
                "fillColors": self.state.themes.open_interest,
                "showBalloon": true,
                "fillAlphas": 0.03,
                "comparedGraphLineThickness": 2,
                "columnWidth": 0.7,
                "useDataSetColors": false,
              } ,{
                "title": "Volume",
                "valueAxis":"v4",
                "valueField": "volume",
                "openField": "open",
                "closeField": "close",
                "highField": "high",
                "lowField": "low",
                "type": "column",
                "colorField":"VolumeColor",
                "lineColorField":"VolumeColor",
                "labelColorField":"VolumeColor",
                "useDataSetColors": true,
                "legendColor":self.state.themes.color_loss,
                "fillAlphas": 1,
                "showHandOnHover":true,
                "showBalloon": true,
                "balloonFunction": function(item) {
                  //console.log(item);
                  return "[[display_date]]<hr style='margin-left:-8px;margin-right:-8px;margin-top:1px;margin-bottom:1px;color:" +  self.state.themes.text_color + ";border: 3px;border-top: 1px solid " +  self.state.themes.text_color + "' />" +
                  "<span style='float:left;'>Volume:</span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext.Volume) + "</span><br/>" +
                  "<span style='float:left;'>OpenInterest:&nbsp;</span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext.OpenInterest) + "</span><br/>" 
                  
                },

              }
              ],
        
              "stockLegend": {
                "periodValueTextRegular": "[[value.close]]"
              },
              "valueAxes": [{
                "id":"v3",
                "axisColor": "#FF6600",
                "axisThickness": 0,
                "axisAlpha": 0.0001,
                "position": "left",
                "gridAlpha":0.0001,
                "gridCount":0,
                "usePrefixes": true,
                "gridThickness":0
              }, {
                  "id":"v4",
                  "usePrefixes": true,
                  "includeAllValues":true,
                  "axisThickness": 2,
                  "axisAlpha": 1,
                  "position": "right"
              }]
            }
          ],
          "panelsSettings": {
            //    "color": "#fff",
            "plotAreaFillColors":  self.state.themes.chart_background,
            "plotAreaFillAlphas": 1,
            "marginLeft": 60,
            "marginTop": 5,
            "marginBottom": 5,
            "marginRight":60,
            //"recalculateToPercents": "never",
            "thousandsSeparator":","
          },
        
        
        
          "categoryAxesSettings": {
            "equalSpacing": true,
            "gridColor":self.state.themes.text_inactive,
            "gridAlpha": 1,
            "maxSeries":1000,
        
          },
        
          "valueAxesSettings": {
            "gridColor": self.state.themes.text_inactive,
            "color": self.state.themes.text_color,
            "gridAlpha": 1,
            "inside": false,

          },
          
          "chartCursorSettings": {
            "pan": true,
            "valueLineEnabled": true,
            "valueLineBalloonEnabled": true
          },
        
          "legendSettings": {
            //"color": "#fff"
          },
        
          "stockEventsSettings": {
            "showAt": "high",
            "type": "pin"
          },
          "numberFormatter": {
            "precision": -1,
            "decimalSeparator": ".",
            "thousandsSeparator": ","
          },
          "chartScrollbarSettings": {
            "graph": "g1",
            "graphType": "line",
            "usePeriod": "DD",
            "backgroundColor": self.state.themes.background,
            "graphFillColor": self.state.themes.text_color,
            "graphFillAlpha": 0.5,
            "gridColor": self.state.themes.text_inactive,
            "gridAlpha": 1,
            "selectedBackgroundColor": self.state.themes.background,
            "selectedGraphFillAlpha": 1,
            "enabled":false,
            
          },

          "balloon": {
            "adjustBorderColor": true,
            "color": self.state.themes.text_color,
            "cornerRadius": 5,
            "fillColor": self.state.themes.background,
            "fixedPosition":false,
            "offsetX": 200,
            "verticalPadding":0,
            "textAlign":"left",
            //"offsetY":200,
            "horizontalPadding":8,
            "showBullet":false,
            "fillAlpha":0.8,
            
          },
        
          /*
          "periodSelector": {
            "position": "bottom",
            "periods": [ {
                "period": "DD",
                "count": 1,
                "label": "1D"
              }, {
                "period": "MM",
                "count": 3,
                "label": "3M"
              }, {
                "period": "MM",
                "count": 6,
                "label": "6M"
              }, {
                "period": "YYYY",
                "count": 1,
                "label": "1Y"
              }, {
                "period": "YYYY",
                "count": 2,
                "selected": true,
                "label": "2Y"
              },
              {
                "period": "MAX",
                "label": "MAX"
              }
            ]
          }
          */
        
        });

          $('#chartdiv').show();
        
          console.log(chartData);
  }

  
  onGetGroupChart = (symbol, date) => {
    this.setState({symbol:symbol,
                    date:date});

    axiosOpen
    .post("/utility/market_group/", {

        'date':this.state.liveDateText,
        'group':symbol

    })
    .then(response => {
        var finalData={}
        var title=response.data.chart_title;
        var firstPeriod="";
        Object.keys(response.data.data).map(date => {
          console.log(response.data)
          if (!firstPeriod) {
            firstPeriod=date;
          }
            var chartData= JSON.parse(response.data.data[date]);
            var cd=[];

            Object.keys(chartData).map(key => {
              var tick=chartData[key];
              tick.Date=key;
              cd.push(tick);
            })
            finalData[date]=cd;
            

     
        })
       
        console.log(finalData)

        this.setState({chartData:finalData,
            specifications:{"chart_title":title, "status":"group"},
            themes:response.data.themes,
            selected_period:firstPeriod,
            firstPeriod:firstPeriod});
        this.onGetGroupChartDate(symbol, date, firstPeriod)
        $('#chartArea').show()
        
    })
    .catch((error) => {
      console.log(error);
      this.setState({ error: true, loading: false });
      this.props.addTimedToaster({
        id: "contact-us-error",
        text: "Server error, please wait till we fix."
      });
    });
    
  }

  onGetGroupChartDate = (symbol, date, period) => {
    var chartData=this.state.chartData[period];
    var self=this;

    this.setState({symbol:symbol, selected_period:period, date:date})

    var color;
    var chart = AmCharts.makeChart( "chartdiv", {
      "type": "stock",
      "theme": "light",
    
      //"color": "#fff",
      "dataSets": [ {
        "title":  symbol + " " + period,
        "fieldMappings": Object.keys(chartData[0]).map(key => {
          return {
                  "fromField": key,
                  "toField": key.replace(" ","")
                }
              }),
        "compared": false,
        "dataProvider": chartData,
        "categoryField": "Date",
      } ],
      "dataDateFormat": "YYYY-MM-DD",
    
      "panels": [
        {
          "percentHeight": 100,
          "percentWidth": 100,
          "autoMarginOffset":2,
          "autoDisplay":true,
          "marginsUpdated":true,
          
          "marginBottom":70,
          "stockGraphs": Object.keys(chartData[0]).map(key => {
              if (key != 'display_date' && key != 'Date') {
                return {
                  "title": key,
                  "type": "line",
                  "id": key.replace(" ",""),
                  //"labelText":"[[value]]%",
                  "valueAxis":"v1",
                  "valueField": key.replace(" ",""),
                  "lineColor": self.state.themes[key],
                  "fillColors": self.state.themes[key],
                  "fillAlphas": 0.03,
                  //"comparedGraphLineThickness": 2,
                  "columnWidth": 0.7,
                  "bulletHitAreaSize":20,
                  "accessibleLabel":"[[category]] [[value]]%",
                  
                   "useDataSetColors": false,
                   "bullet": "round",
                   "bulletSize": 3,
                   //"bullet":"round",
                   //"showBalloonAt": "",
                   //"showBulletsAt":key.replace(" ",""),
                   "showHandOnHover":true,
                   "showBalloon": true,
                   //"balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]%</span></b>",
                   "balloonFunction": function(item) {
                      var str="";
                      var selected_key=key;
                      Object.keys(chartData[0]).map(key => { 
                            var add_style="";
                            if (selected_key == key) {

                              if (parseFloat(item.serialDataItem.dataContext[key]) > 0) 
                                add_style="color:" + self.state.themes.color_gain + ";"
                              else if (parseFloat(item.serialDataItem.dataContext[key]) < 0)
                                add_style="color:" + self.state.themes.color_loss + ";"
                              else 
                                add_style="color:" +self.state.themes[key] + ";"

                              add_style += "font-weight:800;"
                              }

                            if (key != 'display_date' && key != 'Date') {
                              str +="<span style='float:left;'><b>" + key + "</b></span> <span style='float:right;" + add_style + "'>&nbsp;&nbsp;&nbsp;" + numberWithCommas(item.serialDataItem.dataContext[key].toString()) + "%</span><br/>" ;
                            }
                          });
                      return "<b style='margin-left:5px'>" + item.serialDataItem.dataContext.display_date + "</b>" +
                           "<hr style='margin-left:-8px;margin-right:-8px;margin-top:1px;margin-bottom:1px;color:" +  self.state.themes.text_color + ";border: 3px;border-top: 1px solid " +  self.state.themes.text_color + "' />" +
                            str
 

                      /*

                      return "<b style='margin-left:5px'>" + item.serialDataItem.dataContext.display_date + "</b>" +
                              "<hr style='margin-left:-8px;margin-right:-8px;margin-top:1px;margin-bottom:1px;color:" +  self.state.themes.text_color + ";border: 3px;border-top: 1px solid " +  self.state.themes.text_color + "' />" +
                              "<span style='float:left;'><b>" + key + "</b></span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext[key].toString()) + "%</span><br/>" 
                      }
                      */
                    }
                   
                }
              }
          
          }),
        
          "stockLegend": {
            "valueTextRegular": "[[value]]%",
          },
          "axes": [ {
            "axisColor": self.state.themes.grid_color,
            //"color":self.state.themes.seasonality,
            "unit":"%",
          } ],
          "valueAxes": [{
            "id":"v1",
            "axisColor": self.state.themes.grid_color,
            "axisThickness": 1,
            "axisAlpha": 1,
            "position": "left",
            "gridAlpha": 1,
            "gridCount":1,
            "gridThickness":1,
            "unit":"%",


          }, {
              "id":"v2",
              "axisColor": "#FCD202",
              "axisThickness": 2,
              "axisAlpha": 1,
              "position": "right",
          }]
        
    
        } ],
    
      "panelsSettings": {
        //    "color": "#fff",
        "plotAreaFillColors":  self.state.themes.chart_background,
        "plotAreaFillAlphas": 1,
        "marginLeft": 60,
        "marginTop": 5,
        "marginBottom": 5,
        "marginRight":0,
        //"paddingRight":0,
        //"recalculateToPercents": "never",
        "thousandsSeparator":","
      },
    
    
    
      "categoryAxesSettings": {
        "equalSpacing": true,
        "gridColor":self.state.themes.text_inactive,
        "gridAlpha": 1,
        "maxSeries":1000, 
    
      },
    
      "valueAxesSettings": {
        "gridColor": self.state.themes.text_inactive,
        "color": self.state.themes.text_color,
        "gridAlpha": 1,
        "inside": false,

      },
    
      "chartCursor":{
        //"cursorAlpha":0,
        //"categoryBalloonEnabled":false,
        
      },
      "chartCursorSettings": {
        "enabled":true,
        "pan": true,
        "bulletsEnabled":true,
        "zoomable":false,
        "leaveCursor":true,
        "leaveAfterTouch":true, 
        "showNextAvailable":true,
        "valueLineAlpha":1,
        "fullWidth":true,
        "valueLineEnabled": true,
        "valueLineBalloonEnabled": true,
        "valueBalloonsEnabled":true,
        "oneBalloonOnly": true,
        //"avoidBalloonOverlapping":false,
      },
      "legendSettings": {
        "valueText": "[[value]]%"
        //"color": "#fff"
      },
    
      "stockEventsSettings": {
        "showAt": "high",
        "type": "pin"
      },
      "numberFormatter": {
        "precision": -1,
        "decimalSeparator": ".",
        "thousandsSeparator": ","
      },
      "chartScrollbarSettings": {
        "graph": "g1",
        "graphType": "line",
        "usePeriod": "DD",
        "backgroundColor": self.state.themes.background,
        "graphFillColor": self.state.themes.text_color,
        "graphFillAlpha": 0.5,
        "gridColor": self.state.themes.text_inactive,
        "gridAlpha": 1,
        "selectedBackgroundColor": self.state.themes.background,
        "selectedGraphFillAlpha": 1,
        "enabled":false,
        
      },

      "balloon": {
        "adjustBorderColor": true,
        "color": self.state.themes.text_color,
        "cornerRadius": 5,
        "fillColor": self.state.themes.background,
        "fixedPosition":false,
        //"offsetX": 200,
        //"verticalPadding":0,
        "textAlign":"left",
        //"offsetY":200,
        //"horizontalPadding":8,
        "showBullet":true,
        "fillAlpha":0.8,
        
      },
    
      /*
      "periodSelector": {
        "position": "bottom",
        "periods": [ {
            "period": "DD",
            "count": 1,
            "label": "1D"
          }, {
            "period": "MM",
            "count": 3,
            "label": "3M"
          }, {
            "period": "MM",
            "count": 6,
            "label": "6M"
          }, {
            "period": "YYYY",
            "count": 1,
            "label": "1Y"
          }, {
            "period": "YYYY",
            "count": 2,
            "selected": true,
            "label": "2Y"
          },
          {
            "period": "MAX",
            "label": "MAX"
          }
        ]
      }
      */
    
    });
      $('#chartdiv').show();
    
      console.log(chartData);
  }
  render() {
    const formArr = [];
    Object.keys(this.state.controls).forEach(key => {
      formArr.push({
        id: key,
        ...this.state.controls[key]
      });
    });
    var items={};
    var groups=[];
    if (this.state.data.markets != undefined) {
      Object.keys(this.state.data.markets).map(key => {
      var item=this.state.data.markets[key];
      item.key=key;
      if (items[item.group] == undefined)
        items[item.group]=[];

      items[item.group].push(item);


      });
    }

    var idx=0;
    var self=this;
    if (this.state.data.groups != undefined) {
      Object.keys(this.state.data.groups).map(key => {
        idx+=1;
        var group2=[];
        
        if (items[key]!= undefined) {
            items[key].map( item => {
              group2.push (
                <a  href='#chartArea' className={classes.flex_item2}
                    style={{
                      "background":item.color_fill,
                      "color":item.color_text,
                      "fontSize":"1.5em",
                      "border":"1px solid " + item.color_border,

                    }}
                    key={item.key + idx.toString()}
                    onClick={ () => {
                      self.onGetChart(item.key, this.state.liveDateText);
                    }}
                >
                {item.display} <br/><br/>
                {item.pct_chg}
                </a>
            )
          });
        }
        groups.push( 
        <div className={classes.flex_vcontainer}

            key={"vc" + idx.toString()}
        >
            <a className={classes.flex_item}
               href='#chartArea'
                onClick={() => { self.onGetGroupChart(key, this.state.liveDateText) }}
                style={{
                  "background":this.state.data.groups[key].color_fill,
                  "color":this.state.data.groups[key].color_text,
                  "border":"1px solid " + this.state.data.groups[key].color_border,
                }}
                key={key + idx.toString()}
            > 
                <span style={{"fontSize":"24px"}}>
                {key} <br/><br/>
                {this.state.data.groups[key].pct_chg}
                </span>
                <br/>
                <br/>

              
            </a>
            {group2}
          </div>
          );

     });
    }

    var specidx=0;
    var specs=[];
    return (
      <FormatModal title="Futures Market Heatmap" 
      style={{background:self.state.themes.background,
              backgroundColor:self.state.themes.background,
              padding:"0px",margin:"0px"
      }}>
          {this.state.loading || !this.state.date_str? (
            <Spinner />
          ) : this.state.error ? null : (
             <div style={{textAlign:"center",background:self.state.themes.background,
              backgroundColor:self.state.themes.background,
              padding:"0px",margin:"0px"
              }}

            >
              {
                /*
               <h3 style={{"marginTop":"0px", "color" : self.state.themes.text_color}}><br/><b>Data as of {this.state.date_str}</b></h3>
               <br/><br/>
               */
              }
              
              <div id="chartArea"  style={{display:"none", width:"100%", textAlign:"left", padding:"10px"}}>
                  <center><h3>{this.state.specifications.chart_title}</h3></center>
                  <h4>
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  {Object.keys(this.state.chartData).map(date => {
                    return (
                      <span key={"iterspan-" + date}>
                    <a key={"iter_" + date} 
                    href="#chartdev" 
                    style={{
                        color: this.state.selected_period==date ? this.state.themes.text_active :this.state.themes.text_inactive,

                    }}
                    onClick={() => {
                      if (self.state.specifications.status=='item')
                        this.onGetChartDate(this.state.symbol, this.state.date, date)
                      else
                        this.onGetGroupChartDate(this.state.symbol, this.state.date, date)

                    }}>

                  {date}</a>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                    </span>
                
                  )
                  })}
                  </h4>
                  

                 <div id="chartdiv"  style={{display:"none", width:"100%",height:"600px", paddingRight:"60px",  marginBottom:"5px"}}></div>
                 {this.state.specifications['Contract Specifications'] ? 
                 (
                  <div>                    
                 <h4>Contract Specifications</h4>
                  <hr style={{margin: "1px",marginTop:"0px", border:"2px solid black",  }}/>
                  {Object.keys(this.state.specifications['Contract Specifications']).map(item => {
                      specidx+=1;
                      specs.push (
                    <span style={{"flex":1, width:"25%" }}
                    key={item}
                    >
                        <h4><b>{item}</b></h4>
                    </span>
                      )
                      specs.push(
                      <span style={{"flex":1,textAlign:"right",paddingRight: "30px", width:"25%"}}
                      key={item + specidx}
                      >
                          <h4>{this.state.specifications['Contract Specifications'][item]}</h4>
                      </span>
                      )
                      if (specs.length >= 4) {
                        var specHtml=specs;
                        specs=[];
                        return (
                          <div key={'spec' + specidx}>
                          <span style={{"flexDirection":"row", display:"flex",width:"100%"}}>
                            {specHtml}
                          </span>
                          <hr  style={{margin: "1px",marginTop:"0px"}}/>
                          </div>
                        )
                      }
                  
                  })}

                </div>
                 ) : null}
                </div> 
                <br/>
                

        <div className={classes.Markets}>

            <div className={classes.flex_container}>
                {groups}
            </div>
        </div>
        </div>
          )}
        
      </FormatModal>
    );
  }
}
