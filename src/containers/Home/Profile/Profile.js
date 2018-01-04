import React, { Component } from "react";
import classes from "./Profile.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import protectedComponent from "../../../hoc/ProtectedComponent/ProtectedComponent";
import Aux from "../../../hoc/_Aux/_Aux";
import axios from "../../../axios-gsm";
import axiosFirebase from "../../../axios-constants";
import Controls from "../../Auth/components/AuthInitialControls";
import Button from "../../Auth/components/Button/Button";
import { FormInput } from "../../Auth/components/AuthInitialControls";
import { clone, keysToCamel } from "../../../util";
import * as actions from "../../../store/actions";
import Spinner from "../../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";

const { firstName, lastName } = Controls;

const HEADING = `Thank you for registering for early access! We notify you soon when we launch functionality to bet and track your positions daily with updated end-of-day data.`;

const TITLE = `Congratulations! As the early registerer you will be eligible for additional perks, beginning with six months free access to our newly implemented features and invitations to all beta launches.`;

const Heading = ({ heading, title }) => (
  <div className={classes.Heading}>
    <h2>{heading}</h2>
    <p>{title}</p>
  </div>
);

Heading.propTypes = {
  heading: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

class Profile extends Component {
  twitterShare = event => {
    event.preventDefault();
    const twitterWindow = window.open(
      "https://twitter.com/share?url=" + window.location.origin,
      "twitter-popup",
      "height=350,width=600"
    );
    if (twitterWindow.focus) {
      twitterWindow.focus();
    }
    return false;
  };

  fbShare = event => {
    event.preventDefault();
    const facebookWindow = window.open(
      "https://www.facebook.com/sharer/sharer.php?u=" + window.location.origin,
      "facebook-popup",
      "height=350,width=600"
    );
    if (facebookWindow.focus) {
      facebookWindow.focus();
    }
    return false;
  };

  profileUpdateHandler = event => {
    event.preventDefault();
    this.setState({ loading: true });
    axios
      .post("/utility/auth/update/", {
        first_name: this.state.controls.firstName.value,
        last_name: this.state.controls.lastName.value
      })
      .then(response => {
        this.setState({ loading: false });
        this.props.authSuccess(
          keysToCamel(response.data.user),
          response.data.sessiontoken
        );
        this.props.addTimedToaster({
          id: "profile-update-error",
          text: "Profile updated successfully."
        });
      })
      .catch(error => {
        this.setState({ loading: false });
        this.props.addTimedToaster({
          id: "profile-update-error",
          text: error.Message || "Could not update profile, try again later"
        });
      });
  };

  constructor(props) {
    super(props);

    this.state = {
      controls: {
        firstName: firstName,
        lastName: lastName
      },
      formIsValid: true,
      loading: false,
      heading: "",
      title: ""
    };
    this.state.controls.firstName.value = this.props.firstName;
    this.state.controls.firstName.valid = true;
    this.state.controls.lastName.value = this.props.lastName;
    this.state.controls.lastName.valid = true;
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
        formIsValid = formIsValid && controls[key].valid;
      }
      return { controls, formIsValid };
    });
  };

  onBlurHandler = (event, key) => {
    this.setState(prev => {
      const controls = { ...prev.controls };
      controls[key] = { ...controls[key], touched: true };
      return { controls };
    });
  };

  componentDidMount() {
    this.setState({ loading: true });
    axiosFirebase
      .get("/profile_page.json")
      .then(response => {
        const { heading, title } = response.data;
        this.setState({ loading: false, heading, title });
      })
      .catch(() => {
        this.props.addTimedToaster({
          id: "gsm-constants-profile",
          text: "Error fetching constants from firebase"
        });
        this.setState({ loading: false, heading: HEADING, title: TITLE });
      });
  }

  render() {
    const formArr = [];
    for (let key in this.state.controls) {
      formArr.push({
        id: key,
        ...this.state.controls[key]
      });
    }
    const { title, heading, loading, formIsValid } = this.state;
    return loading ? (
      <Spinner />
    ) : (
      <Aux>
        <Heading title={title} heading={heading} />
        <div className={classes.Profile}>
          <form className={classes.Form}>
            {formArr.map(formElem => (
              <FormInput
                key={formElem.id}
                formElem={formElem}
                onBlurHandler={event => this.onBlurHandler(event, formElem.id)}
                inputChangeHandler={event =>
                  this.inputChangeHandler(event, formElem.id)
                }
              />
            ))}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                disabled={!formIsValid}
                onClick={this.profileUpdateHandler}
              >
                Update Profile
              </Button>
            </div>
            <span className={classes.DeleteSection}>
              <b>Delete your account</b> <button>Delete</button>
            </span>
          </form>
          <div className={classes.Social}>
            <div>
              <h3>Share GSM with your friends</h3>
            </div>
            <span>
              <button className={classes.Facebook} onClick={this.fbShare}>
                <span>
                  <i className="fa fa-facebook" />
                </span>
                Facebook
              </button>
              <button className={classes.Twitter} onClick={this.twitterShare}>
                <span>
                  <i className="fa fa-twitter" />
                </span>
                Twitter
              </button>
            </span>
          </div>
        </div>
      </Aux>
    );
  }
}

Profile.propTypes = {
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  authSuccess: PropTypes.func.isRequired,
  addTimedToaster: PropTypes.func.isRequired
};

const stateToProps = state => {
  return {
    email: state.auth.email,
    firstName: state.auth.firstName,
    lastName: state.auth.lastName
  };
};

const dispatchToProps = dispatch => {
  return {
    addTimedToaster: toaster => {
      dispatch(actions.addTimedToaster(toaster, 5000));
    },
    authSuccess: (user, token) => {
      dispatch(actions.authSuccess(user, token));
    }
  };
};

export default protectedComponent(
  connect(stateToProps, dispatchToProps)(withErrorHandler(axios)(Profile))
);

{
  /* <span>
  <b>Notification Email: </b>
  <p>{this.props.email}</p>
</span>
<br />
<br /> */
}
