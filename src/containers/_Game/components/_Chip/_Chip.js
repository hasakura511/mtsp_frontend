import React from "react";
import PropTypes from "prop-types";
import classes from "./_Chip.css";
import { DragSource } from "react-dnd";
import imgSource from "../../../../assets/images/chip-drag.png"

const chip = props => {
  const { dragSource, isDragging, dragPreview, canDrag, chip } = props;
  const img = new Image();
  img.src = imgSource;
  dragPreview(img);
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
  canDrag: PropTypes.bool,
  dragPreview: PropTypes.any
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

/**
 * Drag properties, returns source where dragging started and returns true/false if the item is still being dragged
 * @function collect DragSource's collector function
 * @param {any} connect
 * @param {any} monitor
 * @returns {Object} Object of {connectDragSource, isDragging, connectDragPreview and canDrag}
 */
const collect = (connect, monitor) => {
  return {
    dragSource: connect.dragSource(),
    dragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    canDrag: monitor.canDrag()
  };
};

export default DragSource("chip", chipSource, collect)(chip);
