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
    hidden: !state.modal.showHtml2,
    htmlContent2: state.modal.htmlContent2,
   
    loading: state.modal.loading
  };
};

const dispatchToProps = dispatch => {
  return {
    silenceHtmlDialog2: () => dispatch(actions.silenceHtmlDialog2())
  };
};

@connect(stateToProps, dispatchToProps)
export default class HtmlDialog2 extends Component {
  static propTypes = {
    silenceHtmlDialog2:PropTypes.func.isRequired,
    hidden: PropTypes.bool.isRequired,
    htmlContent2: PropTypes.object,
    loading: PropTypes.bool.isRequired
  };

  successHandler = event => {
    event.preventDefault();
  };

  cancelHandler = event => {
    event.preventDefault();
    this.props.silenceHtmlDialog2();
  };

  render() {
    const {
        htmlContent2,
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
          height:(window.innerHeight-50)+"px",
          padding:"0px",
          margin:"-20px",

          overflow:"auto",
          
        }}>
      {htmlContent2}
      </div>
      </Dialog>
    );
  }
}
