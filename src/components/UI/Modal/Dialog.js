import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Modal from "./Modal";
import FormatModal from "../FormatModal/FormatModal";
import classes from "./Modal.css";
import CancelButton from "../CancelButton/CancelButton";
import Button from "../Button/Button";
import * as actions from "../../../store/actions";
import _Aux from "../../../hoc/_Aux/_Aux";
import Spinner from "../Spinner/Spinner";

const stateToProps = state => {
  return {
    hidden: !state.modal.show,
    onCancel: state.modal.onCancel,
    onSuccess: state.modal.onSuccess,
    message: state.modal.message,
    title: state.modal.title,
    cancelAction: state.modal.cancelAction,
    successAction: state.modal.successAction,
    loading: state.modal.loading
  };
};

const dispatchToProps = dispatch => {
  return {
    silenceDialog: () => dispatch(actions.silenceDialog())
  };
};

@connect(stateToProps, dispatchToProps)
export default class Dialog extends Component {
  static propTypes = {
    hidden: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    message: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    cancelAction: PropTypes.string,
    successAction: PropTypes.string,
    onSuccess: PropTypes.func,
    silenceDialog: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
  };

  successHandler = event => {
    event.preventDefault();
    this.props.onSuccess && this.props.onSuccess();
  };

  cancelHandler = event => {
    event.preventDefault();
    this.props.onCancel && this.props.onCancel();
    this.props.silenceDialog();
  };

  render() {
    const {
      title,
      message,
      cancelAction,
      successAction,
      hidden,
      loading
    } = this.props;
    return (
      <Modal hidden={hidden} toggle={this.cancelHandler}>
        <FormatModal title={title}>
          {loading ? (
            <Spinner />
          ) : (
            <_Aux>
              <div className={classes.Content}><center>{message}</center></div>
              <div className={classes.Footer}>
                <CancelButton onClick={this.cancelHandler}>
                  {cancelAction}
                </CancelButton>
                <Button onClick={this.successHandler}>{successAction}</Button>
              </div>
            </_Aux>
          )}
        </FormatModal>
      </Modal>
    );
  }
}
