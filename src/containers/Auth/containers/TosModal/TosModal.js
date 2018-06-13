import React, { Component } from "react";
import FormatModal from "../../../../components/UI/FormatModal/FormatModal";
import PropTypes from "prop-types";
import * as actions from "../../../../store/actions";
import { connect } from "react-redux";
import classes from "./TosModal.css";
import axiosConstants from "../../../../axios-constants";
import { withHeaders } from "../../../../components/Extras/Extras";
import Modal from "../../../../components/UI/Modal/Modal";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import { Button } from "../../components/AuthInitialControls";
import CancelButton from "../../../../components/UI/CancelButton/CancelButton";

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
      text: error.message || message || "You must agree to our Terms of Service."
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
    this.props.tosAgreed();
  };

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }
    return (
      <Modal hidden={!this.state.show}>
        <FormatModal title="You must agree to our Terms of Service">
          <div className={classes.Content}>
            {withHeaders(this.state.tosContent)}
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

TosModal.propTypes = {
  authSuccess: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  addTimedToaster: PropTypes.func.isRequired,
  tosAgreed: PropTypes.func.isRequired
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
    tosAgreed: () => dispatch(actions.tosAgreed())
  };
})(TosModal);
