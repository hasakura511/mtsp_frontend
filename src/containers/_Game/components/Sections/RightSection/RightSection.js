import React from "react";
import PropTypes from "prop-types";
import classes from "./RightSection.css";

const rightSection = props => {
  return (
    <div className={classes.RightSection}>
      {props.systems.map(({ id, color, display, description }) => {
        return (
          <div
            key={"right-" + id}
            className={classes.RightCell}
            style={{ borderRightColor: color }}
            title={description}
          >
            {display}
          </div>
        );
      })}
    </div>
  );
};
rightSection.propTypes = {
  systems: PropTypes.array
};
export default rightSection;
