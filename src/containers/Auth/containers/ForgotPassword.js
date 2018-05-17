import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { Redirect, Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "../../../axios-gsm";
import classes from "../Form.css";
import { FormInput, Button } from "../components/AuthInitialControls";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Aux from "../../../hoc/_Aux/_Aux";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: {
        email: {
          elementType: "input",
          // label: "Email*",
          elementConfig: {
            type: "email",
            placeholder: ""
          },
          value: "",
          validation: {
            required: true,
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          },
          valid: false,
          touched: false,
          errorMessage: "Please enter a valid email."
        },
        loading: false,
        error: false
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
            value: value,
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

  onFormSubmit = () => {
    this.setState({
      loading: true
    });
    axios
      .post("/utility/auth/forgotpassword/", {
        email: this.state.controls.email.value
      })
      .then(() => {
        this.setState({ loading: false });
        this.props.addTimedToaster(
          {
            id: "forgot-success",
            text: "Link to update password email sent.",
            success: true
          },
          5000
        );
        this.props.history.push("/");
      })
      .catch(error => {
        this.setState({ loading: false });
        this.props.addTimedToaster(
          {
            id: "forgot-error",
            text: error.Message || "Email does not exist"
          },
          5000
        );
      });
  };

  render() {
    const formElem = this.state.controls.email;
    return this.props.isAuth ? (
      <Redirect to="/" />
    ) : this.state.loading ? (
      <Spinner />
    ) : (
      <Aux>
        <form className={classes.Form} onSubmit={this.onFormSubmit}>
          <h2>Reset Password</h2>
          <p>Enter your email address which is linked to your account</p>
          <FormInput {...{ ...this, formElem }} />
          <div className={classes.ButtonContainer}>
            <Button disabled={!formElem.valid}>Reset Password</Button>
          </div>
          {/* <p>
            I remembered, take me back to <Link to="/auth?signin">login!</Link>
          </p> */}
        </form>
      </Aux>
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
  addTimedToaster: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};
export default connect(stateToProps, dispatchToProps)(ForgotPassword);
