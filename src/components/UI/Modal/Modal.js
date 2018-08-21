import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Dialog.css";
import Aux from "../../../hoc/_Aux/_Aux";
import Backdrop from "../Backdrop/Backdrop";
import Dialog from 'react-toolbox/lib/dialog';

class Modal extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.hidden !== this.props.hidden ||
      nextProps.hardUpdate ||
      (!nextProps.hidden && !this.props.hidden) ||
      false
    );
  }

  render() {
    let hidden = "";
    if (this.props.hidden) {
      hidden = classes.Hidden;
    }
    return (
         <Dialog
         className={classes.Dialog}
         actions={[]}
        active={this.props.hidden ? false : true}
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
  isLarge: PropTypes.bool,
  toggle: PropTypes.func
};

export default Modal;
