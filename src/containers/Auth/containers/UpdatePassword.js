import React, { Component } from "react";
import protectedComponent from "../../../hoc/ProtectedComponent/ProtectedComponent";
import AuthInitialControls from "../components/AuthInitialControls";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import Button from "../components/Button/Button";
import { checkValidity, clone } from "../../../util";
import classes from "../Form.css";
import axios from "../../../axios-gsm";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import PropTypes from "prop-types";

const PASSWORD_SERVER_ERROR =
  "Password could not be updated, make sure your password fulfills the criteria.";

@protectedComponent
@connect(null, dispatch => {
  return {
    addTimedToaster: toaster => {
      dispatch(actions.addTimedToaster(toaster, 5000));
    }
  };
})
export default class UpdatePassword extends Component {
  constructor(props) {
    super(props);
    const { password, rePassword } = AuthInitialControls;
    this.state = {
      controls: {
        password,
        rePassword
      },
      formIsValid: false,
      loading: false
    };
  }

  static propTypes = {
    addTimedToaster: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

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

  onFormSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { password } = this.state.controls;
    axios
      .post("/utility/auth/update/", {
        password: password.value
      })
      .then(() => {
        this.setState({ loading: false });
        this.props.addTimedToaster({
          id: "update-password-success",
          text: "Password updated successfully",
          success: true
        });
        this.props.history.push("/profile");
      })
      .catch(error => {
        this.setState({ loading: false });
        this.props.addTimedToaster({
          id: "update-password-error",
          text: error.Message || PASSWORD_SERVER_ERROR
        });
      });
  };

  render() {
    const formElems = [];
    for (let key in this.state.controls) {
      formElems.push({ ...this.state.controls[key], id: key });
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
        <div className={classes.ButtonContainer}>
          <Button disabled={!this.state.formIsValid}>Submit</Button>
          <Button type="button" onClick={() => this.props.history.goBack()}>
            Back
          </Button>
        </div>
      </form>
    );
  }
}
