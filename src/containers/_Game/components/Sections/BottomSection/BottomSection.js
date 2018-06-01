import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classes from "./BottomSection.css";
import Container from "../Container";


export default class BottomSection extends PureComponent {
  static propTypes = {
    systems: PropTypes.array,
    topSystems: PropTypes.array,
    sectionHeatmap: PropTypes.object,
    bgColor:PropTypes.string,
    textColor:PropTypes.string,
    showOrderDialog:PropTypes.bool,
    heatmap_selection:PropTypes.string
    
  };

  constructor(props) {
    super(props);

  }

  render() {
    var WIDTH = 60 + (this.props.topSystems.length - 1) * 80;
    return (
          <div className={classes.BottomSection}>
            {this.props.systems.map(
              ({ id, color, display, description, position, column, heldChips, short, type }) => {
                var mesg=" Name: " + id + "\n Full Name: " + short + "\n Type: " + type + "\n Description: " + description;
                
                var sectionHeatmap=this.props.sectionHeatmap;
                var slotHeatmap={};
                var bgColor=this.props.bgColor;
                var textColor=this.props.textColor;

                var score="";
                var rank="";
                if (sectionHeatmap != undefined && sectionHeatmap.color_fill != undefined) {
                    slotHeatmap['color_fill']=sectionHeatmap.color_fill[column.toString()];
                    slotHeatmap['color_text']=sectionHeatmap.color_text[column.toString()];
                    slotHeatmap['rank']=sectionHeatmap.rank[column.toString()];
                    slotHeatmap['score']=sectionHeatmap.score[column.toString()];
                    textColor=slotHeatmap['color_text'];
                    bgColor=slotHeatmap['color_fill'];
                    rank="Rank: " + slotHeatmap['rank'].toString();
                    score="Score: " + slotHeatmap['score'].toString();
                }
                return position ? (
                  <div
                    key={"bottom-" + id}
                    className={classes.BottomCell}
                    style={{
                      borderBottomColor: color,
                      borderTopColor: color,
                      background: bgColor,
                      text: textColor,
                      width: WIDTH > 0 ? WIDTH : 60,
                      textAlign: "center",
                    }}
                    title={mesg}
                  >

                    <Container {...this.props} slotHeatmap={slotHeatmap} column={column} heldChips={heldChips}
                     bgColor={bgColor}
                     textColor={textColor}
                     showOrderDialog={this.props.showOrderDialog}
                     heatmap_selection={this.props.heatmap_selection}
           
                    />
                    <font color={textColor}>{display}</font>

                  </div>
                ) : null;
              }
            )}
          </div>
      ) 
    }
}