import React from "react";
import PropTypes from "prop-types";
import Config, * as SystemTypes from "../../../Config";
import classes from "./BottomSection.css";

const bottomSection = props => {
  return (
    <div className={classes.BottomSection}>
      {props.systems
        .filter(system => Config[system]["position"] === "bottom")
        .map(system => {
          return (
            <div
              key={"bottom-" + SystemTypes[system]}
              className={classes.BottomCell}
              style={{ borderBottomColor: Config[system]["color"] }}
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
bottomSection.propTypes = {
  systems: PropTypes.array
};
export default bottomSection;
