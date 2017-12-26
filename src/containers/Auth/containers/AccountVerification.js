import React, { Component } from "react";
import PropTypes from "prop-types";
// import { Redirect } from "react-router-dom";
import axios from "../../../axios-gsm";
import * as H from "../../../util";
import * as actions from "../../../store/actions";
import { connect } from "react-redux";
import Spinner from "../../../components/UI/Spinner/Spinner";

class AccountVerification extends Component {
  componentDidMount() {
    const data = H.parseQueryString(this.props.location.search);
    debugger;
    axios
      .post("/utility/auth/registration/verification/", data)
      .then(response => {
        this.props.authSuccess(
          H.keysToCamel(response.data.user),
          response.data.sessiontoken
        );
        this.props.addSuccessToaster();
        this.props.history.push("/");
      })
      .catch(() => {
        this.props.addFailureToaster();
        this.props.history.push("/");        
      });
  }

  render() {
    // return <Redirect to="/" />;
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
  authSuccess: PropTypes.func.isRequired
};

const dispatchToProps = dispatch => {
  return {
    addSuccessToaster: () => {
      dispatch(
        actions.addTimedToaster(
          { id: "verification-success", text: "Account Verified :o)" },
          5000
        )
      );
    },
    addFailureToaster: () => {
      dispatch(
        actions.addTimedToaster(
          { id: "verification-failure", text: "Link has expired :o(" },
          5000
        )
      );
    },
    authSuccess: (user, token) => {
      dispatch(actions.authSuccess(user, token));
    }
  };
};

export default connect(null, dispatchToProps)(AccountVerification);
