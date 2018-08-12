import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import PropTypes from "prop-types";

export default WrappedComponent2 => {
  class DemoComponent extends Component {
    componentDidMount() {
      //if (!this.props.isAuth) {
      //  this.props.setAuthRedirect(
      //    this.props.location.pathname + this.props.location.search
      //  );
      //}
      //this.forceUpdate();
      //console.log(this.props)
    }

    render() {
        //return this.props.isAuth ? (
        //    <WrappedComponent2 {...this.props} />
        //  ) : (
        //    <Redirect to="/auth?signin" />
        //  );
      //return this.props.isAuth ? (
      return <WrappedComponent2 {...this.props} />
      //) : (
      //  <Redirect to="/auth?signin" />
      //);
    }
  }

  DemoComponent.propTypes = {
    isAuth: PropTypes.bool.isRequired,
    setAuthRedirect: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    email:PropTypes.string.isRequired
  };

  return withRouter(
    connect(
      state => ({
        isAuth:
          state.auth.token !== null &&
          state.auth.tosAccepted &&
          state.auth.rdAccepted,
        email: state.auth.email
      }),
      dispatch => ({
        setAuthRedirect: path => dispatch(actions.setAuthRedirect(path))
      })
    )(DemoComponent)
  );
};
