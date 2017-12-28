import React, { Component } from "react";
import classes from "./Slot.css";
import Square from "../../components/Square/Square";
import PropTypes from "prop-types";
import Config from "../../Config";

const getColorsObject = systems => {
  const colors = {};
  systems.forEach(system => {
    let borderKey =
      "border" +
      Config[system]["position"].replace(/^./, $1 => $1.toUpperCase()) +
      "Color";
    colors[borderKey] = Config[system]["color"];
  });
  return colors;
};

class Slot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      systems: Object.keys(Config)
    };
  }

  render() {
    return (
      <div className={classes.Slot}>
        <Square colors={getColorsObject(this.state.systems)}>
          {this.props.position}
        </Square>
      </div>
    );
  }
}

Slot.propTypes = {
  systems: PropTypes.array,
  chips: PropTypes.array,
  position: PropTypes.number.isRequired
};

export default Slot;
