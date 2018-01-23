import React from "react";
import PropTypes from "prop-types";
import classes from "./LeftSection.css";
import Config, * as SystemTypes from "../../../Config";

const leftSection = props => {
  return (
    <div className={classes.LeftSection}>
      {props.systems.map(({ id, color, display, description }) => {
        return (
          <div
            key={"left-" + id}
            className={classes.LeftCell}
            style={{ borderLeftColor: color }}
            title={description}
          >
            {display}
          </div>
        );
      })}
    </div>
  );
};
leftSection.propTypes = {
  systems: PropTypes.array
};
export default leftSection;
