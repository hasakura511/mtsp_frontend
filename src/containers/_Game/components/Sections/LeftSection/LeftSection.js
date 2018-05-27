import React from "react";
import PropTypes from "prop-types";
import classes from "./LeftSection.css";
import Config, * as SystemTypes from "../../../Config";
import Container from "../Container";

const leftSection = props => {
  return (
    <div className={classes.LeftSection}>
      {props.systems.map(
        ({ id, color, display, description, column, heldChips, short, type }) => {
          var mesg=" Name: " + id + "\n Full Name: " + short + "\n Type: " + type + "\n Description: " + description;

          var sectionHeatmap=props.sectionHeatmap;
          var slotHeatmap={};

          var textColor="#000000";
          var bgColor="#86dde0";
          if (sectionHeatmap != undefined && sectionHeatmap.color_fill != undefined) {
              slotHeatmap['color_fill']=sectionHeatmap.color_fill[column.toString()];
              slotHeatmap['color_text']=sectionHeatmap.color_text[column.toString()];
              slotHeatmap['rank']=sectionHeatmap.rank[column.toString()];
              slotHeatmap['score']=sectionHeatmap.score[column.toString()];
              textColor=slotHeatmap['color_text'];
              bgColor=slotHeatmap['color_fill'];
          }

          return (
            <div
              key={"left-" + id}
              className={classes.LeftCell}
              style={{ borderLeftColor: color, borderRightColor: color }}
              title={mesg}
            >
              <Container {...props}  slotHeatmap={slotHeatmap} column={column} heldChips={heldChips} />
              {display}
            </div>
          );
        }
      )}
    </div>
  );
};
leftSection.propTypes = {
  systems: PropTypes.array,
  sectionHeatmap: PropTypes.object

};
export default leftSection;
