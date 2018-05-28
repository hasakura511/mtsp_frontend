import React from "react";
import PropTypes from "prop-types";
import classes from "./_RiskStrip.css";
import Config from "../../Config";


const riskStrip = props => {
  const color = props.system.color;
  return <div style={{
    borderBottomColor: color,
    "zIndex":2,
  }} className={classes.RiskStrip}/>;
};
riskStrip.propTypes = {
  system: PropTypes.object.isRequired
};
export default riskStrip;
