import React from "react";
import PropTypes from "prop-types";
import classes from "./RightSection.css";
import Container from "../Container";

const rightSection = props => {
  return (
    <div className={classes.RightSection}>
      {props.systems.map(
        ({ id, color, display, description, column, heldChips }) => {
          return (
            <div
              key={"right-" + id}
              className={classes.RightCell}
              style={{ borderRightColor: color, borderLeftColor: color }}
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
rightSection.propTypes = {
  systems: PropTypes.array
};
export default rightSection;
