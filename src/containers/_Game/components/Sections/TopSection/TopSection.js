import React from "react";
import PropTypes from "prop-types";
import classes from "./TopSection.css";
import Clock from "../../../containers/Clock/Clock";
import ChipsPanel from "../../ChipsPanel/ChipsPanel";
import Container from "../Container";
import EditContainer from "../EditContainer";

const topSection = props => {

  var indSize=1/12*100 - 2;
  var idx=0;
  return (
    <div className={classes.TopSection}
      style={{
        width: '100%',

      }}
    >

      {props.systems.map(
        (system) => {
          var { id, color, display, description, position, column, heldChips, short, type } = system;
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
          return position ? (

            <div
              key={"top-" + id + '-' + idx}
              className={classes.TopCell}
              style={{ borderTopColor: color,
                backgroundColor: bgColor,
                text: textColor,
                width: indSize + '%',

              }}
              title={mesg}
              
              >
              {props.isEdit ? (
              <EditContainer {...props}  slotHeatmap={slotHeatmap} strategy={system} column={column} display={display} heldChips={heldChips} 
                bgColor={bgColor}
                textColor={textColor}              
                showOrderDialog={props.showOrderDialog}
                heatmap_selection={props.heatmap_selection}
      
              />) : (
                <Container {...props}  slotHeatmap={slotHeatmap} column={column} heldChips={heldChips} 
                bgColor={bgColor}
                textColor={textColor}              
                showOrderDialog={props.showOrderDialog}
                heatmap_selection={props.heatmap_selection}      
              />
              )}
              {!props.isEdit ? 
                <font color={textColor}>{display}</font>
                : null}
              
              
            </div>
          ) : null;
        }
      )}
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
  heatmap_selection:PropTypes.string,
  isEdit: PropTypes.bool
  

};
export default topSection;
