import React, { Component } from "react";
import PropTypes from "prop-types";
import Square from "../Square/Square";
import classes from "./Board.css";
import Knight from "../Knight/Knight";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  square(x, y, isCellBlack) {
    if (
      x === this.props.knightPosition.x &&
      y === this.props.knightPosition.y
    ) {
      return <Knight color={isCellBlack ? "White" : "Black"} />;
    }
    return null;
  }

  render() {
    const board = [];
    let isBlack = true;
    for (let yIndex = 0; yIndex < 8; yIndex++) {
      let row = [];
      for (let xIndex = 0; xIndex < 8; xIndex++) {
        row.push(
          <Square
            key={"cell-" + xIndex}
            bgColor={isBlack ? "Black" : "White"}
            xIndex={xIndex}
            yIndex={yIndex}
            squareDrop={this.props.squareDrop}
            canDrop={this.props.canDrop}
          >
            {this.square(xIndex, yIndex, isBlack)}
          </Square>
        );
        isBlack = !isBlack;
      }
      isBlack = !isBlack;
      board.push(
        <div key={"row-" + yIndex} className={classes.Row}>
          {row}
        </div>
      );
    }
    return <div className={classes.Board}>{board}</div>;
  }
}

Board.propTypes = {
  knightPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  squareDrop: PropTypes.func.isRequired,
  canDrop: PropTypes.func.isRequired
};

export default DragDropContext(HTML5Backend)(Board);
