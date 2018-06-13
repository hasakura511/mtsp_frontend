import React, { Component } from "react";
import FormatModal from "../../../../components/UI/FormatModal/FormatModal";
import PropTypes from "prop-types";
import * as actions from "../../../../store/actions";
import { connect } from "react-redux";
import classes from "./GDPRModal.css";
import axiosConstants from "../../../../axios-constants";
import { withHeaders } from "../../../../components/Extras/Extras";
import Modal from "../../../../components/UI/Modal/Modal";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import { Button } from "../../components/AuthInitialControls";
import CancelButton from "../../../../components/UI/CancelButton/CancelButton";
import axios from "../../../../axios-gsm";

class GDPRModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      show: true,
      gdprContent: ""
    };
  }

  errorHandler = (error, message) => {
    this.setState({ loading: false, show: false });
    this.props.logout();
    this.props.addTimedToaster({
      id: "gdpr-modal-load-err",
      text: error.message || message || "You must agree to our Privacy Policy."
    });
  };

  componentDidMount() {
    axiosConstants
      .get("/privacy_policy.json")
      .then(response => {
        this.setState({ loading: false, gdprContent: response.data });
      })
      .catch(error => {
        this.errorHandler(error, "Couldn't load Privacy Policy");
      });
  }

  acceptHandler = event => {
    event.preventDefault();
    this.setState({ loading: true });
    Promise.all([
      axios.post("/utility/auth/tos_update/", {}),
      axios.post("/utility/auth/rd_update/", {}),
      axios.post("/utility/auth/gdpr_update/", {}),
      
    ])
      .then(response => {
        /**
         * @type {Object}
         * @example response = "[{"data":{"user":{"id":6,"first_name":"Shubham","last_name":"Mishra","email":"shubhammshr621@gmail.com","country":"","house_number":"","street":"","city":"","postcode":"","phone_number":"+910000000000","verified":true,"mail_sent":true,"provider":"","tos_accepted":true,"rd_accepted":true},"sessiontoken":"318b2f0675f49423d1ad14dc61ee99fa952f2ed8b139cc90d06c26e85734b0cf"},"status":200,"statusText":"OK","headers":{"content-type":"application/json","cache-control":"max-age=0, private, must-revalidate"},"config":{"transformRequest":{},"transformResponse":{},"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json,"Content-Type":"application/json;charset=utf-8","sessiontoken":"318b2f0675f49423d1ad14dc61ee99fa952f2ed8b139cc90d06c26e85734b0cf"},"baseURL":"http://localhost:8000","method":"post","url":"http://localhost:8000/utility/auth/tos_update/","data":"{}"},"request":{}},{"data":{"user":{"id":6,"first_name":"Shubham","last_name":"Mishra","email":"shubhammshr621@gmail.com","country":"","house_number":"","street":"","city":"","postcode":"","phone_number":"+910000000000","verified":true,"mail_sent":true,"provider":"","tos_accepted":true,"rd_accepted":true},"sessiontoken":"318b2f0675f49423d1ad14dc61ee99fa952f2ed8b139cc90d06c26e85734b0cf"},"status":200,"statusText":"OK","headers":{"content-type":"application/json","cache-control":"max-age=0, private, must-revalidate"},"config":{"transformRequest":{},"transformResponse":{},"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json,"Content-Type":"application/json;charset=utf-8","sessiontoken":"318b2f0675f49423d1ad14dc61ee99fa952f2ed8b139cc90d06c26e85734b0cf"},"baseURL":"http://localhost:8000","method":"post","url":"http://localhost:8000/utility/auth/rd_update/","data":"{}"},"request":{}}]"
         */
        this.setState({ loading: false, show: false });
        /*
        if (response.length !== 3) {
          throw Error(BUG_MESSAGE);
        }
        */
        this.props.gdprAgreed();
      })
      .catch(error => {
        this.errorHandler(error, "Error updating GDPR status.");
      });
    
    // example series execution:
    // const promise1 = () =>
    //   new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve({ msg: "got first response after 2 sec" });
    //     }, 2000);
    //   });

    // const promise2 = () =>
    //   new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve({ msg: "got second response after 3 sec" });
    //     }, 3000);
    //   });

    // promise1()
    //   .then(x => promise2().then(res => [x].concat(res)))
    //   .then(res => console.log(res));
    // promiseSerial([promise1, promise2]).then(res => console.log(res));
  };

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }
    return (
      <Modal hidden={!this.state.show}>
        <FormatModal title="You must agree to our Privacy Policy">
          <div className={classes.Content}>
            {withHeaders(this.state.gdprContent)}
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

GDPRModal.propTypes = {
  authSuccess: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  addTimedToaster: PropTypes.func.isRequired,
  gdprAgreed: PropTypes.func.isRequired
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
    gdprAgreed: () => dispatch(actions.gdprAgreed())
  };
})(GDPRModal);
