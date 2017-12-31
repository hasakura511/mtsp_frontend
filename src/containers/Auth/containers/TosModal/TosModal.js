import React, { Component } from "react";
import FormatModal from "../../../../components/UI/FormatModal/FormatModal";
import PropTypes from "prop-types";
import * as actions from "../../../../store/actions";
import { connect } from "react-redux";
import classes from "./TosModal.css";
import axiosConstants from "../../../../axios-constants";
import axios from "../../../../axios-gsm";
import { withHeaders } from "../../../../components/Extras/Extras";
import Modal from "../../../../components/UI/Modal/Modal";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import { Button } from "../../components/AuthInitialControls";
import { keysToCamel } from "../../../../util";

class TosModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      show: true,
      tosContent: ""
    };
  }

  errorHandler = (error, message) => {
    this.setState({ loading: false, show: false });
    this.props.logout();
    this.props.addTimedToaster({
      id: "tos-modal-load-err",
      text: error.message || message || "You must accept our terms and service."
    });
  };

  componentDidMount() {
    axiosConstants
      .get("/terms_of_service.json")
      .then(response => {
        this.setState({ loading: false, tosContent: response.data });
      })
      .catch(error => {
        this.errorHandler(error, "Couldn't load terms of service");
      });
  }

  acceptHandler = event => {
    event.preventDefault();
    this.setState({ loading: true });
    axios
      .post("/utility/auth/tos_update/", {})
      .then(response => {
        this.setState({ loading: false, show: false });
        this.props.authSuccess(
          keysToCamel(response.data.user),
          response.data.sessiontoken
        );
      })
      .catch(error => {
        this.errorHandler(error, "Error updating TOS status.");
      });
  };

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }
    return (
      <Modal toggle={this.errorHandler} hidden={!this.state.show}>
        <FormatModal title="You must accept our terms of service">
          <div className={classes.Content}>
            {withHeaders(this.state.tosContent)}
          </div>
          <div className={classes.Footer}>
            <Button onClick={this.acceptHandler}>
              I agree to terms of service.
            </Button>
          </div>
        </FormatModal>
      </Modal>
    );
  }
}

TosModal.propTypes = {
  authSuccess: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  addTimedToaster: PropTypes.func.isRequired
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
    }
  };
})(TosModal);
