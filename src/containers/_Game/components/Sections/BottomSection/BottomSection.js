import React from "react";
import PropTypes from "prop-types";
import classes from "./BottomSection.css";
import Container from "../Container";

const bottomSection = props => {
  const WIDTH = 60 + (props.topSystems.length - 1) * 80;
  return (
    <div className={classes.BottomSection}>
      {props.systems.map(
        ({ id, color, display, description, position, column, heldChips, short, type }) => {
          var mesg=" Name: " + id + "\n Full Name: " + short + "\n Type: " + type + "\n Description: " + description;

          return position ? (
            <div
              key={"bottom-" + id}
              className={classes.BottomCell}
              style={{
                borderBottomColor: color,
                borderTopColor: color,
                width: WIDTH > 0 ? WIDTH : 60
              }}
              title={mesg}
            >
              <Container {...props} column={column} heldChips={heldChips} />
              {display}
            </div>
          ) : null;
        }
      )}
    </div>
  );
};
bottomSection.propTypes = {
  systems: PropTypes.array,
  topSystems: PropTypes.array
};
export default bottomSection;
