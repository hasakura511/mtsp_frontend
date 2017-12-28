import React from "react";
import PropTypes from "prop-types";
import classes from "./LeftSection.css";
import Config, * as SystemTypes from "../../../Config";

const leftSection = props => {
  return (
    <div className={classes.LeftSection}>
      {props.systems
        .filter(system => Config[system]["position"] === "left")
        .map(system => {
          return (
            <div
              key={"left-" + SystemTypes[system]}
              className={classes.LeftCell}
              style={{ borderLeftColor: Config[system]["color"] }}
            >
              {SystemTypes[system]
                .toLowerCase()
                .replace(
                  /(^[a-z]|_[a-z])/g,
                  $1 => " " + $1[$1.length - 1].toUpperCase()
                )}
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
