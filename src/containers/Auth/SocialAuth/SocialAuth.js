import React, { Component } from "react";
import classes from "./SocialAuth.css";
import PropTypes from "prop-types";

class SocialAuth extends Component {
  render() {
    return (
      <div className={classes.SocialAuth}>
        <button className={classes.Facebook}>
          <span>
            <i className="fa fa-facebook" />
          </span>
          {this.props.isSignup
            ? "Sign Up with Facebook"
            : "Login with Facebook"}
        </button>
        <button className={classes.Google}>
          <span>
            <i className="fa fa-google" />
          </span>
          {this.props.isSignup
            ? "Sign Up with Google"
            : "Login with Google"}
        </button>
        <button className={classes.Twitter}>
          <span>
            <i className="fa fa-twitter" />
          </span>
          {this.props.isSignup
            ? "Sign Up with Twitter"
            : "Login with Twitter"}
        </button>
      </div>
    );
  }
}

SocialAuth.propTypes = {
  isSignup: PropTypes.bool.isRequired
};

export default SocialAuth;
