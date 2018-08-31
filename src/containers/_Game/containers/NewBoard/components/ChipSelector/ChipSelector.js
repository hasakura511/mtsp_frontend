import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classes from "./ChipSelector.css";
import { DragSource } from "react-dnd";
import { connect } from "react-redux";
import * as actions from "../../../../../../store/actions";
import { compose } from 'redux'
import Popover from 'react-tiny-popover'
import Sound from 'react-sound';
import { toTitleCase, numberWithCommas } from "../../../../../../util";
import Dropdown from 'react-toolbox/lib/dropdown';
import StrategyButton from '../StrategyButton/StrategyButton';
import Chip from '../../../../components/_Chip/_Chip'

const stateToProps = state => {
  return {
    //simulatedDate: state.betting.simulatedDate,
    //dashboard_totals:state.betting.dashboard_totals,
    isLive:state.betting.isLive,
    accounts:state.betting.accounts,
    init_data:state.betting.init_data,
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
export default class ChipSelector extends React.Component {

    static propTypes = {
        dragSource: PropTypes.func,
        isDragging: PropTypes.bool,
        canDrag: PropTypes.bool,
        dragPreview: PropTypes.any,
        isLive:PropTypes.bool.isRequired,
        showHeatmap:PropTypes.func.isRequired,
        accounts:PropTypes.array.isRequired,
        isReadOnly:PropTypes.bool,
        checkLock:PropTypes.func.isRequired,
        itemSelected:PropTypes.string.isRequired,
        editData:PropTypes.object.isRequired,
        init_data:PropTypes.object.isRequired
        //heatmap_selection:PropTypes.string
      };
    
      constructor(props) {
        super(props);
        
        var items=[];
        var itemSelected=this.props.itemSelected;
        console.log('item selected');
        console.log(this.props.itemSelected);
        items.push({ value: 'All',
          chip: undefined
        });
        props.accounts.map(account => {
          if (!itemSelected) {
                itemSelected='All';
          }
          items.push({ value:account.chip_id, 
                    chip: Object.assign({}, account)
                    
                  });
        })
        this.state={
            items:items,
            itemSelected: itemSelected
        }
    
      }


  
    handleItemChange = (value) => {
      console.log(value);
      var self=this;
      this.setState({itemSelected: value});
      if (value != 'All') {
        this.props.accounts.map(account => {
          if (value == account.chip_id) {
              var last_date=account.date.replace(/-/g,'');
              self.props.checkLock(false, account.chip_id, self.props.init_data.last_date, account.portfolio);
          }
        })
      } else {
        self.props.checkLock(true, "", "", "", true);
      }
    };
  
  
    customItem (item) {
      const containerStyle = {
        display: 'flex',
        flexDirection: 'row'
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
            <span key={item.value}>
                {item.chip ? 
                  <Chip chip={item.chip} isReadOnly={true} isNewBoard={true} />
                  : <div style={{fontSize:'16px',marginTop:'12px', color:'black'}}><b>{item.value}</b></div>}
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
            height: '48px',
            flexGrow: 0,
            marginLeft: '-30px',
            marginTop: "30px",
            backgroundColor: 'transparent'
          };
          const containerStyle = {
            display: 'flex',
            flexDirection: 'row'
          };
          const contentStyle = {
              width:"80px"
          };
      
      return (
        <div style={containerStyle}>
          <span style={contentStyle}>
          <Dropdown
            auto={true}
            source={this.state.items.sort(function(b, a){return parseInt(b.account_value) - parseInt(a.account_value)})}
            onChange={this.handleItemChange}
            template={this.customItem}
            value={this.state.itemSelected}
        
          />
          
          </span>
          <span>
           <img src={'/images/dropdown_rec.png'} style={imageStyle}/>
           </span>
        </div>
      );
    }
  }
  
  