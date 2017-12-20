import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Contact.css";
import FormatModal from "../../../components/UI/FormatModal/FormatModal";
import Input from "../../../components/UI/Input/Input";
import { clone } from "../../../util";
import { withRouter } from "react-router-dom";
import axios from "axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import initialControls from "./InitialControls";

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

class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: initialControls,
      formIsValid: false,
      loading: false
    };
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
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.history.replace("/");
      this.props.addTimedToaster({
        id: "contact-us",
        text: "Message successfully sent"
      });
    }, 2000);
    // axios
    //   .post("", { first_name: nameArr[0], last_name: nameArr[1] })
    //   .then(() => {
    //     this.setState({ loading: false });
    //     this.props.history.goBack();
    //     this.props.addTimedToaster({id: 'contact-us', text: 'Message successfully sent'});
    //   }).catch();
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
          ) : (
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
        dispatch(actions.addTimedToaster(toaster, 3000))
    }))(Contact)
  ),
  axios
);
