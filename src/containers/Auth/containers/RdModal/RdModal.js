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
import { keysToCamel, BUG_MESSAGE } from "../../../../util";

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
      text: error.message || message || "You must accept our risk disclosure."
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
    Promise.all([
      axios.post("/utility/auth/tos_update/", {}),
      axios.post("/utility/auth/rd_update/", {})
    ])
      .then(response => {
        /**
         * @type {Object}
         * @example response = "[{"data":{"user":{"id":6,"first_name":"Shubham","last_name":"Mishra","email":"shubhammshr621@gmail.com","country":"","house_number":"","street":"","city":"","postcode":"","phone_number":"+910000000000","verified":true,"mail_sent":true,"provider":"","tos_accepted":true,"rd_accepted":true},"sessiontoken":"318b2f0675f49423d1ad14dc61ee99fa952f2ed8b139cc90d06c26e85734b0cf"},"status":200,"statusText":"OK","headers":{"content-type":"application/json","cache-control":"max-age=0, private, must-revalidate"},"config":{"transformRequest":{},"transformResponse":{},"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json,"Content-Type":"application/json;charset=utf-8","sessiontoken":"318b2f0675f49423d1ad14dc61ee99fa952f2ed8b139cc90d06c26e85734b0cf"},"baseURL":"http://localhost:8000","method":"post","url":"http://localhost:8000/utility/auth/tos_update/","data":"{}"},"request":{}},{"data":{"user":{"id":6,"first_name":"Shubham","last_name":"Mishra","email":"shubhammshr621@gmail.com","country":"","house_number":"","street":"","city":"","postcode":"","phone_number":"+910000000000","verified":true,"mail_sent":true,"provider":"","tos_accepted":true,"rd_accepted":true},"sessiontoken":"318b2f0675f49423d1ad14dc61ee99fa952f2ed8b139cc90d06c26e85734b0cf"},"status":200,"statusText":"OK","headers":{"content-type":"application/json","cache-control":"max-age=0, private, must-revalidate"},"config":{"transformRequest":{},"transformResponse":{},"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json,"Content-Type":"application/json;charset=utf-8","sessiontoken":"318b2f0675f49423d1ad14dc61ee99fa952f2ed8b139cc90d06c26e85734b0cf"},"baseURL":"http://localhost:8000","method":"post","url":"http://localhost:8000/utility/auth/rd_update/","data":"{}"},"request":{}}]"
         */
        this.setState({ loading: false, show: false });
        if (response.length !== 2) {
          throw Error(BUG_MESSAGE);
        }
        this.props.rdAgreed();
      })
      .catch(error => {
        this.errorHandler(error, "Error updating RD status.");
      });
  };

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }
    return (
      <Modal toggle={this.errorHandler} hidden={!this.state.show}>
        <FormatModal title="You must accept our risk disclosure">
          <div className={classes.Content}>
            {withHeaders(this.state.rdContent)}
          </div>
          <div className={classes.Footer}>
            <CancelButton onClick={this.errorHandler}>I disagree</CancelButton>
            <Button onClick={this.acceptHandler}>
              I agree to risk disclosure.
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
