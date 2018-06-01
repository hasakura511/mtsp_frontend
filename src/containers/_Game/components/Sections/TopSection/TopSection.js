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


          return position ? (

            <div
              key={"top-" + id}
              className={classes.TopCell}
              style={{ borderTopColor: color,
                backgroundColor: bgColor,
                text: textColor,
              }}
              title={mesg}
              
              >
              
              <Container {...props}  slotHeatmap={slotHeatmap} column={column} heldChips={heldChips} 
                bgColor={bgColor}
                textColor={textColor}              
                showOrderDialog={props.showOrderDialog}
                heatmap_selection={props.heatmap_selection}
      
              />

                <font color={textColor}>{display}</font>
              
              
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
  moveChipToSlot: PropTypes.func.isRequired,
  sectionHeatmap: PropTypes.object,
  bgColor:PropTypes.string,
  textColor:PropTypes.string,
  showOrderDialog:PropTypes.bool,
  heatmap_selection:PropTypes.string
  

};
export default topSection;
