import React from "react";
import PropTypes from "prop-types";
import classes from "./TopSection.css";
import Clock from "../../../containers/Clock/Clock";
import ChipsPanel from "../../ChipsPanel/ChipsPanel";

const topSection = props => {
  return (
    <div className={classes.TopSection}>
      {props.systems.map(({ id, color, display, description, position }) => {
        return position ? (
          <div
            key={"top-" + id}
            className={classes.TopCell}
            style={{ borderTopColor: color }}
            title={description}
          >
            {display}
          </div>
        ) : null;
      })}
      <ChipsPanel balanceChips={props.balanceChips} />
      <Clock />
    </div>
  );
};
topSection.propTypes = {
  systems: PropTypes.array,
  balanceChips: PropTypes.array
};
export default topSection;
