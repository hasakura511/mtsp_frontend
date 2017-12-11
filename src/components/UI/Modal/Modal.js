import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Modal.css";
import Aux from "../../../hoc/_Aux/_Aux";
import Backdrop from "../Backdrop/Backdrop";

class Modal extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.hidden !== this.props.hidden || nextProps.hardUpdate || false
    );
  }

  render() {
    let hidden = "";
    if (this.props.hidden) {
      hidden = classes.Hidden;
    }
    return (
      <Aux>
        <div className={classes.Modal + " " + hidden}>
          {this.props.children}
        </div>
        <Backdrop show={!this.props.hidden} toggle={this.props.toggle} />
      </Aux>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.any,
  hidden: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default Modal;
