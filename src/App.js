import React, { Component } from "react";
import Layout from "./hoc/Layout/Layout";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Auth from "./containers/Auth/Auth";
import Logout from "./containers/Auth/Logout";
import * as actions from "./store/actions";
import Home from "./containers/Home/Home";

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
    this.props.checkAuth();
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
      <BrowserRouter>
        <Layout
          showSideDrawer={this.state.showSideDrawer}
          toggleSideDrawer={this.toggleSideDrawer}
        >
          <Switch>
            <Route path="/auth" component={Auth} />
            <Route path="/logout" component={Logout} />
            <Route path="/" component={Home} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  checkAuth: PropTypes.func.isRequired
};

export default connect(
  null,
  dispatch => ({
    checkAuth() {
      dispatch(actions.checkAuth());
    }
  })
)(App);
