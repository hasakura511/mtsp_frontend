import React, { Component } from "react";
import classes from "./SocialAuth.css";
import PropTypes from "prop-types";
import Config from "../../../../AppConfig";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import { keysToCamel } from "../../../../util";

const fbSDK = () => {
  /**
     * If you need it to be loaded synchronously before your app is loaded, you should put it up at the top.
     As for fbAsyncInit and passing the FB data down into the app, you could have that happen in componentDidMount within the App container. That way, your app will be booted up and ready to go. If you have access to a callback when Facebook is loaded, you could trigger a dispatch call to let your app know FB is ready to be used.
     */
  window.fbAsyncInit = () => {
    window.FB.init({
      appId: Config.FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: "v2.1"
    });
  };
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
};

const googleSDK = () => {
  /**
   * Google Authentication Object
   */
  window.start = () => {
    window.gapi.load("auth2", () => {
      window.googleAuth2 = window.gapi.auth2.init({
        client_id: Config.GOOGLE_CLIENT_ID,
        scope: Config.GOOGLE_API_SCOPES
      });
    });
  };
  /**
   * Load the SDK asynchronously.
   */
  (function(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://apis.google.com/js/platform.js?onload=start";
    js.setAttribute("defer", "");
    js.setAttribute("async", "");
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "google-sdk");
};

class SocialAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null
    };
  }

  componentDidMount() {
    /**
     * load Facebook SDK
     */
    fbSDK();
    /**
     * load Google SDK
     */
    googleSDK();
  }

  fbAuth = () => {
    window.FB.login(
      res => {
        if (res.authResponse) {
          // console.dir(JSON.stringify(response));
          window.FB.api(Config.FACEBOOK_API_SCOPES, response => {
            if (response.error) {
              this.props.addTimedToaster({
                id: "fbAuth-error",
                text: "Problem with facebook login, try again."
              });
            } else {
              // console.dir(JSON.stringify(response));
              this.props.authSuccess(keysToCamel(response), res.authResponse);
              this.props.history.push("/");
              console.log(
                "Good to see you, " + response.name + ". now do normal auth."
              );
              // Do auth
            }
          });
        } else {
          this.props.addTimedToaster({
            id: "fbAuth-error",
            text: "Why you no signin :o("
          });
        }
      },
      { scope: "email" }
    );
    // window.FB.getLoginStatus(response => {
    //   if (response.status !== "connected") {

    //   } else {
    //     this.props.addTimedToaster({
    //       id: "fbAuth-already" + 1000 * Math.random(),
    //       text: "Already logged in :o)"
    //     });
    //   }
    // });
  };

  googleAuth = () => {
    /**
     * Google api auth init will be called here
     */
    window.googleAuth2
      .grantOfflineAccess()
      .then(response => {
        this.props.googleAuth(response.code);
      })
      .catch(() => {
        debugger;
        this.props.addTimedToaster({
          id: "googleAuth-error",
          text: "Why you no signin :o("
        });
      });
  };

  linkedinAuth = () => {
    window.IN.User.authorize(() => {
      window.IN.API.Raw(Config.LINKEDIN_API_SCOPES)
        .method("GET")
        .result(response => {
          console.log(response);
          console.log("Do actual login here.");
        });
    }, this);
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
        <button className={classes.Google} onClick={this.googleAuth}>
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
        <button className={classes.Linkedin} onClick={this.linkedinAuth}>
          <span>
            <i className="fa fa-linkedin" />
          </span>
          {this.props.isSignup
            ? "Sign Up with LinkedIn"
            : "Login with LinkedIn"}
        </button>
      </div>
    );
  }
}

SocialAuth.propTypes = {
  isSignup: PropTypes.bool.isRequired,
  addTimedToaster: PropTypes.func.isRequired,
  googleAuth: PropTypes.func.isRequired,
  authSuccess: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const stateToProps = state => {
  return {};
};

const dispatchToProps = dispatch => {
  return {
    googleAuth: code => {
      dispatch(actions.googleAuth(code));
    },
    authSuccess: (user, sessiontoken) => {
      dispatch(actions.authSuccess(user, sessiontoken));
    }
  };
};

export default connect(stateToProps, dispatchToProps)(SocialAuth);
