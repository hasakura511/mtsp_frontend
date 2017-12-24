import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "../../../axios-gsm";
import Input from "../../../components/UI/Input/Input";
import classes from "./ForgotPassword.css";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: {
        email: {
          elementType: "input",
          label: "Email*",
          elementConfig: {
            type: "email",
            placeholder: "Email Address"
          },
          value: "",
          validation: {
            required: true,
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          },
          valid: false,
          touched: false,
          errorMessage: "Please enter a valid email."
        }
      }
    };
  }

  inputChangeHandler = event => {
    const { value } = event.target;
    this.setState(prev => {
      return {
        controls: {
          ...prev.controls,
          email: {
            ...prev.controls.email,
            valid: value && prev.controls.email.validation.pattern.test(value)
          }
        }
      };
    });
  };

  onBlurHandler = () => {
    this.setState(prev => {
      return {
        controls: {
          ...prev.controls,
          email: {
            ...prev.controls.email,
            touched: true
          }
        }
      };
    });
  };

  render() {
    const formElem = this.state.controls.email;
    return this.props.isAuth ? (
      <Redirect to="/" />
    ) : (
      <form className={classes.ForgotForm}>
        <Input
          key={"forgot-email-id"}
          elementType={formElem.elementType}
          elementConfig={formElem.elementConfig}
          value={formElem.value}
          errorMessage={formElem.errorMessage}
          inputChangeHandler={this.inputChangeHandler}
          label={formElem.label}
          valid={formElem.valid || !formElem.touched}
          onBlurHandler={this.onBlurHandler}
          style={{
            width: formElem.elementType === "textarea" ? "100%" : "50%"
          }}
        />
        <button>Reset Password</button>
      </form>
    );
  }
}

const stateToProps = state => {
  return {
    isAuth: state.auth.token !== null
  };
};

const dispatchToProps = dispatch => {
  return {
    addTimedToaster: toaster => dispatch(actions.addTimedToaster(toaster, 5000))
  };
};

ForgotPassword.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  addTimedToaster: PropTypes.func.isRequired
};
export default connect(stateToProps, dispatchToProps)(ForgotPassword);
