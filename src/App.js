import React, { Component } from "react";
import Layout from "./hoc/Layout/Layout";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Auth from "./containers/Auth/Auth";
import Logout from "./containers/Auth/Logout";
import * as actions from "./store/actions";
import Home from "./containers/Home/Home";
// import TermsOfService from "./components/Extras/TermsOfService";
// import PrivacyPolicy from "./components/Extras/PrivacyPolicy";
import Extras from "./components/Extras/Extras";

/**
 * This is the Root component where the BrowserHistory of React-Router starts, contains Layout and BrowserRouter
 * and Routes. Maintains SideDrawer visibility state.
 *
 * @class App
 * @extends {Component}
 */
class App extends Component {
  /**
   * Creates an instance of App.
   * @constructor
   * @param {any} props
   * @memberof App
   */
  constructor(props) {
    super(props);

    this.state = {
      showSideDrawer: false
    };
  }
  /**
   * Did mount lifecycle hook for App component, checks the persistent auth state from browser's local storage
   *
   * @memberof App
   */
  componentDidMount() {
    /**
     * Check if window google analytics object is defined
     * And sends a PageView event when App mounted for the first time.
     */
    if (window.ga) {
      window.ga("set", "page", location.pathname);
      window.ga("send", "pageview");
    } else {
      console.log("GA not defined yet");
    }
    this.props.checkAuth();
  }

  /**
   *
   * Logs the location hash at the application level, help us capture location changes.
   * @function componentDidUpdate Lifecycle method of App component.
   *
   * @memberof App
   *
   *
   */
  componentDidUpdate() {
    /**
     * Check if window google analytics object is defined
     * And sends a PageView event when a location is changed.
     */
    if (window.ga) {
      window.ga("set", "page", location.pathname);
      window.ga("send", "pageview");
    }
  }

  /**
   * Toggles visibility of SideDrawer component
   * @function toggleSideDrawer
   * @memberof App
   * @static
   *
   */
  toggleSideDrawer = () => {
    this.setState(prev => ({ showSideDrawer: !prev.showSideDrawer }));
  };
  /**
   * Render of App component
   * @function render
   * @returns {string} returns jsx
   * @memberof App
   */
  render() {
    return (
      <Layout
        showSideDrawer={this.state.showSideDrawer}
        toggleSideDrawer={this.toggleSideDrawer}
      >
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/logout" component={Logout} />
          <Route path="/contact" component={Home} />
          <Route path="/terms_of_service" component={Extras} />
          <Route path="/privacy_policy" component={Extras} />
          <Route path="/risk_disclosure" component={Extras} />
          <Route exact path="/" component={Home} />
          <Redirect from="*" to="/" />
        </Switch>
      </Layout>
    );
  }
}

App.propTypes = {
  checkAuth: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
};

export default withRouter(
  connect(null, dispatch => ({
    checkAuth() {
      dispatch(actions.checkAuth());
    }
  }))(App)
);
