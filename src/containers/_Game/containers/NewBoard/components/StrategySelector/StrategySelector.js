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
    dictionary_strategy:state.betting.dictionary_strategy,
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
        editData:PropTypes.object.isRequired,
        dictionary_strategy:PropTypes.object.isRequired,
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
        if (button.strategy in this.props.dictionary_strategy) {
          const desc=this.props.dictionary_strategy[button.strategy];
          button.id=button.strategy;
          button.short=desc.board_name;
          button.description=desc.description;
          button.type=desc.type;
        }
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
      var self=this;
      if (newProps.strats != this.props.strats) {
        console.log('Strat Selector Received New Data')
        this.setState(this.getItemList(newProps.strats));
        setTimeout(() => {
          self.setState(self.getItemList(newProps.strats));
          self.forceUpdate();
        }, 1000);
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
        height: "40px",
      };
  
     
      const contentStyle = {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2
      };
  
      /*
      //console.log("strategy selector button:")
      //console.log(item);
      <div style={{marginLeft:"-120px",cursor: "text", pointerEvents:"none", background:"transparent", width:"100%", zIndex:2}}>
              &nbsp;
             </div>

      */

      return (
          <div style={containerStyle}>
            <div style={{pointerEvents:"hover", cursor: "text"}}>
              <StrategyButton id={'select_' + item.strategy } dontDrag={true}  strategy={item.strategy} />
             </div>
             
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
            height:"80px",
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
                  //this.disabled=true;
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
                  //$('#' + id2).trigger('click');
             
             }
           }
          >

                <Dropdown
                  id={id2}
                  //disabled={this.disabled ? true: false}
                  className={'dropdown' }
                  auto={false}
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
                        marginBottom: "-300px",
                      }});
                      this.focusing=true;
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
                      this.focusing=false;
                    }
                  }
                />
               

               
          </span>
          <span id={id3} style={{marginTop:'28px', minHeight:"60px", zIndex:10}}>
                {this.state.item ? 
                <StrategyButton id={'select_' + this.state.item.strategy } strategy={this.state.item} />
                : 
                <div style={{height:"60px"}}></div>
                }
                </span>
          <span id={id4} style={{
              marginLeft:'151px',
              position:'absolute',
          }}>
           
           <img src={'/images/dropdown_rec.png'} onClick={() => {
             
             $('#' + id3).hide();
             $('#' + id).show();
             $('#' + id2).show();
             setTimeout(() => {
              $('#' + id2).trigger('click');
              $('#' + id2).trigger('focus');
              this.setState({contentStyle : {
                width:"150px",
                height:"300px",
                overflowY: "auto",
                overflowX: "hidden",
                zIndex:100,
                marginBottom: "-300px",
                background:'transparent',
                
                //osition:'absolute'
              }});
             }, 100  )
             //$('#' + id2).trigger('click');
             
            
            //console.log($('#'+id2).height)
            //$('#' + id).css('margin-top',"-200px");

            
          }} style={imageStyle}/>
           </span>
        </div>
      );
    }
  }
  