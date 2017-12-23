import React, { Component } from "react";
import * as actions from "../../store/actions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

class Logout extends Component {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    return <Redirect to="/" />;
  }
}

Logout.propTypes = {
  logout: PropTypes.func.isRequired
};

export default connect(
  state => ({}),
  dispatch => ({
    logout: () => dispatch(actions.logout())
  })
)(Logout);
