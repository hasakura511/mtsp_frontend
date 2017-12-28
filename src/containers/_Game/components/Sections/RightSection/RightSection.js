import React from "react";
import PropTypes from "prop-types";
import classes from "./RightSection.css";
import Config, * as SystemTypes from "../../../Config";

const rightSection = props => {
  return (
    <div className={classes.RightSection}>
      {props.systems
        .filter(system => Config[system]["position"] === "right")
        .map(system => {
          return (
            <div
              key={"right-" + SystemTypes[system]}
              className={classes.RightCell}
              style={{ borderRightColor: Config[system]["color"] }}
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
rightSection.propTypes = {
  systems: PropTypes.array
};
export default rightSection;
