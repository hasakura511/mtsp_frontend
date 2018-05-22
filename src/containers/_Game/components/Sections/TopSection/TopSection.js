import React from "react";
import PropTypes from "prop-types";
import classes from "./TopSection.css";
import Clock from "../../../containers/Clock/Clock";
import ChipsPanel from "../../ChipsPanel/ChipsPanel";
import Container from "../Container";

const topSection = props => {
  return (
    <div className={classes.TopSection}>

      {props.systems.map(
        ({ id, color, display, description, position, column, heldChips, short, type }) => {
          var mesg=" Name: " + id + "\n Full Name: " + short + "\n Type: " + type + "\n Description: " + description;
          
          return position ? (

            <div
              key={"top-" + id}
              className={classes.TopCell}
              style={{ borderTopColor: color }}
              title={mesg}
              
              >
              
              

              <Container {...props} column={column} heldChips={heldChips} />

              {display}

              
              
            </div>
          ) : null;
        }
      )}
      <ChipsPanel {...props} balanceChips={props.balanceChips} />
    </div>
  );
};
topSection.propTypes = {
  systems: PropTypes.array,
  balanceChips: PropTypes.array,
  moveChipToSlot: PropTypes.func.isRequired
};
export default topSection;
