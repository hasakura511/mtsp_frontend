import React from "react";
import PropTypes from "prop-types";
import classes from "./LeftSection.css";
import Config, * as SystemTypes from "../../../Config";
import Container from "../Container";

const leftSection = props => {
  return (
    <div className={classes.LeftSection}>
      {props.systems.map(
        ({ id, color, display, description, column, heldChips }) => {
          return (
            <div
              key={"left-" + id}
              className={classes.LeftCell}
              style={{ borderLeftColor: color, borderRightColor: color }}
              title={description}
            >
              <Container {...props} column={column} heldChips={heldChips} />
              {display}
            </div>
          );
        }
      )}
    </div>
  );
};
leftSection.propTypes = {
  systems: PropTypes.array
};
export default leftSection;
