import React from "react";
import PropTypes from "prop-types";
import classes from "./_RiskStrip.css";
import Config from "../../Config";


const riskStrip = props => {
  const color = Config[props.system]["color"];
  return <div style={{borderBottomColor: color}} className={classes.RiskStrip}/>;
};
riskStrip.propTypes = {
  system: PropTypes.string.isRequired
};
export default riskStrip;
