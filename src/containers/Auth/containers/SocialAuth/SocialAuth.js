import React, { Component } from "react";
import classes from "./SocialAuth.css";
import PropTypes from "prop-types";
import Config from "../../../../AppConfig";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import axios from "../../../../axios-gsm";
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
      error: null,
      loading: false,
      twitterUrl: null,
      linkedinUrl: null
    };
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
    fbSDK();
    /**
     * load Google SDK
     */
    googleSDK();
    /**
     * load Twitter auth url
     */
    this.setState({ loading: true });
    axios
      .get("/utility/auth/twitter/")
      .then(response => {
        this.setState({
          loading: false,
          twitterUrl: response.data["authorize_url"]
        });
        this.onWindowMessageHandler();
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error
        });
      });

    /**
     * load Linked in auth url
     */
    axios
      .get("/utility/auth/linkedin/")
      .then(response => {
        this.setState({
          loading: false,
          linkedinUrl: response.data["authorize_url"]
        });
        this.onWindowMessageHandler();
      })
      .catch(error => {
        this.setState({ loading: false, error: error });
      });
  }

  componentWillUnmount(){
    window.onmessage = null;
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
        this.props.addTimedToaster({
          id: "googleAuth-error",
          text: "Why you no signin :o("
        });
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
        <button className={classes.Twitter} onClick={this.twitterAuth}>
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
  facebookAuth: PropTypes.func.isRequired,
  authSuccess: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const stateToProps = () => {
  return {};
};

const dispatchToProps = dispatch => {
  return {
    googleAuth: code => {
      dispatch(actions.googleAuth(code));
    },
    authSuccess: (user, sessiontoken) => {
      dispatch(actions.authSuccess(user, sessiontoken));
    },
    facebookAuth: (inputToken, user) => {
      dispatch(actions.facebookAuth(inputToken, user));
    }
  };
};

export default connect(stateToProps, dispatchToProps)(SocialAuth);
