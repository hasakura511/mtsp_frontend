import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classes from "./BottomSection.css";
import Container from "../Container";
import EditContainer from "../EditContainer";


export default class BottomSection extends PureComponent {
  static propTypes = {
    systems: PropTypes.array,
    topSystems: PropTypes.array,
    sectionHeatmap: PropTypes.object,
    bgColor:PropTypes.string,
    textColor:PropTypes.string,
    showOrderDialog:PropTypes.bool,
    heatmap_selection:PropTypes.string,
    isEdit: PropTypes.bool
    
  };

  constructor(props) {
    super(props);

  }

  render() {
    var WIDTH = 60 + (this.props.topSystems.length - 1) * 80;
    var idx=0;
    return (
          <div className={classes.BottomSection}>
            {this.props.systems.map(
              (system) => {
                var { id, color, display, description, position, column, heldChips, short, type } = system;
                var mesg=" Name: " + id + "\n Full Name: " + short + "\n Type: " + type + "\n Description: " + description;
                if (id == 'Optional' || id =='Required') {
                  mesg="Drag your desired strategy here."
                }
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
                    if (slotHeatmap['rank']) 
                      rank="Rank: " + slotHeatmap['rank'].toString();
                    else
                      rank=''
                    if (slotHeatmap['score'])
                      score="Score: " + slotHeatmap['score'].toString();
                    else
                      score=''
                }
                idx+=1;
                return position ? (
                  <div
                    key={"bottom-" + id + '-' + idx}
                    className={classes.BottomCell}
                    style={{
                      borderBottomColor: color,
                      borderTopColor: color,
                      background: bgColor,
                      text: textColor,
                      //width: WIDTH > 0 ? WIDTH : 60,
                      textAlign: "center",
                    }}
                    title={mesg}
                  >
                    {this.props.isEdit ? 
                    <EditContainer {...this.props} slotHeatmap={slotHeatmap} column={column} strategy={system} display={display} heldChips={heldChips}
                     bgColor={bgColor}
                     textColor={textColor}
                     showOrderDialog={this.props.showOrderDialog}
                     heatmap_selection={this.props.heatmap_selection}
           
                    />
                    :
                    <Container {...this.props} slotHeatmap={slotHeatmap} column={column} heldChips={heldChips}
                     bgColor={bgColor}
                     textColor={textColor}
                     showOrderDialog={this.props.showOrderDialog}
                     heatmap_selection={this.props.heatmap_selection}
           
                    />
                    }
                  {!this.props.isEdit ? 
                    <font color={textColor}>{display}</font>
                     : null }
                  </div>
                ) : null;
              }
            )}
          </div>
      ) 
    }
}