'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DragLayer from 'react-dnd/lib/DragLayer';
import classes from "./StrategyButton.css";
import { toTitleCase, numberWithCommas } from "../../../../../../util";

import ReactDOM from "react-dom";
function collect (monitor) {
    return {
        sourceOffset: monitor.getSourceClientOffset(),
        displayOffset:monitor.getDifferenceFromInitialOffset()
    };
}

class DragPreview extends Component {
    
    render () {
        const { dragSource, isDragging, dragPreview, canDrag, showHeatmap, isLive, strategy, sourceOffset, displayOffset  } = this.props;
        if (!isDragging) { 
            return null; 
        }
        var bgColor=strategy.color_fill;
        var chipBgColor=strategy.color_fill;
        var textColor=strategy.color_text;
        var rank=strategy.rank;

        var {chipStyle, title}=this.props.getChipStyle();
        chipStyle['transform']= displayOffset ? `translate(${displayOffset.x}px, ${displayOffset.y}px)` : '';
        chipStyle['pointerEvents']='none';
        chipStyle['WebkitTransform']= displayOffset ? `translate(${displayOffset.x}px, ${displayOffset.y}px)` : '';
        chipStyle['zIndex']=10000;
        /*
        chipStyle['position']='relative';
        chipStyle['display']='inline-block'
        */
        if (!isDragging) {
            return ( <div></div>)       
        } else {
            //ReactDOM.render(
                if (this.props.viewMode && this.props.viewMode=='tab') {
                    return (
            
                      <div
                    className={classes.TabContainer}
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      opacity: 1,
                      textAlign: "center",
                      cursor:'pointer',
                      transform:chipStyle['transform'],
                      pointerEvents:chipStyle['pointerEvents'],
                      WebkitTransform:chipStyle['WebkitTransform'],
                      zIndex: 1000000,
                    }}
                  >
                          <span style={{
                            "marginTop": "0px",
                            "paddingTop": "5px",
                            "paddingBottom": "5px",
                            "marginLeft": "-50%",
                            "whiteSpace": "nowrap",
                            backgroundColor: bgColor,
                            color: textColor,
                            opacity: 1,
                            position:"absolute",
                            textAlign: "center",
                            height:"24px",
                            width:"100%",
                            lineHeight:"10px"
                        }}>
                            <br/>
                            <font style={{opacity: 1}} color={textColor}>{strategy.display}</font>
                            <br/>
                            <span style={{ "fontSize":"9px" }}>{strategy.rank}</span>
                        </span>
                        </div>
                    )
                } else {
                        return (

                            <div className={classes.StrategyButton2} style={chipStyle} title={title}>
                                 <div style={{marginTop:"-10px", fontSize:"15px"}}>{strategy.strategy}
                                    <div style={{marginTop:"-2px", fontSize:"9px"}}>
                                    {strategy.rank}
                                    </div>
                                    
                                </div>

                            </div>
                        );
                    }
    }
    }
}

DragPreview.propTypes = {
    isDragging: PropTypes.bool,
    sourceOffset: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }),
    displayOffset: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }),
    strategy: PropTypes.object.isRequired,
    dragSource: PropTypes.func,
    canDrag: PropTypes.bool,
    dragPreview: PropTypes.any,
    isLive:PropTypes.bool.isRequired,
    showHeatmap:PropTypes.func.isRequired,
    accounts:PropTypes.array.isRequired,
    isReadOnly:PropTypes.bool,
    getChipStyle:PropTypes.func,
    viewMode:PropTypes.string
};


export default DragLayer(collect)(DragPreview);