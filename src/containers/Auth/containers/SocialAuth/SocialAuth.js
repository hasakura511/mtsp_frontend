import React, { Component } from "react";
import classes from "./SocialAuth.css";
import PropTypes from "prop-types";
import Config from "../../../../AppConfig";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import axios from "../../../../axios-gsm";
import { keysToCamel } from "../../../../util";

const fbSDK = component => {
  /**
     * If you need it to be loaded synchronously before your app is loaded, you should put it up at the top.
     As for fbAsyncInit and passing the FB data down into the app, you could have that happen in componentDidMount within the App container. That way, your app will be booted up and ready to go. If you have access to a callback when Facebook is loaded, you could trigger a dispatch call to let your app know FB is ready to be used.
     */
  window.fbAsyncInit = () => {
    window.FB.init({
      appId: FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: "v2.7"
    });
    if (component.exists) {
      component.setState({ facebookSDK: true });
    }
  };
  // Load the SDK asynchronously
  (function(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
};

const googleSDK = component => {
  /**
   * Google Authentication Object
   */
  window.start = () => {
    window.gapi.load("auth2", () => {
      window.googleAuth2 = window.gapi.auth2.init({
        client_id: Config.GOOGLE_CLIENT_ID,
        scope: Config.GOOGLE_API_SCOPES
      });
      if (component.exists) {
        component.setState({
          googleSDK: true
        });
      }
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
      error: null,
      loading: false,
      twitterUrl: null,
      linkedinUrl: null,
      facebookSDK: !!window.FB,
      googleSDK: !!window.gapi && !!window.gapi.auth2
    };

    this.exists = true;
  }

  onWindowMessageHandler = () => {
    window.onmessage = res => {
      if (res.data.Message === "TWITTER_AUTH_SUCCESS") {
        this.props.authSuccess(
          keysToCamel(res.data.user),
          res.data.sessiontoken
        );
      }
      if (res.data.Message === "LINKEDIN_AUTH_SUCCESS") {
        this.props.authSuccess(
          keysToCamel(res.data.user),
          res.data.sessiontoken
        );
      }
    };
  };

  componentDidMount() {
    /**
     * load Facebook SDK
     */
    this.state.facebookSDK || fbSDK(this);
    /**
     * load Google SDK
     */
    this.state.googleSDK || googleSDK(this);
    /**
     * load Twitter auth url
     */
    axios
      .get("/utility/auth/twitter/")
      .then(response => {
        if (!this.exists) {
          return;
        }
        this.setState({
          twitterUrl: response.data["authorize_url"]
        });
        this.onWindowMessageHandler();
      })
      .catch(() => {
        this.props.authFail({ Message: "Could not load twitter Oauth URL" });
      });

    /**
     * load Linked in auth url
     */
    axios
      .get("/utility/auth/linkedin/")
      .then(response => {
        if (!this.exists) {
          return;
        }
        this.setState({
          linkedinUrl: response.data["authorize_url"]
        });
        this.onWindowMessageHandler();
      })
      .catch(error => {
        this.props.authFail({
          Message: error.Message || "Could not load linkedin Oauth URL"
        });
      });
  }

  componentWillUnmount() {
    window.onmessage = null;
    this.exists = false;
  }

  fbAuth = () => {
    window.FB.login(
      _response => {
        if (_response.authResponse) {
          // console.dir(JSON.stringify(_response));
          window.FB.api(Config.FACEBOOK_API_SCOPES, response => {
            if (response.error) {
              this.props.addTimedToaster({
                id: "fbAuth-error",
                text: "Problem with facebook login, try again."
              });
            } else {
              // console.dir(JSON.stringify(response));
              const { email, first_name, last_name, id } = response;
              this.props.facebookAuth(_response.authResponse.accessToken, {
                id,
                first_name,
                last_name,
                email
              });
            }
          });
        } else {
          this.props.authFail({
            Message: "You decline login o:("
          });
        }
      },
      { scope: "email" }
    );
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
        // this.props.authFail({ Message: "Please try again." });
      });
  };

  twitterAuth = () => {
    window.open(this.state.twitterUrl, "newWindow", "width=500, height=500");
  };

  linkedinAuth = () => {
    window.open(this.state.linkedinUrl, "newWindow", "width=500, height=500");
  };

  render() {
    return (
      <div className={classes.SocialAuth}>
        <button
          className={classes.Facebook}
          onClick={this.fbAuth}
          disabled={!this.state.facebookSDK}
        >
          <span>
            <i
              className={
                "fa " + (this.state.facebookSDK ? "fa-facebook" : "fa-spinner")
              }
            />
          </span>
          {this.props.isSignup
            ? "Sign Up with Facebook"
            : "Login with Facebook"}
        </button>
        <button
          className={classes.Google}
          onClick={this.googleAuth}
          disabled={!this.state.googleSDK}
        >
          <span>
            <i
              className={
                "fa " + (this.state.googleSDK ? "fa-google" : "fa-spinner")
              }
            />
          </span>
          {this.props.isSignup ? "Sign Up with Google" : "Login with Google"}
        </button>
        <button
          className={classes.Twitter}
          onClick={this.twitterAuth}
          disabled={!this.state.twitterUrl}
        >
          <span>
            <i
              className={
                "fa " + (this.state.twitterUrl ? "fa-twitter" : "fa-spinner")
              }
            />
          </span>
          {this.props.isSignup ? "Sign Up with Twitter" : "Login with Twitter"}
        </button>
        <button
          className={classes.Linkedin}
          onClick={this.linkedinAuth}
          disabled={!this.state.linkedinUrl}
        >
          <span>
            <i
              className={
                "fa " + (this.state.linkedinUrl ? "fa-linkedin" : "fa-spinner")
              }
            />
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
  facebookAuth: PropTypes.func.isRequired,
  authSuccess: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  authFail: PropTypes.func.isRequired
};

const stateToProps = () => {
  return {};
};

const dispatchToProps = dispatch => {
  return {
    googleAuth: code => {
      dispatch(actions.googleAuth(code));
      dispatch(actions.clearAll());
    },
    authSuccess: (user, sessiontoken) => {
      dispatch(actions.authSuccess(user, sessiontoken));
      dispatch(actions.clearAll());
    },
    facebookAuth: (inputToken, user) => {
      dispatch(actions.facebookAuth(inputToken, user));
      dispatch(actions.clearAll());
    },
    authFail: error => {
      dispatch(actions.authFail(error));
    }
  };
};

export default connect(stateToProps, dispatchToProps)(SocialAuth);
