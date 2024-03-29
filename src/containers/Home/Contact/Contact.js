import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Contact.css";
import FormatModal from "../../../components/UI/FormatModal/FormatModal";
import Input from "../../../components/UI/Input/Input";
import { clone } from "../../../util";
import { withRouter } from "react-router-dom";
import { axiosOpen } from "../../../axios-gsm";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import initialControls from "./InitialControls";
import { toUnderScore, andify } from "../../../util";

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

@withErrorHandler(axiosOpen)
@withRouter
@connect(null, dispatch => ({
  addTimedToaster: toaster => dispatch(actions.addTimedToaster(toaster, 7000))
}))
export default class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: initialControls,
      formIsValid: false,
      loading: true,
      fetched: false,
      error: false,
      submitTitle: ""
    };
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    addTimedToaster: PropTypes.func.isRequired
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
      .get("/utility/choices/")
      .then(response => {
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
        this.setState({
          controls: controls,
          loading: false,
          fetched: true
        });
      })
      .catch(() => {
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
    return (
      <FormatModal title="Try the demo and share your feedback.">
        <div className={classes.Contact}>
          {this.state.loading ? (
            <Spinner />
          ) : this.state.error ? null : (
            <form onSubmit={this.onFormSubmit}>
              {formArr.map(formElem => (
                <Input
                  key={formElem.id}
                  elementType={formElem.elementType}
                  elementConfig={formElem.elementConfig}
                  value={formElem.value}
                  errorMessage={formElem.errorMessage}
                  inputChangeHandler={event =>
                    this.inputChangeHandler(event, formElem.id)
                  }
                  label={formElem.label}
                  valid={formElem.valid || !formElem.touched}
                  style={{
                    width: formElem.elementType === "textarea" ? "100%" : "50%"
                  }}
                  onBlurHandler={event =>
                    this.onBlurHandler(event, formElem.id)
                  }
                />
              ))}
              <span>
                <button
                  disabled={!this.state.formIsValid}
                  type="submit"
                  title={this.state.submitTitle}
                >
                  Send Feedback
                </button>
              </span>
              {disclaimer}
            </form>
          )}
        </div>
      </FormatModal>
    );
  }
}
