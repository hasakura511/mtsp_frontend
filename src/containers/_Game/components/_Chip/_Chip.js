import React from "react";
import PropTypes from "prop-types";
import classes from "./_Chip.css";
import { DragSource } from "react-dnd";

const chip = props => {
  const { dragSource, isDragging, canDrag, chip } = props;
  return dragSource(
    <div className={classes.Chip}>
      <p>{chip.display}</p>
    </div>
  );
};
chip.propTypes = {
  chip: PropTypes.object.isRequired,
  dragSource: PropTypes.func,
  isDragging: PropTypes.bool,
  canDrag: PropTypes.bool
};

const chipSource = {
  /**
   * @returns {Object} returns the Object representation of item being dragged
   * @param {Object} props Component's props
   */
  beginDrag(props) {
    const { id, display, amount } = props;
    return { id, display, amount };
  }
};

const collect = (connect, monitor) => {
  return {
    dragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    canDrag: monitor.canDrag()
  };
};

export default DragSource("chip", chipSource, collect)(chip);
