import React, { Component } from "react";
import Input from "../../components/UI/Input/Input";
import { clone } from "../../util";
import classes from "./Auth.css";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import PropTypes from "prop-types";
import axios from "axios";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";
//sign up or sign in

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: {
        email: {
          elementType: "input",
          elementConfig: {
            type: "email",
            placeholder: "Mail Address"
          },
          value: "",
          validation: {
            required: true,
            isEmail: true
          },
          valid: false,
          touched: false
        },

        password: {
          elementType: "input",
          elementConfig: {
            type: "password",
            placeholder: "Password"
          },
          value: "",
          validation: {
            required: true,
            minLength: 6
          },
          valid: false,
          touched: false
        }
      },
      isSignup: true,
      formIsValid: false
    };
  }

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

  switchAuthModeHandler = () => {
    this.setState(prev => ({
      isSignup: !prev.isSignup
    }));
  };

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

  onFormSubmit = event => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignup
    );
  };

  componentDidMount() {
    if (this.props.isAuth && this.props.authRedirect !== "/") {
      //clear the authRedirect path
      this.props.clearAuthRedirect();
    }
  }

  addToasterClickHandler = () => {
    const toaster = {
      id: (Math.random() * 10).toFixed(3),
      text: "A new toaster component"
    };
    this.props.addTimedToaster(toaster);
  };

  render() {
    const formArr = [];
    Object.keys(this.state.controls).forEach(key => {
      formArr.push({
        id: key,
        ...this.state.controls[key]
      });
    });

    return this.props.loading ? (
      <Spinner />
    ) : this.props.isAuth ? (
      <Redirect to={this.props.authRedirect} />
    ) : (
      <div className={classes.Auth}>
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
              valid={formElem.valid || !formElem.touched}
            />
          ))}
          <span>
            <button disabled={!this.state.formIsValid} type="submit">
              Continue
            </button>
            <button onClick={this.switchAuthModeHandler} type="button">
              {this.state.isSignup ? `Switch to signin` : `Switch to signup`}
            </button>
          </span>
          <br />
          <br />
          <br />
          <button type="button" onClick={this.addToasterClickHandler}>
            Test Toaster
          </button>
        </form>
      </div>
    );
  }
}

Auth.propTypes = {
  onAuth: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool.isRequired,
  authRedirect: PropTypes.string.isRequired,
  clearAuthRedirect: PropTypes.func.isRequired,
  addTimedToaster: PropTypes.func.isRequired
};

export default connect(
  state => ({
    loading: state.auth.loading,
    isAuth: state.auth.token !== null,
    authRedirect: state.auth.authRedirect
  }),
  dispatch => ({
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    clearAuthRedirect: () => dispatch(actions.clearAuthRedirect()),
    addTimedToaster: toaster => dispatch(actions.addTimedToaster(toaster, 3000))
  })
)(withErrorHandler(Auth, axios));
