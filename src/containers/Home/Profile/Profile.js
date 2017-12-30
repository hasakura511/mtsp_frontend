import React, { Component } from "react";
import classes from "./Profile.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import { Redirect } from "react-router-dom";
import protectedComponent from "../../../hoc/ProtectedComponent/ProtectedComponent";

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

  render() {
    return (
      <div className={classes.Profile}>
        <span>
          <b>First Name: </b>
          <p>{this.props.firstName}</p>
        </span>
        <span>
          <b>Last Name: </b>
          <p>{this.props.lastName}</p>
        </span>
        <span>
          <b>Notification Email: </b>
          <p>{this.props.email}</p>
        </span>
        <br />
        <br />
        <div>
          <h3>Share GSM with your frields</h3>
        </div>
        <div className={classes.Social}>
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
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string
  // isAuth: PropTypes.bool.isRequired
};

const stateToProps = state => {
  return {
    email: state.auth.email,
    firstName: state.auth.firstName,
    lastName: state.auth.lastName
    // isAuth: state.auth.token !== null
  };
};

// export default connect(stateToProps)(Profile);

export default protectedComponent(connect(stateToProps)(Profile));
