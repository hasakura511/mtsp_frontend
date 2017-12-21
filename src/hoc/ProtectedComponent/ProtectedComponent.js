import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import PropTypes from "prop-types";

export default WrappedComponent => {
  class ProtectedComponent extends Component {
    componentDidMount() {
      if (!this.props.isAuth) {
        this.props.setAuthRedirect(
          this.props.location.pathname + this.props.location.search
        );
      }
    }

    render() {
      return this.props.isAuth ? (
        <WrappedComponent {...this.props} />
      ) : (
        <Redirect to="/auth?signin" />
      );
    }
  }

  ProtectedComponent.propTypes = {
    isAuth: PropTypes.bool.isRequired,
    setAuthRedirect: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  };

  return withRouter(
    connect(
      state => ({ isAuth: state.auth.token !== null }),
      dispatch => ({
        setAuthRedirect: path => dispatch(actions.setAuthRedirect(path))
      })
    )(ProtectedComponent)
  );
};
