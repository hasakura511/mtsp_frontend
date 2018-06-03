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
import { toUnderScore, andify, toSlashDate } from "../../util";
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
    liveDateText:state.betting.liveDateText
    
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
    };
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    addTimedToaster: PropTypes.func.isRequired,
    liveDate:PropTypes.instanceOf(moment).isRequired,
    liveDateText:PropTypes.string.isRequired
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
    axiosOpen
      .post("/utility/market_heatmap/", {

          'date':this.props.liveDateText,

      })
      .then(response => {
        console.log(response);
        var data=response.data;
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
          data:data,
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

  onGetChart = (symbol, date, period) => {
    this.setState({symbol:symbol,
                    date:date});

    axiosOpen
    .post("/utility/market_chart/", {

        'date':this.props.liveDateText,
        'symbol':symbol

    })
    .then(response => {
        console.log(response.data)
        var chartData= JSON.parse(response.data.data["3 Months"])
        var chartData2= JSON.parse(response.data.data["6 Months"])
        var chartData3= JSON.parse(response.data.data["12 Months"])
       

        var cd=[];
        var cd2=[];
        var cd3=[];
        Object.keys(chartData).map(key => {
          var tick=chartData[key];
          tick.Date=key;
          cd.push(tick);
        })
        Object.keys(chartData2).map(key => {
          var tick=chartData2[key];
          tick.Date=key;
          cd2.push(tick);
        })
        Object.keys(chartData3).map(key => {
          var tick=chartData3[key];
          tick.Date=key;
          cd3.push(tick);
        })

        var finalData={'3 Months':cd, '6 Months':cd2, '12 Months':cd3}
        this.setState({chartData:finalData,
            specifications:response.data.specifications,
            themes:response.data.themes});
        this.onGetChartDate(symbol, date, period)
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
            } ],
            "compared": false,
            "dataProvider": chartData,
            "categoryField": "Date",
        
          } ],
          "dataDateFormat": "YYYY-MM-DD",
        
          "panels": [ {
              "title": "Value",
              "percentHeight": 70,
        
              "stockGraphs": [ {
                "type": "candlestick",
                "id": "g1",
                "openField": "open",
                "closeField": "close",
                "highField": "high",
                "lowField": "low",
                "valueField": "close",
                "lineColor": self.state.themes.text_color,
                "fillColors": self.state.themes.text_color,
                "negativeLineColor": self.state.themes.text_inactive,
                "negativeFillColors": self.state.themes.text_inactive,
                "fillAlphas": 1,
                "comparedGraphLineThickness": 2,
                "columnWidth": 0.7,
                "useDataSetColors": false,
                "comparable": true,
                "compareField": "close",
                "showBalloon": false,
                "proCandlesticks": true
              } ],
        
              "stockLegend": {
                "valueTextRegular": undefined,
                "periodValueTextComparing": "[[percents.value.close]]%"
              }
        
            },
        
            {
              "title": "Volume",
              "percentHeight": 30,
              "marginTop": 1,
              "columnWidth": 0.6,
              "showCategoryAxis": false,
        
              "stockGraphs": [ {
                "valueField": "volume",
                "openField": "open",
                "type": "column",
                "showBalloon": false,
                "fillAlphas": 1,
                "lineColor": self.state.themes.text_color,
                "fillColors":self.state.themes.text_color,
                "negativeLineColor": self.state.themes.text_inactive,
                "negativeFillColors":   self.state.themes.text_inactive,
                "useDataSetColors": false
              } ],
        
              "stockLegend": {
                "markerType": "none",
                "markerSize": 0,
                "labelText": "",
                "periodValueTextRegular": "[[value.close]]"
              },
        
              "valueAxes": [ {
                "usePrefixes": true
              } ]
            }
          ],
        
          "panelsSettings": {
            //    "color": "#fff",
            "plotAreaFillColors":  self.state.themes.background,
            "plotAreaFillAlphas": 1,
            "marginLeft": 60,
            "marginTop": 5,
            "marginBottom": 5
          },
        
          "chartScrollbarSettings": {
            "graph": "g1",
            "graphType": "line",
            "usePeriod": "WW",
            "backgroundColor": self.state.themes.background,
            "graphFillColor": self.state.themes.text_color,
            "graphFillAlpha": 0.5,
            "gridColor": self.state.themes.text_inactive,
            "gridAlpha": 1,
            "selectedBackgroundColor": self.state.themes.background,
            "selectedGraphFillAlpha": 1
          },
        
          "categoryAxesSettings": {
            "equalSpacing": true,
            "gridColor":self.state.themes.text_inactive,
            "gridAlpha": 1
          },
        
          "valueAxesSettings": {
            "gridColor": self.state.themes.text_inactive,
            "gridAlpha": 1,
            "inside": false,
            "showLastLabel": true
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
        
          "balloon": {
            "textAlign": "left",
            "offsetY": 10
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
                    }}
                    key={item.key + idx.toString()}
                    onClick={ () => {
                      self.onGetChart(item.key, this.props.liveDateText, "3 Months");
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
            <div className={classes.flex_item}
                style={{
                  "background":this.state.data.groups[key].color_fill,
                  "color":this.state.data.groups[key].color_text,
                }}
                key={key + idx.toString()}
            > 
                <span style={{"fontSize":"24px"}}>
                {key} <br/><br/>
                {this.state.data.groups[key].pct_chg}
                </span>
                <br/>
                <br/>

              
            </div>
            {group2}
          </div>
          );

     });
    }

    var specidx=0;
    var specs=[];
    return (
      <FormatModal title="Futures Market Heatmap">
         <center>
               <h3><b>Data as of {toSlashDate(this.props.liveDateText)}</b></h3>
               <br/><br/>
               <div id="chartArea"  style={{display:"none", width:"100%", textAlign:"left"}}>
                  <center><h3>{this.state.specifications.chart_title}</h3></center>
                  <h4>
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  <a href="#chartdev" onClick={() => {
                    this.onGetChart(this.state.symbol, this.state.date, "3 Months")
                  }
                  }>3 Months</a>
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  <a href="#chartdev" onClick={() => {
                    this.onGetChart(this.state.symbol, this.state.date, "6 Months")
                  }
                  }>6 Months</a>
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  <a href="#chartdev"   onClick={() => {
                    this.onGetChart(this.state.symbol, this.state.date, "12 Months")
                  }
                  }>12 Months</a>
                  </h4>
                  

                 <div id="chartdiv"  style={{display:"none", width:"100%",height:"600px", padding:"30px", marginBottom:"60px"}}></div>
                 {this.state.specifications['Contract Specifications'] ? 
                 (
                  <div>
                    
                 <h4>Contract Specifications</h4>
                  <hr/>
                  {Object.keys(this.state.specifications['Contract Specifications']).map(item => {
                      specidx+=1;
                      specs.push (
                    <span style={{"flex":1, width:"25%" }}
                    key={item}
                    >
                        <h4>{item}</h4>
                    </span>
                      )
                      specs.push(
                      <span style={{"flex":1,width:"25%"}}
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
                          <hr/>
                          </div>
                        )
                      }
                  
                  })}

                </div>
                 ) : null}
                </div> 
                <br/>
                

        </center>
        <div className={classes.Markets}>

          {this.state.loading ? (
            <Spinner />
          ) : this.state.error ? null : (
            <div className={classes.flex_container}>
                {groups}
            </div>
          )}
        </div>
      </FormatModal>
    );
  }
}