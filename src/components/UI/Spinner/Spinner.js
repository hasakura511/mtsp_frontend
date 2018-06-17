import React from 'react';
// import PropTypes from 'prop-types';
import classes from './Spinner.css'

const spinner = () => {
  return (
    <div
    style={{
      background: "white",
      opacity: "1",
      height: "100%",
      width: "100%",
      position: "absolute",
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
  );
};
export default spinner;