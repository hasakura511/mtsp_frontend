import React from "react";
import PropTypes from "prop-types";
import classes from "./_Chip.css";
import { DragSource } from "react-dnd";
import imgSource_25K from "../../../../assets/images/chip-drag-25K.png";
import imgSource_50K from "../../../../assets/images/chip-drag-50K.png";
import imgSource_100K from "../../../../assets/images/chip-drag-0.1M.png";
import { replaceSymbols } from "../../ChipsConfig";

const chip = props => {
  const { dragSource, isDragging, dragPreview, canDrag, chip } = props;
  const img = new Image();
  img.style = {
    width: "48px",
    height: "48px"
  };
  switch (chip.display) {
    case "25K":
      img.src = imgSource_25K;
      break;

    case "50K":
      img.src = imgSource_50K;
      break;

    case "0.1M":
      img.src = imgSource_100K;
      break;

    default:
      break;
  }
  dragPreview(img);
  const title =
    "Portfolio: " + JSON.stringify(chip.qty).replace(/\{|\}|\'|\"/gi, "");
  return dragSource(
    <div className={classes.Chip} title={replaceSymbols(title)}>
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

/**
 * @type {Object} Dragsource Spec.
 */
const chipSource = {
  /**
   * @returns {Object} returns the Object representation of item being dragged
   * @param {Object} props Component's actual props without influence of DragSource Decorator
   */
  beginDrag(props) {
    const { chip } = props;
    return chip;
  },
  canDrag(props) {
    return props.canDrag;
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
