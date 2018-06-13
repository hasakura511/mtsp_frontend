import React, { Component } from "react";
import FormatModal from "../../../../components/UI/FormatModal/FormatModal";
import PropTypes from "prop-types";
import * as actions from "../../../../store/actions";
import { connect } from "react-redux";
import classes from "../TosModal/TosModal.css";
import axiosConstants from "../../../../axios-constants";
import { withHeaders } from "../../../../components/Extras/Extras";
import Modal from "../../../../components/UI/Modal/Modal";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import { Button } from "../../components/AuthInitialControls";
import CancelButton from "../../../../components/UI/CancelButton/CancelButton";
import axios from "../../../../axios-gsm";
import { keysToCamel, BUG_MESSAGE, promiseSerial } from "../../../../util";

class RdModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      show: true,
      rdContent: ""
    };
  }

  errorHandler = (error, message) => {
    this.setState({ loading: false, show: false });
    this.props.logout();
    this.props.addTimedToaster({
      id: "rd-modal-load-err",
      text: error.message || message || "You must agree to our Risk Disclosure."
    });
  };

  componentDidMount() {
    axiosConstants
      .get("/risk_disclosure.json")
      .then(response => {
        this.setState({ loading: false, rdContent: response.data });
      })
      .catch(error => {
        this.errorHandler(error, "Couldn't load risk disclosure doc");
      });
  }

  acceptHandler = event => {
    event.preventDefault();
    this.setState({ loading: true });

    this.props.rdAgreed();
  };

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }
    return (
      <Modal toggle={this.errorHandler} hidden={!this.state.show}>
        <FormatModal title="You must agree to our Risk Disclosure">
          <div className={classes.Content}>
            {withHeaders(this.state.rdContent)}
          </div>
          <div className={classes.Footer}>
            <CancelButton onClick={this.errorHandler}>I Disagree</CancelButton>
            <Button onClick={this.acceptHandler}>
              I Agree
            </Button>
          </div>
        </FormatModal>
      </Modal>
    );
  }
}

RdModal.propTypes = {
  authSuccess: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  addTimedToaster: PropTypes.func.isRequired,
  rdAgreed: PropTypes.func.isRequired
};

export default connect(null, dispatch => {
  return {
    authSuccess: (user, token) => {
      dispatch(actions.authSuccess(user, token));
    },
    logout: () => {
      dispatch(actions.logout());
    },
    addTimedToaster: toaster => {
      dispatch(actions.addTimedToaster(toaster, 5000));
    },
    rdAgreed: () => {
      dispatch(actions.rdAgreed());
    }
  };
})(RdModal);
