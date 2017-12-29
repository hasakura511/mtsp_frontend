import React, { Component } from "react";
import Panel from "../Panel/Panel";
import PropTypes from "prop-types";
import classes from "./Board.css";
import bgBoard from "../../../../assets/images/boardBg.png";

class Board extends Component {
  render() {
    return (
      <div
        className={classes.Board}
        style={{
          backgroundImage: "url(" + bgBoard + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          paddingTop: "200px",
          marginTop: "5%",
          paddingBottom: "100px"
        }}
      >
        <Panel />
      </div>
    );
  }
}

export default Board;
