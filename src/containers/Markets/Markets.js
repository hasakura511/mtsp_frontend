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
      data:{},
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
    if (this.state.data.groups != undefined) {
      Object.keys(this.state.data.groups).map(key => {
        idx+=1;
        var group2=[];
        
        if (items[key]!= undefined) {
            items[key].map( item => {
              group2.push (
                <div className={classes.flex_item2}
                    style={{
                      "background":item.color_fill,
                      "color":item.color_text,
                    }}
                    key={item.key + idx.toString()}
                >
                {item.display} <br/><br/>
                {item.pct_chg}
                </div>
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

    return (
      <FormatModal title="Futures Market Heatmap">
         <center>
               <h3><b>Data as of {toSlashDate(this.props.liveDateText)}</b></h3>
               <br/><br/>
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
