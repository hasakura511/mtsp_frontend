import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Modal.css";
import Aux from "../../../hoc/_Aux/_Aux";
import Backdrop from "../Backdrop/Backdrop";

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
      <Aux>
        <div
          className={classes.Modal + " " + hidden}
          style={
            this.props.isLarge ? { width: "95%", left: "2.5%", top: "1%" } : {}
          }
        >
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
  isLarge: PropTypes.bool,
  toggle: PropTypes.func
};

export default Modal;
