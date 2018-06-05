//@flow
import React, { Component } from "react";
import Layout from "./hoc/Layout/Layout";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as actions from "./store/actions";
import Home from "./containers/Home/Home";
import Extras from "./components/Extras/Extras";
// import GameBoard from "./containers/GameBoard/GameBoard";

import Auth, {
  
  AccountVerification,
  ForgotPassword,
  ChangePassword,
  Logout,
  UpdatePassword
} from "./containers/Auth/Auth";
import LiveBoard from "./containers/_Game/containers/LiveBoard/LiveBoard";
import Board from "./containers/_Game/containers/Board/Board";
import Profile from "./containers/Home/Profile/Profile";
import Contact from "./containers/Home/Contact/Contact";
import Markets from "./containers/Markets/Markets";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

type PropType = {
  checkAuth: Function,
  location: Object,
  isAuth: boolean
};

/**
 * This is the Root component where the BrowserHistory of React-Router starts, contains Layout and BrowserRouter
 * and Routes. Maintains SideDrawer visibility state.
 *
 * @class App
 * @extends {Component}
 */
class App extends Component<PropType, { showSideDrawer: boolean }> {
  /**
   * Creates an instance of App.
   * @constructor
   * @param {any} props
   * @memberof App
   */
  constructor(props: PropType) {
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
      window.ga("set", "page", location.pathname + location.search);
      window.ga("send", "pageview");
    } else {
      // console.log("GA not defined yet");
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
      window.ga("set", "page", location.pathname + location.search);
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
  render(): React$Element<any> {
    return (
      <Layout
        showSideDrawer={this.state.showSideDrawer}
        toggleSideDrawer={this.toggleSideDrawer}
      >
        <Switch>
          <Route path="/logout" component={Logout} />
          <Route path="/contact" component={Contact} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/markets" component={Markets} />
          <Route
            exact
            path="/profile/updatepassword"
            component={UpdatePassword}
          />
          <Route path="/terms_of_service" component={Extras} />
          <Route path="/privacy_policy" component={Extras} />
          <Route path="/risk_disclosure" component={Extras} />
          <Route path="/auth/changepassword" component={ChangePassword} />
          <Route path="/auth/updatepassword" component={UpdatePassword} />
          <Route path="/auth/verify" component={AccountVerification} />
          <Route exact path="/auth" component={Auth} />
          <Route exact path="/auth/forgot" component={ForgotPassword} />
          {/* <Route exact path="/" component={this.props.isAuth ? Board : Home} /> */}
          <Route exact path="/board" component={LiveBoard} />
          <Route exact path="/practice_board" component={Board} />
          <Route exact path="/" component={Home} />
          <Redirect from="*" to="/" />
        </Switch>
      </Layout>
    );
  }
}

App.propTypes = {
  checkAuth: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  isAuth: PropTypes.bool.isRequired
};

export default withRouter(
  connect(
    (state: { auth: { token: string } }): { isAuth: boolean } => ({
      isAuth: state.auth.token !== null
    }),
    (dispatch: Function): { checkAuth: Function } => ({
      checkAuth() {
        dispatch(actions.checkAuth());
      }
    })
  )(DragDropContext(HTML5Backend)(App))
);
