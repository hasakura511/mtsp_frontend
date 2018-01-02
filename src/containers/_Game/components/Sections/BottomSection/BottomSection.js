import React from "react";
import PropTypes from "prop-types";
import Config, * as SystemTypes from "../../../Config";
import classes from "./BottomSection.css";

const bottomSection = props => {
  return (
    <div className={classes.BottomSection}>
      {props.systems.map(({ id, color, display }) => {
        return (
          <div
            key={"bottom-" + id}
            className={classes.BottomCell}
            style={{ borderBottomColor: color }}
          >
            {display}
          </div>
        );
      })}
    </div>
  );
};
bottomSection.propTypes = {
  systems: PropTypes.array
};
export default bottomSection;
