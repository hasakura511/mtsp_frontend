import React from "react";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

const Fade = props => {
  return (
    <CSSTransition
      {...props}
      timeout={500}
      classNames={"fade"}
    >
      {props.children}
    </CSSTransition>
  );
};

Fade.propTypes = {
  children: PropTypes.any
};

export default Fade;
