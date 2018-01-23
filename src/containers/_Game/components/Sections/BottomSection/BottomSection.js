import React from "react";
import PropTypes from "prop-types";
import classes from "./BottomSection.css";

const bottomSection = props => {
  const WIDTH = 60 + (props.topSystems.length - 1) * 80;
  return (
    <div className={classes.BottomSection}>
      {props.systems.map(({ id, color, display, description }) => {
        return (
          <div
            key={"bottom-" + id}
            className={classes.BottomCell}
            style={{
              borderBottomColor: color,
              width: WIDTH > 0 ? WIDTH : 60
            }}
            title={description}
          >
            {display}
          </div>
        );
      })}
    </div>
  );
};
bottomSection.propTypes = {
  systems: PropTypes.array,
  topSystems: PropTypes.array
};
export default bottomSection;
