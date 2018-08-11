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
    email:state.auth.email,
    heatmap_account_id:state.betting.heatmap_account_id,
    heatmap_lookup_symbol:state.betting.heatmap_lookup_symbol,
    heatmap_lookup_link:state.betting.heatmap_lookup_link,
    heatmap_lookup_group:state.betting.heatmap_lookup_group,
    heatmap_lookup_date:state.betting.heatmap_lookup_date,
    refresh_markets:state.betting.refresh_markets,
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
    initializeHeatmap:(action_id) => {
      dispatch(actions.initializeHeatmap(action_id, 'current'))
    },
    authSuccess: (user, token) => {
      dispatch(actions.authSuccess(user, token));
    },
    addTimedToaster: toaster => {
        dispatch(actions.addTimedToaster(toaster, 5000))
    },
    showPerformance:(action_id) => {
      dispatch(actions.showPerformance(action_id))
    },
    refreshMarketDone:() => {
      dispatch(actions.refreshMarketDone())
    },
    silenceHtmlDialog2: () => dispatch(actions.silenceHtmlDialog2())
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
      chartLoading: false,
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
      refreshing:false,
      heatmap_account_id:'',
      last_heatmap_params:{},
    };
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    addTimedToaster: PropTypes.func.isRequired,
    liveDate:PropTypes.instanceOf(moment).isRequired,
    liveDateText:PropTypes.string.isRequired,
    email:PropTypes.string,
    refreshing:PropTypes.bool,
    load_account_id:PropTypes.string,
    load_symbol:PropTypes.string,
    load_link:PropTypes.string,
    load_portfolio:PropTypes.string,
    heatmap_account_id:PropTypes.string,
    heatmap_lookup_symbol:PropTypes.string,
    heatmap_lookup_link:PropTypes.string,
    refresh_markets:PropTypes.bool.isRequired,
    refreshMarketDone:PropTypes.func.isRequired,
    link:PropTypes.string,
    initializeHeatmap:PropTypes.func.isRequired,
    silenceHtmlDialog2:PropTypes.func.isRequired,
    is_dialog:PropTypes.bool,
    heatmap_lookup_date:PropTypes.string,
    heatmap_lookup_group:PropTypes.string
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

  
  componentWillReceiveProps(newProps) {
    var self=this;
    if (newProps.liveDateText) {
      this.setState({liveDateText:newProps.liveDateText});
    }
    
    //console.log(newProps.heatmap_lookup_group);

    if (newProps.refresh_markets) {
      console.log("Received Refresh Market Status Check");
      if (newProps.liveDateText) {
        this.refreshData('','','','',newProps.liveDateText);
      } else {
        this.refreshData();

      }
    } else if (newProps.heatmap_lookup_group && newProps.heatmap_lookup_group != this.props.heatmap_lookup_group) {
      //self.onGetGroupChart(newProps.heatmap_lookup_group,  newProps.heatmap_lookup_date ? newProps.heatmap_lookup_date : this.state.liveDateText);
      this.refreshData('','','', '', newProps.heatmap_lookup_date ? newProps.heatmap_lookup_date : this.state.liveDateText);

    } else if (newProps.heatmap_account_id && (newProps.heatmap_account_id != this.props.heatmap_account_id || newProps.heatmap_lookup_symbol != this.props.heatmap_lookup_symbol || newProps.heatmap_lookup_link != this.props.heatmap_lookup_link || newProps.heatmap_lookup_date != this.props.heatmap_lookup_date)) {
      console.log("Received Refresh Market Status Check");
      var sym=''
      var link='current'
      
      if (newProps.heatmap_lookup_symbol)
        sym=newProps.heatmap_lookup_symbol
      
      if (newProps.heatmap_lookup_link)
        link=newProps.heatmap_lookup_link
      this.refreshData(newProps.heatmap_account_id, link, sym, '', newProps.heatmap_lookup_date ? newProps.heatmap_lookup_date : this.state.liveDateText);

    } else if (newProps.heatmap_account_id != undefined && newProps.heatmap_account_id == '' && newProps.heatmap_lookup_symbol && (newProps.heatmap_lookup_symbol != this.props.heatmap_lookup_symbol)) {
     
      //alert(newProps.heatmap_lookup_symbol);
      this.refreshData('','',newProps.heatmap_lookup_symbol, '',  newProps.heatmap_lookup_date ? newProps.heatmap_lookup_date : this.state.liveDateText );
    }
    
  }

  refreshData=(account_id='', link='', sym='', portfolio='',date=this.state.liveDateText) => {
    var self=this;
    if (self.state.last_heatmap_params.account_id != account_id ||
        self.state.last_heatmap_params.link != link ||
        self.state.last_heatmap_params.sym != sym )
        self.setState({last_heatmap_params:{'account_id':account_id, 'link':link, 'sym':sym}})
    //else
    //    return;

    this.setState({loading:true, heatmap_account_id:account_id, last_heatmap_params:{'account_id':account_id, 'link':link, 'sym':sym}})
    if (this.state.refreshing) {
      console.log("Market refresh still in progress" );

      
      return;
    }
    else
      this.setState({refreshing:true})
    console.log("Starting Market HEATMAP Refresh with Account: " + account_id + ' Link:' + link + ' Sym:' + sym )
  
    if (self.props.heatmap_lookup_date) {
      //date=self.props.heatmap_lookup_date;
      portfolio='';  
      //alert(date)
      //alert(sym)
    }
    
    axiosOpen
      .post("/utility/market_heatmap/", {
          'username':  this.props.email,
          'date':date,
          'account_id':account_id,
          'link':link,
          'portfolio':portfolio

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
          fetched: true,
          refreshing:false,

        });
        if (sym) {
          self.onGetChart(sym, self.props.heatmap_lookup_date ? self.props.heatmap_lookup_date : liveDateText);
        } else if (self.props.heatmap_lookup_group) {
          self.onGetGroupChart(self.props.heatmap_lookup_group, self.props.heatmap_lookup_date ? self.props.heatmap_lookup_date : liveDateText);
        }
        self.props.refreshMarketDone();
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: true, loading: false,refreshing:false });
        this.props.addTimedToaster({
          id: "contact-us-error",
          text: "Server error, please wait till we fix."
        });
      });
  }

  refreshLinkData=(params)  => {
    var self=this;

    console.log("Refreshing LINK HEATMAP")
    console.log(params)
    this.setState({loading:true, heatmap_account_id:''})
    this.props.initializeHeatmap('','','');
    axiosOpen
      .post("/utility/market_heatmap/", params)
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
        
       this.setState({
          //controls: controls,
          liveDateText:liveDateText,
          date_str:date_str,
          data:data,
          themes:themes,
          loading: false,
          fetched: true,
          refreshing:false,

        });
        
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: true, loading: false,refreshing:false });
        this.props.addTimedToaster({
          id: "contact-us-error",
          text: "Server error, please wait till we fix."
        });
      });
  }

  componentDidMount() {
    var link='';
    if (!this.props.link)
      link='header';
    
    if (this.props.load_symbol) {
      this.refreshData(this.props.load_account_id, this.props.load_link, this.props.load_symbol, this.props.load_portfolio);
    } else {
  
      this.refreshData('',link);
    }
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
                    date:date,
                  chartLoading:true});
    //$(window).scrollTop(0);

    if (!date) {
      date=this.state.liveDateText;
    }
    axiosOpen
    .post("/utility/market_chart/", {

        'date':date,
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
          chartLoading:false,
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
                
               
                "showBalloon": false,
                "balloonText": "<b>[[display_date]]</b><hr style='margin-left:-8px;margin-right:-8px;margin-top:1px;margin-bottom:1px;color:" +  self.state.themes.text_color + ";border: 3px;border-top: 1px solid " +  self.state.themes.text_color + "' />" +
                              "<span style='float:left;'><b>Seasonality:</b></span> <span style='float:right'>[[Seasonality]]</span><br/>" +
                              "<span style='float:left;'><b>OpenInterest:</b>&nbsp;</span> <span style='float:right'>[[OpenInterest]]</span><br/>" +
                              "<span style='float:left;'><b>Contract:</b></span> <span style='float:right'>[[Contract]]</span><br/>" +
                              "<span style='float:left;'><b>Currency:</b></span> <span style='float:right'>[[Currency]]</span><br/>"

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
                              "<span style='float:left;'><b>Seasonality:</b></span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext.Seasonality.toString()) + "</span><br/>" +
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
                "totalTextColor":self.state.themes.seasonality,
                "axisColor": "transparent",
                "axisThickness": 0,
                "axisAlpha": 0.0001,
                "position": "left",
                "gridAlpha":0.0001,
                "gridCount":0,
                "gridThickness":0,
                

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
                "showBalloon": false,
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
                  console.log(item);
                  return "<b>[[display_date]]</b><hr style='margin-left:-8px;margin-right:-8px;margin-top:1px;margin-bottom:1px;color:" +  self.state.themes.text_color + ";border: 3px;border-top: 1px solid " +  self.state.themes.text_color + "' />" +
                  "<span style='float:left;'><b>Volume:</b></span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext.Volume) + "</span><br/>" +
                  "<span style='float:left;'><b>OpenInterest:</b>&nbsp;</span> <span style='float:right'>" + numberWithCommas(item.serialDataItem.dataContext.OpenInterest) + "</span><br/>" 
                  
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
                "color": self.state.themes.open_interest,
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
            "gridAlpha": 1,
            "inside": false,

          },
          
          "chartCursor":{
            //"cursorAlpha":0,
            //"categoryBalloonEnabled":false,
            
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
         
          "chartCursorSettings": {
            "enabled":true,
            "pan": true,
            "bulletsEnabled":true,
            "zoomable":false,
            //"leaveCursor":true,
            //"leaveAfterTouch":true, 
            "showNextAvailable":true,
            "valueLineAlpha":1,
            "fullWidth":true,
            "valueLineEnabled": true,
            "valueLineBalloonEnabled": true,
            "valueBalloonsEnabled":true,
            "balloonPointerOrientation":"horizontal",
            "cursorPosition":"mouse",
            //"oneBalloonOnly": true,
            //"avoidBalloonOverlapping":false,
          },        
          "legendSettings": {
            //"color": "#fff"
            //"spacing": "30px",
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
      chartLoading:true,
                    date:date});


    //$(window).scrollTop(0);
    if (!date) {
      date=this.state.liveDateText
    }
    axiosOpen
    .post("/utility/market_group/", {

        'date': date,
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
            chartLoading:false,
            firstPeriod:firstPeriod,
            });
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
        "leaveCursor":false,
        "leaveAfterTouch":false, 
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
        "valueText": "[[value]]%",
        "align":"left",
        "markerType":"square",
        //"maxColumns":5,
        //"markerLabelGap":5,
        "autoMargins":false,
        "horizontalGap":0,
        "fontSize":12,
        "marginLeft":100,
        "marginRight":0,
        "forceWidth":false,
        "labelWidth":150,
        "valueAlign": "left",
        "valueWidth":10,
        "spacing":2,
        "equalWidths":true,
        
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
                <a  href='#chartTop' className={classes.flex_item2}
                    style={{
                      "background":item.color_fill,
                      "color":item.color_text,
                      "fontSize":"1.5em",
                      "border":"1px solid " + item.color_border,

                    }}
                    key={item.key + idx.toString()}
                    onClick={ () => {
                      self.onGetChart(item.key, this.state.liveDateText);
                      $(window).scrollTop($("#chartTop").offset().top-111);
                      if (self.props.is_dialog) {
                        $(window).scrollTop();
                      }
                    }}
                >
                {item.display} <br/><br/>
                {item.pct_chg}
                {item.bottom_row ? (
                  <span><br/>{item.bottom_row}</span>
                ) : null}
                {item.bottom_row2 ? (
                  <span><br/>{item.bottom_row2}</span>
                ) : null}
                </a>
            )
          });
        }
        groups.push( 
        <div className={classes.flex_vcontainer}

            key={"vc" + idx.toString()}
        >
            <a className={classes.flex_item}
               href='JavaScript:$(window).scrollTop($("#chartTop").offset().top- 111);'
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
      <div title="Futures Market Heatmap" 
      style={{background:self.state.themes.background,
              backgroundColor:self.state.themes.background,
              padding:"0px",margin:"0px"
      }}
      id="marketTop"
      >
          {this.state.loading || !this.state.date_str? (
            <Spinner />
          ) : this.state.error ? null : (
             <div id="chartTop" style={{textAlign:"center",background:self.state.themes.background,
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
              <span style={{'float':'right'}}><button onClick={()=>{ 
                
                if (self.props.load_symbol)
                  self.props.silenceHtmlDialog2();
                else
                  $('#chartArea').hide();
                
                }}>Close</button></span>
                  {this.state.specifications.chart_title ? (
                  <center><h3>{this.state.specifications.chart_title} </h3></center>
                  ) : null }
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
                          <hr  style={{bordr:"1px solid #999999", margin: "3px",marginTop:"0px"}}/>
                          </div>
                        )
                      }
                  
                  })}
                  <hr style={{margin: "1px",marginTop:"0px", border:"2px solid black",  }}/>

                </div>
                 ) : null}
                </div> 
                <br/>
          {this.state.chartLoading || !this.state.date_str? (
            <Spinner />
                ) : null}
                {this.state.data.title ? (
                  <center><h3>{this.state.data.title} </h3></center>
                  ) : null }
                {Object.keys(this.state.data.links).map(key => {
                  var item=this.state.data.links[key];
                  if (item.active_link) {
                    return (
                      <span key={key}> 
                    <a  href='#chartTop'  style={{color:self.state.themes.text_active}}
                     onClick={() => { self.refreshLinkData(item)}}>
                      <font  style={{fontSize:"16px", fontWeight:400,color:self.state.themes.text_active}}><b>{key}</b></font>
                    </a>&nbsp;&nbsp;&nbsp;
                    </span>
                    )
                  } else {
                    return (
                      <span key={key}> 
                    <a  href='#chartTop'  style={{color:self.state.themes.text_inactive}}
                     onClick={() => { self.refreshLinkData(item)}}>
                      <font  style={{fontSize:"16px", fontWeight:400,color:self.state.themes.text_inactive}}><b>{key}</b></font>
                    </a>&nbsp;&nbsp;&nbsp;
                    </span>
                    )
                  }
                })}

        <div className={classes.Markets}>

            <div className={classes.flex_container}>
                {groups}
            </div>
        </div>
        </div>
          )}
        
      </div>
    );
  }
}
