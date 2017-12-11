import React from "react";
import PropTypes from "prop-types";
import classes from "./Card.css";
import Icon from "./Icon/Icon";

const card = props => {
  return (
    <div className={classes.Card}>
      <Icon src={props.iconSrc} />
      <div className={classes.Desc} style={props.style}>
        <h3><strong>{props.title}</strong></h3>
        <p>{props.description}</p>
      </div>
    </div>
  );
};
card.propTypes = {
  iconSrc: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  style: PropTypes.object,
  title: PropTypes.string.isRequired
};
export default card;
