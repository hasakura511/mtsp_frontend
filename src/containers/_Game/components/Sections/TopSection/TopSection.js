import React from "react";
import PropTypes from "prop-types";
import Config, * as SystemTypes from "../../../Config";
import classes from "./TopSection.css";
import DateTimeWidget from "../../DateTimeWidget/DateTimeWidget";
import ChipsPanel from "../../ChipsPanel/ChipsPanel";
import ChipConfig from "../../_Chip/ChipConfig";

const topSection = props => {
  const chips = Array(5)
    .fill(Object.keys(ChipConfig))
    .reduce((acc, elem) => acc.concat(elem), []);
  return (
    <div className={classes.TopSection}>
      {props.systems
        .filter(system => Config[system]["position"] === "top")
        .map(system => {
          return (
            <div
              key={"top-" + SystemTypes[system]}
              className={classes.TopCell}
              style={{ borderTopColor: Config[system]["color"] }}
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
      <ChipsPanel chips={chips} />
      <DateTimeWidget />
    </div>
  );
};
topSection.propTypes = {
  systems: PropTypes.array
};
export default topSection;
