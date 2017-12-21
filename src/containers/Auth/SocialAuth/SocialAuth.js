import React, { Component } from "react";
import classes from "./SocialAuth.css";
import PropTypes from "prop-types";

class SocialAuth extends Component {
  componentDidMount() {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: "1633545903429163",
        cookie: true,
        xfbml: true,
        version: "v2.1"
      });
    };
    window.fbAsyncInit.bind(this);

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  fbAuth = () => {
    window.FB.login(response => {
      if (response.authResponse) {
        console.dir(JSON.stringify(response));
        window.FB.api(
          "/me?fields=id,name,picture,email,birthday,devices,education,gender,is_verified,first_name,last_name",
          response => {
            console.dir(JSON.stringify(response));
            console.log("Good to see you, " + response.name + ".");
          }
        );
      } else {
        console.log("User cancelled login or did not fully authorize.");
      }
    });
  };

  render() {
    return (
      <div className={classes.SocialAuth}>
        <button className={classes.Facebook} onClick={this.fbAuth}>
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
          {this.props.isSignup ? "Sign Up with Google" : "Login with Google"}
        </button>
        <button className={classes.Twitter}>
          <span>
            <i className="fa fa-twitter" />
          </span>
          {this.props.isSignup ? "Sign Up with Twitter" : "Login with Twitter"}
        </button>
      </div>
    );
  }
}

SocialAuth.propTypes = {
  isSignup: PropTypes.bool.isRequired
};

export default SocialAuth;
