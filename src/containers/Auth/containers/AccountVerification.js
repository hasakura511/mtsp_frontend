import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "../../../axios-gsm";
import * as H from "../../../util";
import * as actions from "../../../store/actions";
import { connect } from "react-redux";
import Spinner from "../../../components/UI/Spinner/Spinner";

class AccountVerification extends Component {
  componentDidMount() {
    const data = H.parseQueryString(this.props.location.search);
    axios
      .post("/utility/auth/registration/verification/", data)
      .then(response => {
        this.props.authSuccess(
          H.keysToCamel(response.data.user),
          response.data.sessiontoken
        );
        this.props.addSuccessToaster();
        this.props.history.push(this.props.authRedirect);
        this.props.clearAuthRedirect();
      })
      .catch(() => {
        this.props.addFailureToaster();
        this.props.history.push("/");
      });
  }

  render() {
    return <Spinner />;
  }
}

AccountVerification.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  }).isRequired,
  history: PropTypes.object.isRequired,
  addSuccessToaster: PropTypes.func.isRequired,
  addFailureToaster: PropTypes.func.isRequired,
  authSuccess: PropTypes.func.isRequired,
  authRedirect: PropTypes.string.isRequired,
  clearAuthRedirect: PropTypes.func.isRequired
};

const dispatchToProps = dispatch => {
  return {
    addSuccessToaster() {
      dispatch(
        actions.addTimedToaster(
          {
            id: "verification-success",
            text: "Account Verified.",
            success: true
          },
          5000
        )
      );
    },
    addFailureToaster() {
      dispatch(
        actions.addTimedToaster(
          {
            id: "verification-failure",
            text: "This link has already been used."
          },
          5000
        )
      );
    },
    authSuccess(user, token) {
      dispatch(actions.authSuccess(user, token));
    },
    clearAuthRedirect() {
      dispatch(actions.clearAuthRedirect());
    }
  };
};

const stateToProps = state => {
  return {
    authRedirect: state.auth.authRedirect
  };
};

export default connect(stateToProps, dispatchToProps)(AccountVerification);
