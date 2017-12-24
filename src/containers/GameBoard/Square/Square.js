import React, { Component } from "react";
import classes from "./Square.css";
import { DropTarget } from "react-dnd";
// import Aux from "../../../hoc/_Aux/_Aux";
import PropTypes from "prop-types";
import { ItemTypes } from "../ItemTypes";

//What to do on drop
const squareTarget = {
  drop(props) {
    props.squareDrop(props.xIndex, props.yIndex);
  },
  canDrop(props) {
    return props.canDrop(props.xIndex, props.yIndex); //returns true or false
  }
};

//Get the drop target and check if its over
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class Square extends Component {
  onClickHandler = () => {
    this.props.squareDrop(this.props.xIndex, this.props.yIndex);
  };

  render() {
    const {connectDropTarget, isOver, bgColor, canDrop } = this.props;
    return connectDropTarget(
      <div>
        <div
          className={classes.Square}
          style={{ backgroundColor: isOver ? "Transparent" : bgColor }}
          onClick={() => this.onClickHandler()}
        >
          {isOver && canDrop && (
            <div
              style={{
                opacity: 1,
                backgroundColor: "Green",
                width: "100%",
                height: "100%"
              }}
            />
          )}
          {!isOver && canDrop && (
            <div
              style={{
                opacity: 0.5,
                backgroundColor: "Green",
                width: "100%",
                height: "100%"
              }}
            />
          )}
          {isOver && !canDrop && (
            <div
              style={{
                opacity: 1,
                backgroundColor: "Red",
                width: "100%",
                height: "100%"
              }}
            />
          )}
          {this.props.children}
        </div>
      </div>
    );
  }
}

Square.propTypes = {
  xIndex: PropTypes.number.isRequired,
  yIndex: PropTypes.number.isRequired,
  bgColor: PropTypes.string.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  squareDrop: PropTypes.func.isRequired,
  children: PropTypes.any,
  canDrop: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired
};

export default DropTarget(ItemTypes.KNIGHT, squareTarget, collect)(Square);