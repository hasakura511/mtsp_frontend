import React from "react";
import PropTypes from "prop-types";
import classes from "./RightSection.css";
import Container from "../Container";
import EditContainer from "../EditContainer";

const rightSection = props => {
  var height=props.maxHeight;
  var size=1 / height * 100 - 10;
  var idx=0;
  return (
    <div className={classes.RightSection}>
      {props.systems.map(
        (system) => {
          var { id, color, display, description, column, heldChips,short, type } = system
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
          idx+=1;
          return (
            <div
              key={"right-" + id + '-' + idx}
              className={classes.RightCell}
              style={{ borderRightColor: color, 
                borderLeftColor: color, 
                backgroundColor: bgColor,
                text: textColor,
                height:size + "%"
              }}
              title={mesg}
            >
            {props.isEdit ? (
              <EditContainer {...props}  slotHeatmap={slotHeatmap} column={column}  strategy={system} display={display} heldChips={heldChips} 
              bgColor={bgColor}
              textColor={textColor}              
              showOrderDialog={props.showOrderDialog}
              heatmap_selection={props.heatmap_selection}

            />) :
            (
            <Container {...props}  slotHeatmap={slotHeatmap} column={column} heldChips={heldChips} 
                bgColor={bgColor}
                textColor={textColor}              
                showOrderDialog={props.showOrderDialog}
                heatmap_selection={props.heatmap_selection}

              />)}
              {!props.isEdit ? 
              <font color={textColor}>{display}</font>
              :null}
            </div>
          );
        }
      )}
    </div>
  );
};
rightSection.propTypes = {
  systems: PropTypes.array,
  sectionHeatmap: PropTypes.object,
  bgColor:PropTypes.string,
  textColor:PropTypes.string,
  showOrderDialog:PropTypes.bool,
  heatmap_selection:PropTypes.string,
  maxHeight:PropTypes.number.isRequired,
  isEdit: PropTypes.bool,
  


};
export default rightSection;
