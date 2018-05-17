import React, { Component } from "react";
import Board from "./Board/Board";

class GameBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      knightPosition: {
        x: 0,
        y: 0
      }
    };
  }

  canMoveKnight = (toX, toY) => {
    const { x, y } = this.state.knightPosition;
    const dx = Math.abs(x - toX),
      dy = Math.abs(y - toY);
    if ((dx === 1 && dy === 2) || (dx === 2 && dy === 1)) {
      return true;
    }
    return false;
  }

  moveKnight = (toX, toY) => {
    if (this.canMoveKnight(toX, toY)) {
      this.setState({ knightPosition: { x: toX, y: toY } });
    }
  };

  render() {
    return (
      <Board
        knightPosition={this.state.knightPosition}
        squareDrop={this.moveKnight}
        canDrop={this.canMoveKnight}
      />
    );
  }
}

export default GameBoard;
