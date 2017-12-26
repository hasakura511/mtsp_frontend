import React, { Component } from "react";
import PropTypes from "prop-types";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import Button from "../components/Button/Button";
import { checkValidity, clone } from "../../../util";
import axios from "../../../axios-gsm";
import { parseQueryString, keysToCamel } from "../../../util";
import classes from "../Form.css";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
// import axios from

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: {
        password: {
          label: "Password",
          elementType: "input",
          elementConfig: { type: "password" },
          value: "",
          validation: {
            required: true,
            minLength: 8,
            pattern: /[^a-z]/,
            maxLength: 255
          },
          valid: false,
          touched: false,
          visible: true,
          signupField: true,
          signinField: true,
          errorMessage:
            "Password must have at least 8 characters, with at least one capitalized letter, number, or symbol"
        },
        rePassword: {
          label: "Confirm Password",
          elementType: "input",
          elementConfig: { type: "password" },
          value: "",
          validation: { required: true, minLength: 8 },
          valid: false,
          touched: false,
          visible: true,
          signupField: true,
          errorMessage:
            "Please make sure passwords match, re-enter if forgotten."
        }
      },
      formIsValid: false,
      loading: false,
      token: null,
      id: 0
    };
  }

  inputChangeHandler = (event, identifier) => {
    const controls = clone(this.state.controls),
      { value } = event.target;
    controls[identifier]["value"] = value;
    controls[identifier]["valid"] = checkValidity(
      value,
      controls[identifier]["validation"]
    );
    let formIsValid = true;
    for (let key in controls) {
      formIsValid = formIsValid && controls[key]["valid"];
    }
    formIsValid =
      formIsValid && controls.rePassword.value === controls.password.value;
    this.setState({ controls, formIsValid });
  };

  onBlurHandler = (event, identifier) => {
    const controls = clone(this.state.controls);
    controls[identifier]["touched"] = true;
    this.setState({ controls });
  };

  onFormSubmit = () => {
    this.setState({ loading: true });
    const { id, token } = this.state,
      password = this.state.controls.password.value;
    axios
      .post("/utility/auth/changepassword/", {
        id,
        token,
        password
      })
      .then(response => {
        const { user, sessiontoken, Message } = response.data;
        this.props.authSuccess(keysToCamel(user), sessiontoken);
        this.props.addTimedToaster({
          id: "change-success",
          text: Message || "Password changed."
        });
        this.props.history.push("/");        
      })
      .catch(error => {
        this.props.history.push("/");
        this.props.addTimedToaster({
          id: "change-success",
          text: error.Message || "Invalid link"
        });
      });
  };

  componentWillMount() {
    const { token, id } = parseQueryString(this.props.location.search);
    this.setState({ token, id });
  }

  render() {
    const formElems = [];
    for (let key in this.state.controls) {
      formElems.push({
        ...this.state.controls[key],
        id: key
      });
    }
    return this.state.loading ? (
      <Spinner />
    ) : (
      <form className={classes.Form} onSubmit={this.onFormSubmit}>
        {formElems.map(formElem => (
          <Input
            key={formElem.id}
            onBlurHandler={event => this.onBlurHandler(event, formElem.id)}
            inputChangeHandler={event =>
              this.inputChangeHandler(event, formElem.id)
            }
            elementType={formElem.elementType}
            label={formElem.label}
            elementConfig={formElem.elementConfig}
            value={formElem.value}
            valid={formElem.valid || !formElem.touched}
            errorMessage={formElem.errorMessage}
          />
        ))}
        <Button disabled={!this.state.formIsValid}>Submit</Button>
      </form>
    );
  }
}

ChangePassword.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired
  }),
  history: PropTypes.object.isRequired,
  authSuccess: PropTypes.func.isRequired,
  addTimedToaster: PropTypes.func.isRequired
};

const dispatchToProps = dispatch => {
  return {
    addTimedToaster: toaster => dispatch(actions.addTimedToaster(toaster, 5000)),
    authSuccess: (user, token) => dispatch(actions.authSuccess(user, token))
  };
};

export default connect(null, dispatchToProps)(ChangePassword);
