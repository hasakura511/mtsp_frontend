import React, { Component } from "react";
import { clone } from "../../util";
import classes from "./Auth.css";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import PropTypes from "prop-types";
import axios from "axios";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect, Link, withRouter } from "react-router-dom";
import SocialAuth from "./containers/SocialAuth/SocialAuth";
import Aux from "../../hoc/_Aux/_Aux";
import authInitialControls, {
  FormInput,
  Button
} from "./components/AuthInitialControls";
import TosModal from "./containers/TosModal/TosModal";
import RdModal from "./containers/RdModal/RdModal";
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
    let { controls, formIsValid } = { ...this.state };
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
      formIsValid =
        formIsValid && (controls[key].valid || !controls[key].visible);
    }
    this.setState({
      controls,
      formIsValid,
      isSignup: props.location.search === "?signup"
    });
  }

  componentWillMount() {
    this.syncProps(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.syncProps(newProps);
    if (newProps.error && newProps.error !== this.props.error) {
      this.props.addTimedToaster(
        {
          id: "auth-error" + Math.random().toFixed(3),
          text:
            newProps.error.message ||
            newProps.error.Message ||
            "Error logging in",
          success: newProps.error.success
        },
        5000
      );
      if (newProps.error.status === 202) {
        this.props.history.push("/");
      }
    }
  }

  componentDidMount() {
    if (
      this.props.isAuthenticated &&
      this.props.rdAccepted &&
      this.props.tosAccepted &&
      this.props.authRedirect !== "/"
    ) {
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
      if (identifier === "password" || identifier === "rePassword") {
        controls.rePassword.valid =
          controls.password.value === controls.rePassword.value;
      }
      let formIsValid = true;
      for (let key in controls) {
        formIsValid =
          formIsValid && (controls[key].valid || !controls[key].visible);
      }
      return { controls, formIsValid };
    });
  };

  onFormSubmit = event => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.firstName.value,
      this.state.controls.lastName.value,
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignup
    );
  };

  onBlurHandler = (event, key) => {
    this.setState(prev => {
      const controls = { ...prev.controls };
      controls[key] = { ...controls[key], touched: true };
      return { controls };
    });
  };

  isAuthTemplate() {
    if (this.props.rdAccepted && this.props.tosAccepted) {
      return <Redirect to={this.props.authRedirect} />;
    } else if (!this.props.tosAccepted) {
      //Show modal to accept TOS
      return <TosModal />;
    } else if (!this.props.rdAccepted) {
      return <RdModal />;
    }
  }

  render() {
    const formArr = [],
      isRedirect =
        this.props.location.search !== "?signup" &&
        this.props.location.search !== "?signin";
    if (isRedirect) {
      return <Redirect to="/auth?signup" />;
    }
    if (this.props.loading) {
      return <Spinner />;
    }

    if (this.props.isAuthenticated) {
      return this.isAuthTemplate();
    }

    Object.keys(this.state.controls).forEach(key => {
      if (this.state.controls[key]["visible"]) {
        formArr.push({
          id: key,
          ...this.state.controls[key]
        });
      }
    });
    return (
      <Aux>
        {this.state.isSignup ? (
          <Heading text="Register or" link="Login" href="/auth?signin" />
        ) : (
          <Heading text="Login or" link="Register" href="/auth?signup" />
        )}
        <div className={classes.Auth}>
          <div className={classes.Left}>
            <form onSubmit={this.onFormSubmit}>
              {formArr.map(formElem => (
                <FormInput key={formElem.id} formElem={formElem} {...this} />
              ))}
              <Link style={{ float: "right" }} to="/auth/forgot">
                Forgot Password?
              </Link>
              <span>
                <Button disabled={!this.state.formIsValid} type="submit">
                  {this.state.isSignup ? "Register" : "Login"}
                </Button>
              </span>
            </form>
          </div>
          <SocialAuth
            isSignup={this.state.isSignup}
            addTimedToaster={this.props.addTimedToaster}
            history={this.props.history}
          />
        </div>
      </Aux>
    );
  }
}

Auth.propTypes = {
  onAuth: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  rdAccepted: PropTypes.bool.isRequired,
  tosAccepted: PropTypes.bool.isRequired,
  authRedirect: PropTypes.string.isRequired,
  clearAuthRedirect: PropTypes.func.isRequired,
  addTimedToaster: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  error: PropTypes.object,
  history: PropTypes.object.isRequired
};

export default withRouter(
  connect(
    state => ({
      loading: state.auth.loading,
      isAuthenticated: state.auth.token !== null,
      tosAccepted: state.auth.tosAccepted,
      rdAccepted: state.auth.rdAccepted,
      error: state.auth.error,
      authRedirect: state.auth.authRedirect
    }),
    dispatch => ({
      onAuth: (firstName, lastName, email, password, isSignup) =>
        dispatch(actions.auth(firstName, lastName, email, password, isSignup)),
      clearAuthRedirect: () => dispatch(actions.clearAuthRedirect()),
      addTimedToaster: toaster =>
        dispatch(actions.addTimedToaster(toaster, 5000))
    })
  )(withErrorHandler(axios)(Auth))
);

export {
  default as AccountVerification
} from "./containers/AccountVerification";
export { default as ForgotPassword } from "./containers/ForgotPassword";
export { default as ChangePassword } from "./containers/ChangePassword";
export { default as Logout } from "./containers/Logout";
export { default as UpdatePassword } from "./containers/UpdatePassword";
