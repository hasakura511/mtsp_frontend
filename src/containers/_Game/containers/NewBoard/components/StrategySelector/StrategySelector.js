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
import { Dropdown } from 'react-toolbox/lib/dropdown';
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
        strats:PropTypes.array.isRequired,
        editData:PropTypes.object.isRequired

        //heatmap_selection:PropTypes.string
      };
    
      constructor(props) {
        super(props);
        
        this.state=this.getItemList(props.strats);
      
      }

    getItemList = (strats) => {
      var self=this;
      var items=[];
      var itemSelected='';
      var stratDict={};
      //console.log('Updated Strategy Selector')
      if (strats) {
        strats.map(strat => {
          stratDict[strat.strategy]=strat;
        })
      }
      //console.log(stratDict)
      var item="";
      this.props.items.map(button => {
        if (!strats || !(button.strategy in stratDict)) {
          if (!itemSelected)  {
              itemSelected=button.strategy;
              item=button;
          }
                 items.push({ value:button.strategy, 
              strategy: button 
            }); 
          }
      })
      var res= {
        items:items,
        itemSelected: itemSelected,

        item:item,
        contentStyle : {
          width:"150px",
          overflowY: "visible",
          overflowX: "visible",
          display:'none'
        }
      }
      //console.log(res);
      return res;
      
    }

    componentWillReceiveProps(newProps) {
      if (newProps.strats) {
        this.setState(this.getItemList(newProps.strats));
      }

    }
    handleItemChange = (value) => {
      var item="";
      this.props.items.map(button => {
        if (value == button.strategy) {
          item=button;
        }
      });
      this.setState({itemSelected: value, item:item});
    };
  
  
    customItem = (item) => {
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
      //console.log("strategy selector button:")
      //console.log(item);
      */

      return (
          <div style={containerStyle}>
              <StrategyButton id={'select_' + item.strategy } strategy={item.strategy} />
              
          </div>
        
      );
    }

    render () {
      var self=this;
        const imageStyle = {
            display: 'flex',
            height: '50px',
            flexGrow: 0,
            marginLeft: '-30px',
            marginTop: "27px",
            marginRight: "30px",
            backgroundColor: 'transparent',
            //position:'absolute',
          };
          const containerStyle = {
            display: 'flex',
            flexDirection: 'row',
            width:"200px",
            marginTop:"-22px",
            
          };
          
      var id=Math.round(Math.random() * 1000000);
      var id2=Math.round(Math.random() * 1000000);
      var id3=Math.round(Math.random() * 1000000);
      var id4=Math.round(Math.random() * 1000000);
      return (
        <div style={containerStyle}>
          <span  id={id} style={this.state.contentStyle}
           onMouseLeave={
                () => {
                  this.setState({contentStyle : {
                    width:"150px",
                    overflowY: "visible",
                    overflowX: "visible",
                    opacity: 1,
                    //zIndex:100,
                  }});
                  $('#' + id3).show();
                  $('#' + id).hide();
                  $('#' + id2).hide();
              
             }
           }
          >

                <Dropdown
                  id={id2}
                  className={'dropdown' }
                  auto={true}
                  source={this.state.items}
                  onChange={this.handleItemChange}
                  template={this.customItem}
                  value={this.state.itemSelected}
                  
                  onFocus={
                    () => {
                      this.setState({contentStyle : {
                        width:"150px",
                        height:"300px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        zIndex:100,
                        marginBottom: "-200px",
                      
                      }});
                        
                    }
                  }
                  onBlur={
                    () => {
                      this.setState({contentStyle : {
                        width:"150px",
                        overflowY: "visible",
                        overflowX: "visible",
                        opacity: 1,
                        //zIndex:100,
                      }});
                      $('#' + id3).show();
                      $('#' + id).hide();
                      $('#' + id2).hide();
                    }
                  }
                />
               

               
          </span>
          <span id={id3} style={{marginTop:'28px', zIndex:10}}>
                {this.state.item ? 
                <StrategyButton id={'select_' + this.state.item.strategy } strategy={this.state.item} />
                : null}
                </span>
          <span id={id4} style={{
              marginLeft:'151px',
              position:'absolute',
          }}>
           
           <img src={'/images/dropdown_rec.png'} onClick={() => {
             
             $('#' + id3).hide();
             $('#' + id).show();
             $('#' + id2).show();
             $('#' + id2).trigger('click');
             $('#' + id2).trigger('focus');
             this.setState({contentStyle : {
              width:"150px",
              height:"300px",
              overflowY: "auto",
              overflowX: "hidden",
              zIndex:100,
              marginBottom: "-200px",
              //osition:'absolute'
            }});
            
          }} style={imageStyle}/>
           </span>
        </div>
      );
    }
  }
  