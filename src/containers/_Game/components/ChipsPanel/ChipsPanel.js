import React from "react";
import classes from "./ChipsPanel.css";
import Chip from "../_Chip/_Chip";
import PropTypes from 'prop-types';

const chipsPanel = props => {
  return (
    <div className={classes.ChipsPanel}>
      <div className={classes.Left}>
        <p>Off: </p>
      </div>
      <div className={classes.Right}>
        {
          props.chips.map((chip, i) => {
            return <Chip key={"panel-chip-" + i} chip={chip}/>
          })
        }
      </div>
    </div>
  )
}

chipsPanel.propTypes = {
  chips: PropTypes.array.isRequired
}

export default chipsPanel