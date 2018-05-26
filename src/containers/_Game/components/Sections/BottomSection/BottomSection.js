import React from "react";
import PropTypes from "prop-types";
import classes from "./BottomSection.css";
import Container from "../Container";

const bottomSection = props => {
  const WIDTH = 60 + (props.topSystems.length - 1) * 80;
  return (
    <div className={classes.BottomSection}>
      {props.systems.map(
        ({ id, color, display, description, position, column, heldChips, short, type }) => {
          var mesg=" Name: " + id + "\n Full Name: " + short + "\n Type: " + type + "\n Description: " + description;
          var sectionHeatmap=props.sectionHeatmap;
          var slotHeatmap={};

          var textColor="#000000";
          if (sectionHeatmap.color_fill != undefined) {
              slotHeatmap['color_fill']=sectionHeatmap.color_fill[column.toString()];
              slotHeatmap['color_text']=sectionHeatmap.color_text[column.toString()];
              slotHeatmap['rank']=sectionHeatmap.rank[column.toString()];
              slotHeatmap['score']=sectionHeatmap.score[column.toString()];
              textColor=slotHeatmap['color_text'];
          }
          return position ? (
            <div
              key={"bottom-" + id}
              className={classes.BottomCell}
              style={{
                borderBottomColor: color,
                borderTopColor: color,
                text: textColor,
                width: WIDTH > 0 ? WIDTH : 60
              }}
              title={mesg}
            >
              <Container {...props} slotHeatmap={slotHeatmap} column={column} heldChips={heldChips} />
              {display}
            </div>
          ) : null;
        }
      )}
    </div>
  );
};
bottomSection.propTypes = {
  systems: PropTypes.array,
  topSystems: PropTypes.array,
  sectionHeatmap: PropTypes.object
};
export default bottomSection;
