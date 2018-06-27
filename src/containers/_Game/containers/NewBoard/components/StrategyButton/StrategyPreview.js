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
        return (
            <div className={classes.StrategyButton} style={chipStyle} title={title}>
                <p>
                <span style={{fontSize:"15px"}}>{strategy.strategy}<br/>
                </span>
                <span style={{fontSize:"9px"}}>
                {strategy.rank}
                </span>
                </p>
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
    strategy: PropTypes.object.isRequired,
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