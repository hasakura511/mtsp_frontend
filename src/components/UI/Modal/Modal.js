import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Dialog.css";
import Aux from "../../../hoc/_Aux/_Aux";
import Backdrop from "../Backdrop/Backdrop";
import Dialog from 'react-toolbox/lib/dialog';
import * as actions from "../../../store/actions";
import { connect } from "react-redux";
import ReactDOM from "react-dom";

const stateToProps = state => {
  return {
    showHtmlModal: state.modal.showHtmlModal,
    htmlContentModal: state.modal.htmlContentModal,
   
    loading: state.modal.loading
  };
};

const dispatchToProps = dispatch => {
  return {
    showHtmlDialogModal: (htmlContent) => dispatch(actions.showHtmlDialogModal(htmlContent)),
    silenceHtmlDialogModal: () => dispatch(actions.silenceHtmlDialogModal())
  };
};

@connect(stateToProps, dispatchToProps)
class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden:props.hidden
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.hidden !== this.props.hidden ||
      nextProps.hardUpdate ||
      (!nextProps.hidden && !this.props.hidden) ||
      false
    );
  }

  successHandler = event => {
    event.preventDefault();
  };

  cancelHandler = event => {
    event.preventDefault();
    //this.props.silenceHtmlDialogModal();
    //this.setState({hidden:true})
  };

  componentDidMount() {
   
  }

  componentWillReceiveProps(newProps) {
    //console.log("newprops");
    //console.log(newProps)

    //if (newProps.children)
    this.setState({hidden:newProps.hidden})
  }

  render() {
    let hidden = "";
    if (this.state.hidden) {
      hidden = classes.Hidden;
    }
    return (
         <Dialog
         className={classes.Dialog}
         actions={[]}
        active={this.state.hidden ? false : true}
        onEscKeyDown={this.props.toggle}
        onOverlayClick={this.props.toggle}
        type={'large'}
      >
        <div style={{
          /*height:(innerHeight-50)+"px",*/
          padding:"0px",
          margin:"-20px",
          overflow:"auto",
          //fontSize: "18px",
          fontWeight: 500,
          height:"100%" ,
        
        }}>
          {this.props.children}
        </div>
        </Dialog>
    );
  }
}

/*
          className={classes.Modal + " " + hidden}
          style={
            this.props.isLarge
              ? { width: "95%", left: "2.5%", top: "1%", minHeight: "98.5vh" }
              : {}
          }
<Backdrop show={!this.props.hidden} toggle={this.props.toggle} />
        
*/
Modal.propTypes = {
  children: PropTypes.any,
  hidden: PropTypes.bool.isRequired,
  showHtmlModal:PropTypes.bool,
  isLarge: PropTypes.bool,
  toggle: PropTypes.func,
  silenceHtmlDialogModal:PropTypes.func,
  showHtmlDialogModal:PropTypes.func,
 
};

export default Modal;
