import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Modal from "./Modal";
import FormatModal from "../FormatModal/FormatModal";
import classes from "./Dialog.css";
import CancelButton from "../CancelButton/CancelButton";
import Button from "../Button/Button";
import * as actions from "../../../store/actions";
import _Aux from "../../../hoc/_Aux/_Aux";
import Spinner from "../Spinner/Spinner";
import Dialog from 'react-toolbox/lib/dialog';

const stateToProps = state => {
  return {
    hidden: !state.modal.showHtml3,
    htmlContent3: state.modal.htmlContent3,
   
    loading: state.modal.loading
  };
};

const dispatchToProps = dispatch => {
  return {
    silenceHtmlDialog3: () => dispatch(actions.silenceHtmlDialog3())
  };
};

@connect(stateToProps, dispatchToProps)
export default class HtmlDialog3 extends Component {
  static propTypes = {
    silenceHtmlDialog3:PropTypes.func.isRequired,
    hidden: PropTypes.bool.isRequired,
    htmlContent3: PropTypes.object,
    loading: PropTypes.bool.isRequired
  };

  successHandler = event => {
    event.preventDefault();
  };

  cancelHandler = event => {
    event.preventDefault();
    this.props.silenceHtmlDialog3();
  };

  render() {
    const {
        htmlContent3,
      hidden,
      loading
    } = this.props;
    return (
        
       <Dialog
       className={classes.Dialog}
        actions={[]}
        active={!this.props.hidden}
        onEscKeyDown={this.cancelHandler}
        onOverlayClick={this.cancelHandler}
        type={'large'}
      >
      <div style={{
          padding:"0px",
          margin:"-20px",
          
          height:(innerHeight-50)+"px",
          overflow:"auto",
          
        }}
        id={"htmlDialog3"}

        >
      {htmlContent3}
      </div>
      </Dialog>
    );
  }
}
