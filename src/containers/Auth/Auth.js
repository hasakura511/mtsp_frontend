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
import { Redirect, Link, withRouter } from "react-router-dom";
import SocialAuth from "./SocialAuth/SocialAuth";
import Aux from "../../hoc/_Aux/_Aux";
import authInitialControls from "./AuthInitialControls";
//sign up or sign in

const Heading = props => (
  <h3 className={classes.Heading}>
    {props.text + " "}
    <Link to={props.href}>{props.link}</Link>
  </h3>
);

Heading.propTypes = {
  text: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: authInitialControls,
      isSignup: true,
      formIsValid: false
    };
  }

  syncProps(props) {
    const controls = { ...this.state.controls };
    for (let key in controls) {
      if (props.location.search === "?signup") {
        if (controls[key]["signupField"]) {
          controls[key]["visible"] = true;
        } else {
          controls[key]["visible"] = false;
        }
      }
      if (props.location.search === "?signin") {
        if (controls[key]["signinField"]) {
          controls[key]["visible"] = true;
        } else {
          controls[key]["visible"] = false;
        }
      }
    }
    this.setState({
      controls: controls,
      isSignup: props.location.search === "?signup"
    });
  }

  componentWillMount() {
    this.syncProps(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.syncProps(newProps);
  }

  componentDidMount() {
    if (this.props.isAuth && this.props.authRedirect !== "/") {
      //clear the authRedirect path
      this.props.clearAuthRedirect();
    }
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

    if (rules.pattern) {
      isValid = rules.pattern.test(value.trim()) && isValid;
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
        formIsValid =
          formIsValid && (controls[key].valid || !controls[key].visible);
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

  addToasterClickHandler = () => {
    const toaster = {
      id: (Math.random() * 10).toFixed(3),
      text: "A new toaster component"
    };
    this.props.addTimedToaster(toaster);
  };

  render() {
    const formArr = [],
      isRedirect =
        this.props.location.search !== "?signup" &&
        this.props.location.search !== "?signin";
    Object.keys(this.state.controls).forEach(key => {
      if (this.state.controls[key]["visible"]) {
        formArr.push({
          id: key,
          ...this.state.controls[key]
        });
      }
    });
    return this.props.loading ? (
      <Spinner />
    ) : this.props.isAuth ? (
      <Redirect to={this.props.authRedirect} />
    ) : isRedirect ? (
      <Redirect to="/auth?signup" />
    ) : (
      <Aux>
        {this.state.isSignup ? (
          <Heading text="Sign Up or" link="Sign In" href="/auth?signin" />
        ) : (
          <Heading text="Sign In or" link="Sign Up" href="/auth?signup" />
        )}
        <div className={classes.Auth}>
          <div className={classes.Left}>
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
                  label={formElem.label}
                  style={{ width: formElem.isHalf ? "50%" : "100%" }}
                />
              ))}
              <span>
                <button disabled={!this.state.formIsValid} type="submit">
                  {this.state.isSignup ? "Continue Sign Up" : "Continue Login"}
                </button>
              </span>
            </form>
          </div>
          <SocialAuth isSignup={this.state.isSignup} />
        </div>
      </Aux>
    );
  }
}

Auth.propTypes = {
  onAuth: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool.isRequired,
  authRedirect: PropTypes.string.isRequired,
  clearAuthRedirect: PropTypes.func.isRequired,
  addTimedToaster: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
};

export default withRouter(
  connect(
    state => ({
      loading: state.auth.loading,
      isAuth: state.auth.token !== null,
      authRedirect: state.auth.authRedirect
    }),
    dispatch => ({
      onAuth: (email, password, isSignup) =>
        dispatch(actions.auth(email, password, isSignup)),
      clearAuthRedirect: () => dispatch(actions.clearAuthRedirect()),
      addTimedToaster: toaster =>
        dispatch(actions.addTimedToaster(toaster, 5000))
    })
  )(withErrorHandler(Auth, axios))
);
