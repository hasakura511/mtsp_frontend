import React, { Component } from "react";
import classes from "./SocialAuth.css";

class SocialAuth extends Component {
  render() {
    return (
      <div className={classes.SocialAuth}>
        <button className={classes.Facebook}>
          <span>
            <i className="fa fa-facebook" />
          </span>
          Sign up with Facebook
        </button>
      </div>
    );
  }
}

export default SocialAuth;
