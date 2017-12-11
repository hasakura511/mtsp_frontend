import React, { Component } from "react";
import Modal from "../../components/UI/Modal/Modal";
import Aux from "../_Aux/_Aux";
import Error from "../../components/Error/Error";

//Error code to message mapping

const ERROR_MESSAGE = {
  false: "",
  404: "Requested resource not found",
  500: "Server exception, contact server admin!",
  401: "Authorization issue, contact business owner!",
  429: "Request too frequent, please wait!",
  406: "Invalid Url, please check!"
  // ...
};

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        error: "",
        errorCode: false
      };
      this.responseInterceptor = axios.interceptors.response.use(
        response => response,
        error => {
          try {
            const code = error.response.status;
            this.setState({
              errorCode: code,
              error:
                error.response.message ||
                error.response.data.message ||
                error.response.data.error.message.replace(/_/g, " ")
            });
          } catch (error) {
            this.setState({ errorCode: 500 });
          } finally {
            return Promise.reject(error);
          }
        }
      );
    }

    componentWillUnmount() {
      axios.interceptors.response.eject(this.responseInterceptor);
    }

    componentDidCatch() {
      this.setState({ errorCode: 500 });
    }

    clearError = () => {
      this.setState({ errorCode: false });
    };

    render() {
      return (
        <Aux>
          <Modal hidden={!this.state.errorCode} toggle={this.clearError}>
            <Error>
              {this.state.error || ERROR_MESSAGE[this.state.errorCode]}
            </Error>
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  };
};

export default withErrorHandler;
