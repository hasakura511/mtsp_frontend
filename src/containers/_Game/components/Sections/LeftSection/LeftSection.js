import React from "react";
import PropTypes from "prop-types";
import classes from "./LeftSection.css";
import Config, * as SystemTypes from "../../../Config";
import Container from "../Container";
import EditContainer from "../EditContainer";

const leftSection = props => {
  var height=props.maxHeight;
  var size=1 / height * 100 - 10;
  return (
    <div className={classes.LeftSection}>
      {props.systems.map(
        ({ id, color, display, description, column, heldChips, short, type }) => {
          var mesg=" Name: " + id + "\n Full Name: " + short + "\n Type: " + type + "\n Description: " + description;
          
          var sectionHeatmap=props.sectionHeatmap;
          var slotHeatmap={};

          var bgColor=props.bgColor;
          var textColor=props.textColor;
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
              style={{ borderLeftColor: color, 
                borderRightColor: color,
                backgroundColor: bgColor,
                text: textColor,
                height: size + '%',
              }}
              title={mesg}
            >
            {props.isEdit ? (
             <EditContainer {...props}  slotHeatmap={slotHeatmap} column={column} display={display} heldChips={heldChips} 
                bgColor={bgColor}
                textColor={textColor}         
                showOrderDialog={props.showOrderDialog}
                heatmap_selection={props.heatmap_selection}
           
              />
            ) : (
              <Container {...props}  slotHeatmap={slotHeatmap} column={column} heldChips={heldChips} 
                bgColor={bgColor}
                textColor={textColor}         
                showOrderDialog={props.showOrderDialog}
                heatmap_selection={props.heatmap_selection}
           
              />
            )}
              <font color={textColor}>{display}</font>
            </div>
          );
        }
      )}
    </div>
  );
};
leftSection.propTypes = {
  systems: PropTypes.array,
  sectionHeatmap: PropTypes.object,
  bgColor:PropTypes.string,
  textColor:PropTypes.string,
  showOrderDialog:PropTypes.bool,
  heatmap_selection:PropTypes.string,
  maxHeight:PropTypes.number.isRequired,
  isEdit: PropTypes.bool

};
export default leftSection;
