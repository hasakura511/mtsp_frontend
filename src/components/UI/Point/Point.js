import React from "react";
import PropTypes from "prop-types";
import classes from "./Point.css";

const point = props => {
  return (
    <div className={classes.Point}>
      <div className={classes.IndexDiv}>
        <p>{props.index}</p>
      </div>
      <div className={classes.DescDiv}>
        <p>{props.description}</p>
      </div>
    </div>
  );
};
point.propTypes = {
  index: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired
};
export default point;
