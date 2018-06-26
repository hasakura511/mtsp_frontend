'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DragLayer from 'react-dnd/lib/DragLayer';
import classes from "./_Chip.css";
import { toTitleCase, numberWithCommas } from "../../../../util";
import imgSource_25K from "../../../../assets/images/chip-drag-25K.png";
import imgSource_50K from "../../../../assets/images/chip-drag-50K.png";
import imgSource_100K from "../../../../assets/images/chip-drag-0.1M.png";
import imgSource_blank from "../../../../assets/images/practice_chip.png";
import ReactDOM from "react-dom";
function collect (monitor) {
    return {
        sourceOffset: monitor.getSourceClientOffset(),
        displayOffset:monitor.getDifferenceFromInitialOffset()
    };
}

class DragPreview extends Component {
    
    render () {
        const { dragSource, isDragging, dragPreview, canDrag, showHeatmap, isLive, chip, sourceOffset, displayOffset  } = this.props;
        if (!isDragging) { 
            return null; 
        }
        var {chipStyle, title}=this.props.getChipStyle();
        chipStyle['transform']= displayOffset ? `translate(${displayOffset.x}px, ${displayOffset.y}px)` : '';
        chipStyle['position']='relative';
        chipStyle['pointerEvents']='none';
        chipStyle['WebkitTransform']= displayOffset ? `translate(${displayOffset.x}px, ${displayOffset.y}px)` : '';
        chipStyle['zAxis']=10;
        chipStyle['display']='inline-block'
        if (!isDragging) {
            return ( <div></div>)       
        } else {
            //ReactDOM.render(
        return (
            <div className={classes.Chip} id={'bettingchip_' + chip.chip_id} style={chipStyle} title={title}>
            <p>{chip.display}</p>
            </div>
        );
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
    chip: PropTypes.object.isRequired,
    dragSource: PropTypes.func,
    canDrag: PropTypes.bool,
    dragPreview: PropTypes.any,
    isLive:PropTypes.bool.isRequired,
    showHeatmap:PropTypes.func.isRequired,
    accounts:PropTypes.array.isRequired,
    isReadOnly:PropTypes.bool,
    getChipStyle:PropTypes.func,
};


export default DragLayer(collect)(DragPreview);