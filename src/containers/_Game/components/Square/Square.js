import React from "react";
import PropTypes from "prop-types";
import classes from "./Square.css";

const square = props => {
  return (
    <div
      style={props.colors}
      className={classes.Square}
    >
      {props.children}
    </div>
  );
};
square.propTypes = {
  children: PropTypes.any,
  colors: PropTypes.shape({
    borderLeftColor: PropTypes.string,
    borderRightColor: PropTypes.string,
    borderTopColor: PropTypes.string,
    borderBottomColor: PropTypes.string
  }).isRequired
};
export default square;