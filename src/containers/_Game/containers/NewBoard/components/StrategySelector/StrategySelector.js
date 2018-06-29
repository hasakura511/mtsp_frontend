import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classes from "./StrategySelector.css";
import { DragSource } from "react-dnd";
import { connect } from "react-redux";
import * as actions from "../../../../../../store/actions";
import { compose } from 'redux'
import Popover from 'react-tiny-popover'
import Sound from 'react-sound';
import { toTitleCase, numberWithCommas } from "../../../../../../util";
import Dropdown from 'react-toolbox/lib/dropdown';
import StrategyButton from '../StrategyButton/StrategyButton';


const stateToProps = state => {
  return {
    //simulatedDate: state.betting.simulatedDate,
    //dashboard_totals:state.betting.dashboard_totals,
    isLive:state.betting.isLive,
    accounts:state.betting.accounts,
    //heatmap_selection:state.betting.heatmap_selection,
    //liveDate:state.betting.liveDate,
  };
};

const dispatchToProps = dispatch => {
  return {
    showHeatmap(id) {
      dispatch(actions.showHeatmap(id));
    },
  };
};


@connect(stateToProps, dispatchToProps)
export default class StrategySelector extends React.Component {

    static propTypes = {
        dragSource: PropTypes.func,
        isDragging: PropTypes.bool,
        canDrag: PropTypes.bool,
        dragPreview: PropTypes.any,
        isLive:PropTypes.bool.isRequired,
        showHeatmap:PropTypes.func.isRequired,
        accounts:PropTypes.array.isRequired,
        isReadOnly:PropTypes.bool,
        items:PropTypes.array.isRequired,
        //heatmap_selection:PropTypes.string
      };
    
      constructor(props) {
        super(props);
        
        var items=[];
        var itemSelected='';
        this.props.items.map(button => {
                if (!itemSelected) 
                    itemSelected=button.strategy;
                items.push({ value:button.strategy, 
                         strategy: button 
                        });
        })
        this.state={
            items:items,
            itemSelected: itemSelected
        }
    
      }


  
    handleItemChange = (value) => {
      this.setState({itemSelected: value});
    };
  
  
    customItem (item) {
      const containerStyle = {
        display: 'flex',
        flexDirection: 'row',
      };
  
     
      const contentStyle = {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2
      };
  
      /*
      console.log("strategy selector button:")
      console.log(item);
      */

      return (
        <div style={containerStyle}>
                <StrategyButton strategy={item.strategy} />
            <span key={item.value} style={{ 
                                            //zIndex: 500 
                                        }}>
            </span>

         
          <div style={contentStyle}>
            <strong>{item.artist}</strong>
            <small>{item.album}</small>
          </div>
        </div>
      );
    }
  
    render () {
        const imageStyle = {
            display: 'flex',
            height: '50px',
            flexGrow: 0,
            marginLeft: '-30px',
            marginTop: "27px",
            marginRight: "30px",
            backgroundColor: 'transparent'
          };
          const containerStyle = {
            display: 'flex',
            flexDirection: 'row',
          };
          const contentStyle = {
              width:"150px",
          };
      
      return (
        <div style={containerStyle}>
          <span style={contentStyle}>
          <Dropdown
            auto={true}
            source={this.state.items}
            onChange={this.handleItemChange}
            template={this.customItem}
            value={this.state.itemSelected}
        
          />
          </span>
          <span style={{ pointerEvents:'none'}}>
           <img src={'/images/dropdown_rec.png'} style={imageStyle}/>
           </span>
        </div>
      );
    }
  }
  
  