import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Modal.css";
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
         actions={[]}
        active={this.props.hidden ? false : true}
        type={'large'}
      >
        <div
        >
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
