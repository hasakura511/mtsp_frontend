import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Contact.css";
import FormatModal from "../../../components/UI/FormatModal/FormatModal";
import Input from "../../../components/UI/Input/Input";
import { clone } from "../../../util";
import { withRouter } from "react-router-dom";
import axios from "../../../axios-gsm";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import initialControls from "./InitialControls";
import { toUnderScore } from "../../../util";

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
  return arr;
};

class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: initialControls,
      formIsValid: false,
      loading: true,
      fetched: false,
      error: false
    };
  }

  componentDidMount() {
    if (this.state.loading && !this.state.fetched) {
      axios
        .get("/utility/choices/")
        .then(response => {
          const controls = { ...initialControls };
          for (let key in controls) {
            if (key.indexOf("experience") !== -1) {
              controls[key].elementConfig.options = toOptionsList(
                response["experience"]
              );
            }
          }
          controls.riskAssets.elementConfig.options = toOptionsList(
            response["risk_assets"]
          );
          this.setState({ controls: controls, loading: false, fetched: true });
        })
        .catch(() => {
          this.setState({ error: true, loading: false });
          this.props.addTimedToaster({
            id: "contact-us-error",
            text: "Server error, please wait till we fix."
          });
        });
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
      controls[identifier]["touched"] = true;
      let formIsValid = true;
      for (let key in controls) {
        formIsValid = formIsValid && controls[key].valid;
      }
      return { controls: controls, formIsValid: formIsValid };
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
    axios
      .post("/utility/feedback/", feedback)
      .then(() => {
        this.setState({ loading: false });
        this.props.history.goBack();
        this.props.addTimedToaster({
          id: "contact-us",
          text: "Message successfully sent"
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
                  inputChangeHandler={event =>
                    this.inputChangeHandler(event, formElem.id)
                  }
                  label={formElem.label}
                  valid={formElem.valid || !formElem.touched}
                  style={{
                    width: formElem.elementType === "textarea" ? "100%" : "50%"
                  }}
                />
              ))}
              <span>
                <button disabled={!this.state.formIsValid} type="submit">
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

Contact.propTypes = {
  history: PropTypes.object.isRequired,
  addTimedToaster: PropTypes.func.isRequired
};
export default withErrorHandler(
  withRouter(
    connect(null, dispatch => ({
      addTimedToaster: toaster =>
        dispatch(actions.addTimedToaster(toaster, 7000))
    }))(Contact)
  ),
  axios
);
