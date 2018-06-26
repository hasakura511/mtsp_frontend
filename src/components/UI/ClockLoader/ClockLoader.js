import React from "react";
import PropTypes from "prop-types";

import classes from "./ClockLoader.css";

const clockLoader = ({ show }) =>
  show ? (
    <div
      style={{
        background: "transparent",
        opacity: "0.7",
        height: "100%",
        width: "100%",
        padding: "100px",
        position: "relative",
        zIndex: "100",
        display: "flex",
        flexFlow: "row",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div className={classes.spinnerClock}>
        <div className={classes.spinnerClock__clock} />
        <div className={classes.spinnerClock__minHand} />
        <div className={classes.spinnerClock__secHand} />
      </div>
    </div>
  ) : null;

clockLoader.propTypes = {
  show: PropTypes.bool.isRequired
};

export default clockLoader;
