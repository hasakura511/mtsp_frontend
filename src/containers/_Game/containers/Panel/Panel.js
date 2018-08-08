import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Panel.css";
import Slot from "../Slot/Slot";
import RiskStrip from "../../components/_RiskStrip/_RiskStrip";
import Config from "../../Config";
import ChipsConfig from "../../ChipsConfig";
import BottomSection from "../../components/Sections/BottomSection/BottomSection";
import LeftSection from "../../components/Sections/LeftSection/LeftSection";
import RightSection from "../../components/Sections/RightSection/RightSection";
import TopSection from "../../components/Sections/TopSection/TopSection";
import OrderDialog from "../OrderDialog/OrderDialog";
import LockdownDialog from "../LockdownDialog/LockdownDialog";
import LeaderDialog from "../LeaderDialog/LeaderDialog";
import axios from "../../../../axios-gsm";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import { toSlashDate,  getDateNowStr  } from "../../../../util";
import Title from "../OrderDialog/OffOrderDialogTitle";
import Sound from 'react-sound';
import ChipsPanel from "../../components/ChipsPanel/ChipsPanel";
import RemoveContainer from "../../components/Sections/RemoveContainer"
import Bounce from 'bounce.js'
/**
 * returns state to `Props` mapping object with keys that would later become props.
 * @function stateToProps
 * @param {Object} state redux current state
 * @returns {Object} props enhancement object
 */
const stateToProps = state => {
  return { simulatedDate: state.betting.simulatedDate,
           heatmap:state.betting.heatmap,
           heatmap_selection:state.betting.heatmap_selection,
           themes:state.betting.themes,
           mute:state.betting.mute,
           performance_account_id:state.betting.performance_account_id,
           performance_chip:state.betting.performance_chip,
           show_lockdown_dialog:state.betting.show_lockdown_dialog,
           show_leader_dialog:state.betting.show_leader_dialog,
           dictionary_strategy:state.betting.dictionary_strategy,
           email:state.auth.email,
          };
};

/**
 * returns distpatch to `Props` mapping object with keys that would later become props.
 * @function dispatchToProps
 * @param {function} dispatch dispatch redux action dispatcher function
 * @returns {Object} props enhancement object
 */
const dispatchToProps = dispatch => {
  return {

    addLast3DaysProfit(last3DaysProfit) {
      dispatch(actions.addLast3DaysProfit(last3DaysProfit));
    },
    addBet(bet) {
      dispatch(actions.addBet(bet));
    },
    showDialog() {
      dispatch(actions.showDialog(...arguments));
    },
    silenceDialog() {
      dispatch(actions.silenceDialog());
    },
    addTimedToaster(toaster) {
      dispatch(actions.addTimedToaster(toaster, -1));
    },
    showHeatmap(id) {
      dispatch(actions.showHeatmap(id));
    },
    showLockdownDialog(show) {
      dispatch(actions.showLockdownDialog(show));
    },
    showLeaderDialog(show) {
      dispatch(actions.showLeaderDialog(show));
    },

  };
};

const blankSystem = {
  id: "BLANK",
  ...Config.BLANK
};

// Redux connect
@connect(stateToProps, dispatchToProps)
/**
 * Panel component that holds the state of the board game and all the board components.
 *
 * @class Panel
 * @extends {Component}
 *
 */
export default class Panel extends Component {

  
  static propTypes = {
    topSystems: PropTypes.array,
    bottomSystems: PropTypes.array,
    leftSystems: PropTypes.array,
    rightSystems: PropTypes.array,
    balanceChips: PropTypes.array,
    bettingChips: PropTypes.array,
    accounts: PropTypes.array.isRequired,
    addBettingChip: PropTypes.func.isRequired,
    addLast3DaysProfit: PropTypes.func.isRequired,
    moveToBalance: PropTypes.func.isRequired,
    addBet: PropTypes.func.isRequired,
    simulatedDate: PropTypes.string.isRequired,
    showDialog: PropTypes.func.isRequired,
    silenceDialog: PropTypes.func.isRequired,
    addTimedToaster: PropTypes.func.isRequired,
    isLive:PropTypes.bool.isRequired,
    isPractice:PropTypes.bool,
    heatmap:PropTypes.object.isRequired,
    showHeatmap:PropTypes.func.isRequired,
    heatmap_selection:PropTypes.string,
    themes:PropTypes.object,
    mute:PropTypes.bool.isRequired,
    performance_account_id:PropTypes.string.isRequired,
    performance_chip:PropTypes.object,
    show_lockdown_dialog:PropTypes.bool.isRequired,
    show_leader_dialog:PropTypes.bool.isRequired,
    showLockdownDialog:PropTypes.func.isRequired,
    isReadOnly:PropTypes.bool,
    initializeLive:PropTypes.func,
    isEdit:PropTypes.bool,
    email:PropTypes.string,
    editData:PropTypes.object,
    optimize:PropTypes.bool,
    optimizeDone:PropTypes.func,
    updateStrats:PropTypes.func,
    dictionary_strategy:PropTypes.object,
    optimizeData:PropTypes.array,
  };

  /**
   * Creates an instance of Panel.
   * @constructor
   * @param {Object} props
   * @memberof Panel
   *
   *
   *
   */
  constructor(props) {
    super(props);
    this.state = {
      /**
       * @example slot = {topSystem={}, bottomSystem: {}, leftSystem: {}, rightSystem: {}, heldChips: []}
       *
       *
       */
      slots: [],
      maxHeight: 0,
      maxWidth: 0,
      topSystems:
        props.topSystems && props.topSystems.length
          ? props.topSystems
          : [blankSystem],
      bottomSystems:
        props.bottomSystems && props.bottomSystems.length
          ? props.bottomSystems
          : [blankSystem],
      leftSystems: props.leftSystems,
      rightSystems: props.rightSystems,
      topStrats:[],
      rightStrats:[],
      leftStrats:[],
      bottomStrats:[],
      /**
       * Related to Order Dialogue
       */
      // showOrderDialog: true,
      // orderChip: {
      //   accountId: "5K_0_1516105730",
      //   display: "5K",
      //   accountValue: 5000,
      //   portfolio: ["TU", "BO"],
      //   qty: "{'TU': 2, 'BO': 1}",
      //   target: 250,
      //   totalMargin: 1925,
      //   maxCommissions: 8.100000000000001,
      //   created: 1516105728,
      //   updated: 1516105730,
      //   count: 1
      // },
      // orderSlot: {
      //   position: 7,
      //   topSystem: {
      //     id: "RISK_OFF",
      //     color: "black",
      //     position: "top",
      //     display: "Risk Off",
      //     description:
      //       "Opposite of RiskOn signals. (Fixed Signals consisting of Long precious metals and bonds, Short all other risky assets)",
      //     column: "riskOff"
      //   },
      //   bottomSystem: {
      //     id: "HIGHEST_EQ",
      //     color: "#0049c1",
      //     position: "bottom",
      //     display: "Highest Eq.",
      //     description:
      //       "Machine learning system prioritizing signals from best performing systems.",
      //     column: "highEq"
      //   },
      //   leftSystem: {
      //     id: "PREVIOUS_1_DAY",
      //     color: "pink",
      //     position: "left",
      //     display: "Previous (1 day)",
      //     description:
      //       "Previous trading days signals. For example if gold went up the previous day, the signal would be LONG.",
      //     column: "prev1"
      //   },
      //   rightSystem: {
      //     id: "PREVIOUS_5_DAYS",
      //     color: "yellow",
      //     position: "right",
      //     display: "Previous (5 days)",
      //     description:
      //       "Previous trading days signals. For example if gold went up the previous day, the signal would be LONG.",
      //     column: "prev5"
      //   },
      //   heldChips: []
      // }
      showOrderDialog: false,
      showClearDialog:false,
      orderChip: null,
      orderSlot: null,
      rankingLoading: true,
      rankingData: [],
      rankingError: null,
      performance_account_id:'',
      isPerformance:false,
      isReadOnly: props.isReadOnly ? true : false,
      orderAnti: false,
      isEditComplete: false,

    };
    this._isMounted = false;
  }

  /**
   * @function componentWillMount Component will mount hook of Panel component that builds the [static] board
   * @memberof Panel
   *
   *
   *
   */

  componentWillMount() {

    if (this.props.isEdit)
      this.makeEditBoard(this.props)
    else
      this.makeBoard(this.props);
  }

  componentWillReceiveProps(newProps) {
    var self=this;

    if (this.state.isReadOnly) 
      return;
    //console.log("Panel received new prop");
    //console.log(newProps);
    ////console.log(newProps.balanceChips);
    ////console.log(newProps.bettingChips);
    if (this.props.isEdit) {
      if (newProps.optimizeData && (newProps.optimize || this.props.optimize)) {
        self.optimizeBoard();
      }
    }
    if (newProps.performance_account_id && newProps.performance_account_id != this.state.performance_account_id) {
      var chip='';
      this.props.accounts.map(account => {
          if (account.account_id == newProps.performance_account_id)
            chip=account;
      });
      if (newProps.performance_chip) {
        //console.log('Performance Chip');
        chip=newProps.performance_chip;
        //console.log(chip);
      }
      self.setState({showOrderDialog:true, performance_account_id:newProps.performance_account_id, orderChip:chip, isPerformance:true});
      //self.forceUpdate();
    } else if (!newProps.performance_account_id) {
      this.setState({performance_account_id:''});
    }

    if (this.state.performance_account_id && this.state.isPerformance) {
      if (newProps.accounts) {
          var orderChip='';
          var updated=false;
          newProps.accounts.map(account => {
              if (account.account_id == this.state.performance_account_id) {
                orderChip=account;
                self.setState({orderChip:orderChip});
                //console.log("new state for chip " + account.account_id);
                //console.log(orderChip);
                updated=true;
              }
          });
          if (updated) 
            self.forceUpdate();

      }
    }
    if (!this.props.isEdit) {
      this.makeBoard(newProps);
    }
  }

  /**
   *
     * @function moveChipToSlot Puts the betting of size of the chip on a particular position
   * @param {{accountId: string, display: string}} chip
   * @param {int|string} slotNumber
   *
   *
   *
   */

  
  makeEditBoard = (propData) => {
    
    const blankSystem = {
      id: "BLANK",
      color: "transparent",
      position: "bottom",
      display: "Blank",
      description: "Blank",
      column: "Blank",
      isUnfilled:true,
      heldChips: []
    };
    var reqColor="orange";
    var reqText="white";
    var reqDesc="Required";
    if (this.props.editData && this.props.editData.themes) {
      reqColor=this.props.editData.themes.required.color_fill;
      reqText=this.props.editData.themes.required.color_text;
      reqDesc=this.props.editData.themes.required.text;
    }

    var optColor="skyblue";
    var optText="white";
    var optDesc="Optional";
    if (this.props.editData && this.props.editData.themes) {
      optColor=this.props.editData.themes.optional.color_fill;
      optText=this.props.editData.themes.optional.color_text;
      optDesc=this.props.editData.themes.optional.text;
    }
    const reqSystem = {
      id: "BLANK",
      color: "transparent",
      color_fill: reqColor,
      color_text: reqText,
      position: "bottom",
      display: reqDesc,
      description: reqDesc,
      isUnfilled:true,

      column: "Required",
      heldChips: []
    };
    const optSystem = {
      id: "OPTIONAL",
      color: "transparent",
      color_fill: optColor,
      color_text: optText,
      position: "bottom",
      display: optDesc,
      description: optDesc,
      isUnfilled:true,
      column: "Optional",
      heldChips: []
    };
    var { topSystems, leftSystems, rightSystems, bottomSystems } = propData;
    var {topStrats, leftStrats, rightStrats, bottomStrats} = this.state;
    if (propData.topStrats)
      topStrats=propData.topStrats;
    if (propData.leftStrats)
      leftStrats=propData.leftStrats;
    if (propData.rightStrats)
      rightStrats=propData.rightStrats;
    if (propData.bottomStrats)
      bottomStrats=propData.bottomStrats;
        
    var isEdit=this.props.isEdit;
    console.log('Making Edit Board')
    //console.log(propData)
    //console.log(topStrats)
    //console.log(leftStrats)
    //console.log(rightStrats)
    //console.log(bottomStrats)

    var isEditComplete=true;

    topSystems =  topStrats.slice(0);
    if (! topSystems.length ) {
      isEditComplete=false;
      topSystems.push(Object.assign({}, reqSystem));
    }
    var hasBottomReq=false;
    bottomSystems=bottomStrats.slice(0);
    if (! bottomSystems.length ) {
      isEditComplete=false;
      bottomSystems.push(Object.assign({}, reqSystem));
      hasBottomReq=true;
    }

    leftSystems= leftSystems && leftSystems.length ? leftSystems : [Object.assign({}, optSystem)]
    rightSystems= rightSystems && rightSystems.length ? rightSystems : [Object.assign({}, optSystem)]
 

    var topStratsLen=topStrats.length;
    if (topStrats.length > 0 && topStrats.length <= 6) {
        topSystems=topStrats.slice(0);
        var rem=12%topStrats.length;
        var bottomNum=Math.ceil(12/topStrats.length);
        var hasReq=false;
        if (bottomStrats.length <= bottomNum) {
          if (rem) {
            isEditComplete=false;
            topSystems.push(Object.assign({}, reqSystem))
            topStratsLen+=1;
            hasReq=true;
          } 
        }
        if (topStrats.length < 6 && !hasReq)
          topSystems.push(Object.assign({}, optSystem))
        bottomNum=Math.ceil(12/topStratsLen);
        if (bottomStrats.length < bottomNum) {
          var systems=bottomStrats.slice(0);
          var sysToAdd=bottomNum-bottomStrats.length;
          for (var i=0; i < sysToAdd; i++) {
            isEditComplete=false;
            systems.push(Object.assign({}, reqSystem));
            hasBottomReq=true;
          }
          bottomSystems=systems;
        }
    } 

    if (topStrats.length == 0 && bottomStrats.length < 12 && bottomSystems.length < 12 && !hasBottomReq) {
      if (topStratsLen == 0)
        topStratsLen+=1;

      bottomNum=Math.ceil(12/topStratsLen);
      if (bottomStrats.length < bottomNum) {
        var systems2=bottomStrats.slice(0);
        var sysToAdd2=bottomNum-bottomStrats.length;
        for (var i2=0; i2 < sysToAdd2; i2++) {
          isEditComplete=false;
          systems2.push(Object.assign({}, reqSystem));
          hasBottomReq=true;
        }
        bottomSystems=systems2;
      }


    }
    var numToAdd=0;
    var k=0;
    var heightMax=3;
    if (leftStrats.length >= 0) {
      leftSystems=leftStrats.slice(0);
      if (leftSystems.length + 1<= heightMax) {
        leftSystems.push(Object.assign({}, optSystem))
      }
      numToAdd=rightStrats.length-leftStrats.length;
      if (numToAdd > 0) {
        for (k=0; k < numToAdd; k++) {
          if (leftSystems.length + 1<= heightMax) {
            leftSystems.push(Object.assign({}, optSystem))
          }
        }
      }

      
    }
    if (rightStrats.length >= 0) {
      rightSystems=rightStrats.slice(0);
      if (rightSystems.length  + 1 <= heightMax) {
        rightSystems.push(Object.assign({}, optSystem))
      }
      numToAdd=leftStrats.length-rightStrats.length;
      if (numToAdd > 0) {
        for (k=0; k < numToAdd; k++) {
          if (rightSystems.length  + 1 <= heightMax) {
            rightSystems.push(Object.assign({}, optSystem))
          }
        }
      }
      
    }

    var slots = [],
    sideSystems = [],
    maxHeight = Math.max(leftSystems.length, rightSystems.length),
    maxWidth = 12;
   
    let position = 1;
    
    for (let xIndex = 0; xIndex < maxWidth; xIndex++) {
      for (let yIndex = 0; yIndex < maxHeight; yIndex++) {
          //slot = slots[xIndex * maxHeight + yIndex];
          //var sideSystem=sideSystems[yIndex];
          var topnum=topStrats.length == 0 ? 1 : topStratsLen;
          var topIdx=xIndex % topnum;
          var num=topStrats.length == 0 ? 1 : topStratsLen;
          var bottomIdx=Math.min(bottomSystems.length-1, Math.floor(xIndex / num))
          var topSystem=topSystems[topIdx];
          var bottomSystem=bottomSystems[bottomIdx];
          slots.push({
            leftSystem: leftSystems[yIndex],
            rightSystem:  rightSystems[yIndex],
            topSystem:topSystem,
            bottomSystem:bottomSystem,
            position
          });
          position++;
        }
      }
    
    topSystems=topSystems.map(item => {
      item.id=item.display;
      item.column='top'
      item.position=item.column;
      item.heldChips=[];
      if (item.id in this.props.dictionary_strategy) {
        const desc=this.props.dictionary_strategy[item.id];
        item.short=desc.board_name;
        item.description=desc.description;
        item.type=desc.type;
      }
      return item;
    })
    bottomSystems=bottomSystems.map(item => {
      item.id=item.display;
      item.column='bottom'
      item.position=item.column;
      item.heldChips=[];
      if (item.id in this.props.dictionary_strategy) {
        const desc=this.props.dictionary_strategy[item.id];
        item.short=desc.board_name;
        item.description=desc.description;
        item.type=desc.type;
      }
      return item;
    })
    leftSystems=leftSystems.map(item => {
      item.id=item.display;
      item.column='left'
      item.position=item.column;
      item.heldChips=[];
      if (item.id in this.props.dictionary_strategy) {
        const desc=this.props.dictionary_strategy[item.id];
        item.short=desc.board_name;
        item.description=desc.description;
        item.type=desc.type;
      }
      return item;
    })
    console.log(rightSystems);
    rightSystems=rightSystems.map(item => {
      item.id=item.display;
      item.column='right'
      item.position=item.column;
      item.heldChips=[];
      if (item.id in this.props.dictionary_strategy) {
        const desc=this.props.dictionary_strategy[item.id];
        item.short=desc.board_name;
        item.description=desc.description;
        item.type=desc.type;
      }
      return item;
    })
    this.setState({ slots, maxHeight, maxWidth, topStrats, leftStrats, rightStrats, bottomStrats, topSystems, bottomSystems, leftSystems, rightSystems, isEditComplete });
    console.log("Making Edit Board Complete");
    console.log(topSystems);
    console.log(leftSystems);
    console.log(rightSystems);
    console.log(bottomSystems);
    const liveStrats = [...topStrats, ...leftStrats,...rightStrats,...bottomStrats];
    console.log(liveStrats);
    this.props.updateStrats(liveStrats);
    //this._isMounted = true;
    
  }
  makeBoard = (propData) => {
    const { topSystems, leftSystems, rightSystems, bottomSystems } = propData;
    var isEdit=this.props.isEdit;
    if (isEdit) {
      console.log("make board");
      //this.makeEditBoard(propData);
    } else {
      this.setState({
        topSystems: topSystems && topSystems.length ? topSystems : [blankSystem],
        bottomSystems:
          bottomSystems && bottomSystems.length ? bottomSystems : [blankSystem],
        leftSystems: leftSystems,
        rightSystems: rightSystems
      });
      var slots = [],
        sideSystems = [],
        maxHeight = Math.max(leftSystems.length, rightSystems.length),
        maxWidth =
          topSystems.length * bottomSystems.length ||
          topSystems.length ||
          bottomSystems.length;

      if (maxHeight < 3) maxHeight+=1;
      
      for (let i = 0; i < maxHeight; i++) {
        sideSystems.push({
          left: leftSystems[i] || blankSystem,
          right: rightSystems[i] || blankSystem
        });
      }
      let position = 1;
      

      bottomSystems.forEach(bottomSystem => {
        topSystems.forEach(topSystem => {
          sideSystems.forEach(sideSystem => {
            slots.push({
              leftSystem: sideSystem.left,
              rightSystem: sideSystem.right,
              topSystem,
              bottomSystem,
              position
            });
            position++;
          });
        });
      });
      this.setState({ slots, maxHeight, maxWidth });
      this._isMounted = true;
    }
  }
  

  optimizeBoard = () => {
    var self=this;
    if (this.props.isEdit) {
      console.log('Panel: Optimize board called')
      //this.clearStrats();
      var board=  this.props.optimizeData; //editData.optimized_board);
      console.log(board);
      var topStrats=[];
      var rightStrats=[];
      var leftStrats=[];
      var bottomStrats=[];
      var stratDict={};
      //console.log(board);
      Object.keys(this.props.editData.strat_dict).map(key => {
        var items=this.props.editData.strat_dict[key];
        Object.keys(items).map(key2 => {
          var items2=items[key2];
          items2.map(item => {
            //console.log(item);
            item.id=item.strategy;
            item.display=item.strategy;
            item.color=item.color_border;
            stratDict[item.strategy]=Object.assign({}, item);
          })
  
        })
      })
      //console.log(stratDict);
      var s={};
      board.map(strat => {
        //console.log(strat);
        if (strat.position == 'top') {
          if (strat.id in stratDict) {
            s=stratDict[strat.id]
            topStrats.push(Object.assign({}, s));
          }
        }
        if (strat.position == 'left') {
          if (strat.id in stratDict) {
            s=stratDict[strat.id]
            leftStrats.push(Object.assign({}, s));
          }
        }
        if (strat.position == 'right') {
          if (strat.id in stratDict) {
            s=stratDict[strat.id]
            rightStrats.push(Object.assign({}, s));
          }
        }
        if (strat.position == 'bottom') {
          if (strat.id in stratDict) {
            s=stratDict[strat.id]
            bottomStrats.push(Object.assign({}, s));
          }
        }
      })
      console.log('boardstrats')
      //console.log(topStrats)
      //console.log(leftStrats)
      //console.log(rightStrats)
      //console.log(bottomStrats)
      self.setState({
        topStrats:topStrats,
        leftStrats:leftStrats,
        bottomStrats:bottomStrats,
        rightStrats:rightStrats
      });

      var obj={};
      obj.topSystems=topStrats;
      obj.leftSystems=leftStrats;
      obj.bottomSystems=bottomStrats;
      obj.rightSystems=rightStrats;
      obj.topStrats=topStrats;
      obj.leftStrats=leftStrats;
      obj.rightStrats=rightStrats;
      obj.bottomStrats=bottomStrats;
      obj.isEdit=true;
      self.makeEditBoard(obj);
      this.props.optimizeDone();
    }
  }
  clearStrats = () => {
    var {
      topStrats,
      rightStrats,
      bottomStrats,
      leftStrats
    } = this.state;
    console.log("Clear Strat")

    topStrats=[];
    rightStrats=[];
    bottomStrats=[]
    leftStrats=[];
    /*
      this.setState({
        topStrats:topStrats,
        leftStrats:leftStrats,
        bottomStrats:bottomStrats,
        rightStrats:rightStrats
      });
      */

      var obj={};
      obj.topSystems=topStrats;
      obj.leftSystems=leftStrats;
      obj.bottomSystems=bottomStrats;
      obj.rightSystems=rightStrats;
      obj.isEdit=true;
      obj.topStrats=topStrats;
      obj.leftStrats=leftStrats;
      obj.rightStrats=rightStrats;
      obj.bottomStrats=bottomStrats;

      this.makeEditBoard(obj);
  }

  removeStratFromSlot = (strat) => {
      var {
        topStrats,
        rightStrats,
        bottomStrats,
        leftStrats
      } = this.state;
      console.log("Remove Strat")
      console.log(strat);
      strat.display=strat.strategy;
      strat.color=strat.color_border;

      var strats=[];
      topStrats=topStrats.map(s => {
        if (s && s.strategy != strat.strategy)
          strats.push(s);
      })
      topStrats=strats.slice(0);

      strats=[];
      leftStrats=leftStrats.map(s => {
        if (s && s.strategy != strat.strategy)
          strats.push(s)
      })
      leftStrats=strats.slice(0)

      strats=[];
      rightStrats=rightStrats.map(s => {
        if (s && s.strategy != strat.strategy)
          strats.push(s);
      })
      rightStrats=strats.slice(0)

      strats=[];
      bottomStrats=bottomStrats.map(s => {
        if (s && s.strategy != strat.strategy)
          strats.push(s)
      })
      bottomStrats=strats.slice(0);
      
      /*
      this.setState({
        topStrats:topStrats,
        leftStrats:leftStrats,
        bottomStrats:bottomStrats,
        rightStrats:rightStrats
      });
      */

      var obj={};
      obj.topSystems=topStrats;
      obj.leftSystems=leftStrats;
      obj.bottomSystems=bottomStrats;
      obj.rightSystems=rightStrats;
      obj.topStrats=topStrats;
      obj.leftStrats=leftStrats;
      obj.bottomStrats=bottomStrats;
      obj.rightStrats=rightStrats;
      obj.isEdit=true;
      this.makeEditBoard(obj);
  }

  moveStratToSlot = (strat, position, isAnti=false) => {
    // Open order dialogue
    var {
      topStrats,
      rightStrats,
      bottomStrats,
      leftStrats
    } = this.state;

    console.log("Moved Strat")
    console.log(strat);
    console.log(position);  
    strat.display=strat.strategy;
    strat.color=strat.color_border;

    var origTop=topStrats;
    var origRight=rightStrats;
    var origLeft=leftStrats;
    var origBottom=bottomStrats;
    

    var strats=[];
    topStrats=topStrats.map(s => {
      if (s && s.strategy != strat.strategy)
        strats.push(s);
    })
    topStrats=strats.slice(0);

    strats=[];
    leftStrats=leftStrats.map(s => {
      if (s && s.strategy != strat.strategy)
        strats.push(s)
    })
    leftStrats=strats.slice(0)

    strats=[];
    rightStrats=rightStrats.map(s => {
      if (s && s.strategy != strat.strategy)
        strats.push(s);
    })
    rightStrats=strats.slice(0)

    strats=[];
    bottomStrats=bottomStrats.map(s => {
      if (s && s.strategy != strat.strategy)
        strats.push(s)
    })
    bottomStrats=strats.slice(0);

    var found=false;
    if (position == 'top') {
      strat.column='top';
      topStrats.map(s => {
        if (s.strategy == strat.strategy)
          found=true;
      })
      if (!found) 
        topStrats.push(strat);


    } else if (position == 'left') {
      strat.column='left';
      leftStrats.map(s => {
        if (s.strategy == strat.strategy)
          found=true;
      })
      if (!found) 
        leftStrats.push(strat);
    } else if (position == 'right') {

      strat.column='right';
      rightStrats.map(s => {
        if (s && s.strategy == strat.strategy)
          found=true;
      })
      if (!found) 
        rightStrats.push(strat);
    } else if (position == 'bottom') {
      strat.column='bottom';
      bottomStrats.map(s => {
        if (s.strategy == strat.strategy)
          found=true;
      })
      if (!found) 
        bottomStrats.push(strat);
    }
    
    if (topStrats.length > 0) {
      if (topStrats.length > 6) {
        topStrats=topStrats.slice(0,6);
      }
      var bottomNum=Math.floor(12/topStrats.length);
      if (bottomNum < bottomStrats.length) {
        bottomStrats=bottomStrats.slice(0,bottomNum);
      }

    }

    if (rightStrats.length > 3) {
        rightStrats=rightStrats.slice(0,3);
    }
    if (leftStrats.length > 3) {
       leftStrats=leftStrats.slice(0,3);
    }
    if (bottomStrats.length > 12) {
       bottomStrats=bottomStrats.slice(0,12);
    }

    // check if action completed
    found=false;
    topStrats.map(s => {
      if (s.strategy == strat.strategy)
        found=true;
    })
    rightStrats.map(s => {
      if (s.strategy == strat.strategy)
        found=true;
    })
    bottomStrats.map(s => {
      if (s.strategy == strat.strategy)
        found=true;
    })
    leftStrats.map(s => {
      if (s.strategy == strat.strategy)
        found=true;
    })
    // if not return;
    if (!found)
      return;
  /*
    this.setState({
        topStrats:topStrats,
        leftStrats:leftStrats,
        bottomStrats:bottomStrats,
        rightStrats:rightStrats
      });
      */
      var obj={};
      obj.topSystems=topStrats;
      obj.leftSystems=leftStrats;
      obj.bottomSystems=bottomStrats;
      obj.rightSystems=rightStrats;
      obj.topStrats=topStrats;
      obj.leftStrats=leftStrats;
      obj.bottomStrats=bottomStrats;
      obj.rightStrats=rightStrats;

      obj.isEdit=true;
      this.makeEditBoard(obj);
      
  };
  moveChipToSlot = (chip, position, isAnti=false) => {
    // Open order dialogue
    const {
      topSystems,
      bottomSystems,
      leftSystems,
      rightSystems,
      moveToBalance,
      addLast3DaysProfit,
      addBet,
      simulatedDate,
      showDialog,
      silenceDialog,
      addTimedToaster
    } = this.props;
    
    chip.orig_position=chip.position;
    chip.orig_last_selection=chip.last_selection;



    const system = [
      ...topSystems,
      ...bottomSystems,
      ...leftSystems,
      ...rightSystems
    ].find(sys => sys.column === position);
    const slot = this.state.slots.find(slot => slot.position === position);

    // __TEMPERORY_CODE__
    // disallow multiple chip on same position
    const betChip = this.props.bettingChips.find(c => c.position === position);
    if (betChip && !this.props.isLive)  {
      addTimedToaster({
        id: "move-chip-error",
        text: `This strategy is already in use for ${betChip.display} account.
               Multiple accounts on one strategy is available only in Live Mode.`
      });
      return undefined;
    }
    if (slot) {
      this.setState({
        performance_account_id:chip.account_id,
        showOrderDialog: true,
        showClearDialog: false,
        orderChip: chip,
        orderSlot: slot,
        orderAnti: isAnti
      });
    } else if (system) {
      const systemToSlot = {
        position: system.column,
        topSystem: blankSystem,
        bottomSystem: blankSystem,
        leftSystem: blankSystem,
        rightSystem: blankSystem
      };
      systemToSlot[`${system.position}System`] = system;
      this.setState({
        performance_account_id:chip.account_id,
        showOrderDialog: true,
        showClearDialog: false,
        orderChip: chip,
        orderSlot: systemToSlot,
        orderAnti: isAnti
      });
    } else if (position.toString().toLowerCase() === "off") {
        this.setState({showClearDialog:true})
        
        showDialog(
          Title({ chip, canDrag: false }),
         " All positions for this account will be cleared at the market close, your funds will be held in cash. " ,
          () => {
            // Here you first need to remove the bet in the state so it's location
            // appears correctly on the board
            chip.position="off";
            chip.last_selection="off"
            moveToBalance(chip);

            // Then we need to reflect this in our redux store:
            // 1. add default off location's last3DaysProfit (basically 0 changePercent)
            if (!this.props.isLive) {
              const profitObj = {};
              profitObj[chip.accountId] = {
                position: "off",
                "20180201": { changePercent: 0 },
                "20180202": { changePercent: 0 },
                "20180205": { changePercent: 0 },
                "20180206": { changePercent: 0 },
                "20180207": { changePercent: 0 },
                "20180208": { changePercent: 0 }
              };
              addLast3DaysProfit(profitObj);
              const bet = {};
              bet[chip.accountId] = {
                bettingDate: toSlashDate(simulatedDate),
                position: "off",
                isAnti: false
              };

              // 2. append a new currentBet on off location
              addBet(bet);
              silenceDialog();
              this.setState({showClearDialog:false});
  
            } else {

              const bet = {};
              bet[chip.accountId] = {
                bettingDate: toSlashDate(getDateNowStr()),
                position: "off",
                isAnti: false
              };

              // 2. append a new currentBet on off location
              addBet(bet);
              silenceDialog();
              this.setState({showClearDialog:false})
            }
          },
          null,
          "Clear all positions",
          "Cancel"
      );
      setInterval(() => { this.setState({showClearDialog:false})} , 2000)
      
    } else {
      this.setState({
        showClearDialog: false,
      });
    }

  };

  /**
   *
   * @function heldChips returns the array of chips held at a particular position.
   * @param {int|string} position gets position
   * @returns {chips[]} returns array of betting chips
   * @memberof Panel
   *
   *
   *
   */

  heldChips(position) {
    return this.props.bettingChips.filter(chip => chip.position === position);
  }

  toggleOrderDialog = () => {
    this.setState(prevState => ({
      showOrderDialog: !prevState.showOrderDialog,
      isPerformance:false
    }));
  };

  /**
   *
   * @function render Render of Panel component
   * @returns {object} jsx element
   * @memberof Panel
   *
   *
   *
   */

  render() {
    var self=this;
    const slotsGrid = [];
    const {
      maxWidth,
      maxHeight,
      slots,
      topSystems,
      showOrderDialog,
      orderSlot,
      orderChip,
      rankingLoading,
      rankingData,
      rankingError,
    } = this.state;

    const {
      heatmap_selection,
      heatmap,
      showHeatmap
    } = this.props;
    ////console.log("heatmap selection" + heatmap_selection);
    let slot = null;

    var panelBgColor="#86dde0";
    var panelTextColor="#000000";
    
    if (this.props.themes != undefined && this.props.themes.live.board) {
      if (this.props.themes.live.board.background)
        panelBgColor=this.props.themes.live.board.background;
      if (this.props.themes.live.board.text)
        panelTextColor=this.props.themes.live.board.text;
        
    }
    for (let xIndex = 0; xIndex < maxWidth; xIndex++) {
      const column = [];
      for (let yIndex = 0; yIndex < maxHeight; yIndex++) {
        slot = slots[xIndex * maxHeight + yIndex];
        var slotHeatmap={};

        var textColor="#000000";
        var bgColor="#86dde0";

        if (this.props.isLive) {
          if (heatmap_selection && heatmap_selection.length > 0) {
              slotHeatmap['color_fill']=heatmap[heatmap_selection].color_fill[slot.position.toString()];
              slotHeatmap['color_text']=heatmap[heatmap_selection].color_text[slot.position.toString()];
              slotHeatmap['rank']=heatmap[heatmap_selection].rank[slot.position.toString()];
              slotHeatmap['score']=heatmap[heatmap_selection].score[slot.position.toString()];
              textColor=slotHeatmap['color_text'];
              bgColor=slotHeatmap['color_fill'];
          }
        }
        if (this.props.isEdit) {
          column.push(
            <Slot
              key={"slot-" + xIndex + "-" + yIndex}
              position={slot.position}
              slotHeatmap={slotHeatmap}
              topSystem={slot.topSystem}
              bottomSystem={slot.bottomSystem}
              leftSystem={slot.leftSystem}
              rightSystem={slot.rightSystem}
              heldChips={[]}
              moveChipToSlot={this.moveChipToSlot}
              bgColor={panelBgColor}
              textColor={panelTextColor}
              showOrderDialog={showOrderDialog}
              heatmap_selection={heatmap_selection}
              isReadOnly={true}
              isEdit={true}
              style={{
                backgroundColor: bgColor,
                text: textColor,
                zIndex:1,
              }}
            />
          );
         

  
        } else {
          column.push(
            <Slot
              key={"slot-" + xIndex + "-" + yIndex}
              position={slot.position}
              slotHeatmap={slotHeatmap}
              topSystem={slot.topSystem}
              bottomSystem={slot.bottomSystem}
              leftSystem={slot.leftSystem}
              rightSystem={slot.rightSystem}
              heldChips={this.heldChips(yIndex + maxHeight * xIndex + 1)}
              moveChipToSlot={this.moveChipToSlot}
              bgColor={panelBgColor}
              textColor={panelTextColor}
              showOrderDialog={showOrderDialog}
              heatmap_selection={heatmap_selection}
    
              style={{
                backgroundColor: bgColor,
                text: textColor,
                zIndex:1,
              }}
            />
          );
            
        }
      }
      if (this.props.isEdit) {
        var topnum=this.state.topStrats.length == 0 ? 1 : this.state.topStrats.length;
        var topIdx=xIndex % topnum;
        //console.log(this.state.topStrats)
        //console.log(topSystems)
        slotsGrid.push(
          <div key={"slotColumn-" + xIndex} className={classes.Column}>
            <RiskStrip system={topSystems[topIdx]} />
            {column} 
          </div>
        );
      } else {
        slotsGrid.push(
          <div key={"slotColumn-" + xIndex} className={classes.Column}>
            <RiskStrip system={topSystems[xIndex % topSystems.length]} />
            {column} 
          </div>
        );
      }
    }

    var sectionHeatmap={};

    if (heatmap_selection && heatmap_selection.length > 0) {
      sectionHeatmap=heatmap[heatmap_selection];
    }

    var scale=1.0
    var padding=120 * scale;

    const panel = (
      <div  style={{"background": "transparent",  zIndex: 0, paddingRight: padding + "px", paddingLeft: padding + "px", "text":panelTextColor, }}>
        

        <div className={classes.Panel} style={{ zIndex: 0, "background": panelBgColor, "text":panelTextColor, transform: "scale(" + scale + ")"}}>
          {!this.props.isEdit ? 
            (
          <ChipsPanel
          systems={this.state.bottomSystems}
          topSystems={this.state.topSystems}
          moveChipToSlot={this.moveChipToSlot}
          sectionHeatmap={sectionHeatmap}
          bgColor={panelBgColor}
          textColor={panelTextColor}
          showOrderDialog={showOrderDialog}
          heatmap_selection={heatmap_selection}
          balanceChips={this.props.balanceChips} /> 
            ) : null}


          {slotsGrid}
         
          <TopSection
            systems={this.state.topSystems}
            balanceChips={this.props.balanceChips}
            moveChipToSlot={this.moveChipToSlot}
            sectionHeatmap={sectionHeatmap}
            bgColor={panelBgColor}
            textColor={panelTextColor}
            showOrderDialog={showOrderDialog}
            heatmap_selection={heatmap_selection}
            maxHeight={this.state.maxHeight}
            isEdit={this.props.isEdit}
            moveStratToSlot={this.moveStratToSlot}
            heldStrats={this.state.topStrats}
          />
         
          <BottomSection
            systems={this.state.bottomSystems}
            topSystems={this.state.topSystems}
            moveChipToSlot={this.moveChipToSlot}
            sectionHeatmap={sectionHeatmap}
            bgColor={panelBgColor}
            textColor={panelTextColor}
            showOrderDialog={showOrderDialog}
            heatmap_selection={heatmap_selection}
            isEdit={this.props.isEdit}
            moveStratToSlot={this.moveStratToSlot}
            heldStrats={this.state.bottomStrats}
            
          />
          <LeftSection
            systems={this.state.leftSystems}
            moveChipToSlot={this.moveChipToSlot}
            sectionHeatmap={sectionHeatmap}
            bgColor={panelBgColor}
            textColor={panelTextColor}
            showOrderDialog={showOrderDialog}
            heatmap_selection={heatmap_selection}
            maxHeight={this.state.maxHeight}
            isEdit={this.props.isEdit}
            moveStratToSlot={this.moveStratToSlot}
            heldStrats={this.state.leftStrats}
          />
          <RightSection
            systems={this.state.rightSystems}
            moveChipToSlot={this.moveChipToSlot}
            sectionHeatmap={sectionHeatmap}
            bgColor={panelBgColor}
            textColor={panelTextColor}
            showOrderDialog={showOrderDialog}
            heatmap_selection={heatmap_selection}
            maxHeight={this.state.maxHeight}
            isEdit={this.props.isEdit}
            moveStratToSlot={this.moveStratToSlot}
            heldStrats={this.state.rightStrats}
          />
          
          {this.props.isEdit ? (
              <div style={{
                  width:(innerWidth -37) + "px",
                  position:'absolute',marginTop: (71 + (60*this.state.maxHeight))+ "px", marginLeft: '-111px'}}>
                <div style={{float:'left', width: "161px"}}>
                <img src={"/images/clear_board.png"} height={30} width={161} />
                </div>
                <div style={{ marginLeft: '-118px', marginTop: '2px', fontSize: "18px", color:"black", float:"left", cursor:'pointer'}}
                  onClick={() => {
                      self.clearStrats();

                  }}
                >
                  Clear Board
                </div>
                <div style={{float:'left', width: "350px"}}>
                  <RemoveContainer removeStratFromSlot={this.removeStratFromSlot} />
                </div>

                <div style={{float:'right', cursor:'pointer'}}
                 onClick={() => {
                  if (this.state.isEditComplete) 
                    self.saveEditBoard();
                  else
                    self.props.addTimedToaster({
                      id: "save-error",
                      text: this.props.editData.disabled_save_button_message
                    });
          
                }}
                >
                    <div style={{float:'right', width: "161px" }} 
                   >
                   {this.state.isEditComplete ? 
                      <img src={"/images/save_enabled.png"} height={30} width={161} />
                    :
                      <img src={"/images/save_disabled.png"} height={30} width={161} />
                   }
                    </div>
                    <div style={{ marginRight: '-151px', marginTop: '2px', fontSize: "18px", color:this.state.isEditComplete ? "#000000":"#ffffff", float:"right"}}
                    
                    >
                      Save Board

                    </div>
                </div>
                <div style={{float:'right', width: "100px"}}>
                <img src={"/images/cancel.png"}  height={30} />
                </div>
                <div style={{ marginRight: '-80px', marginTop: '2px', fontSize: "18px", color:"black", float:"right", cursor:'pointer'}}
                  onClick={() => {
                  window.location='/board';
                }}
                >
                  Cancel
                </div>
                
                <div style={{"clear": "both"}}></div>
              </div>
          ) : null}

        </div>
        {!this.state.isReadOnly && this.props.show_leader_dialog ? (
          <div             id={"modalDialog"}>
          <LeaderDialog initializeLive={this.props.initializeLive} />
          </div>
        ) : null}


        {!this.state.isReadOnly && showOrderDialog ? (
          <div             id={"modalDialog"}>

          <OrderDialog
          
            slot={orderSlot}
            chip={orderChip}
            toggle={this.toggleOrderDialog}
            successHandler={this.props.addBettingChip}
            rankingLoading={rankingLoading}
            rankingData={rankingData}
            rankingError={rankingError}
            isPerformance={this.state.isPerformance}
            isPractice={this.props.isPractice}
            performance_account_id={this.state.performance_account_id}
            moveChipToSlot={this.moveChipToSlot}
            orderAnti={this.state.orderAnti}
          />
          </div>
        ) : null}

        {!this.state.isReadOnly && this.props.show_lockdown_dialog ? (
          <div             
            id={"modalDialog"}
          >
          <LockdownDialog />
          </div>
        ) : null}
        
        {!this.state.isReadOnly && !this.props.mute && 1 == 2 ? (
          <Sound
              url="/sounds/chipLay2.wav"
              playStatus={this.state.showClearDialog ? Sound.status.PLAYING: Sound.status.STOPPED}
              playFromPosition={0 /* in milliseconds */}
              //onLoading={this.handleSongLoading}
              //onPlaying={this.handleSongPlaying}
              //onFinishedPlaying={this.handleSongFinishedPlaying}
        /> 
        ) : null}
        
        
      </div>
    );

    // Lets try with non blocking approach
    // return rankingLoading ? <Spinner /> : panel;
    return panel;
  }

  /**
   *
   *
   * @function componentDidMount Component did mount hook of the Panel component,
   *  called after the thing has been rendered
   *
   * @memberof Panel
   *
   *
   */

  componentDidMount() {
    
    const { slots } = this.state;
    if (!this.props.isLive) {
      this.setState({ rankingLoading: true });
      // const { portfolio, target, accountValue } = ChipsConfig[0];

      axios
        .post("/utility/ranking_charts/", {
          // .get("https://api.myjson.com/bins/11pqxf", {
          //only 5k chip for tier 0
          // accounts: [{ portfolio, target, accountValue }],
          accounts: ChipsConfig,
          slots: slots.map(
            ({ position, topSystem, bottomSystem, leftSystem, rightSystem }) => {
              return {
                position: position.toString(),
                systems: [topSystem, bottomSystem, leftSystem, rightSystem]
                  .map(system => system.column)
                  .filter(system => system)
              };
            }
          ),
          lookback: 23
        })
        .then(({ data }) => {
          ////console.log("Practice Ranking Data")
          ////console.log(data)
          // eslint-disable-next-line react/no-is-mounted
          this._isMounted &&
            this.setState({
              rankingLoading: false,
              rankingData: data.rankingData
            });
        })
        .catch(error => {
          // eslint-disable-next-line react/no-is-mounted
          this._isMounted &&
            this.setState({
              rankingLoading: false,
              rankingError: error
            });
        });
      }

      if (this.props.isEdit) {
          
          const makeJiggle= () => {
            try {
              var items=$(".required");
              if (items && items != undefined && items.length) {
                if (this.jiggleIdx == undefined || this.jiggleIdx >= items.length) 
                  this.jiggleIdx=0;
                //console.log(items.length)
                //console.log(this.jiggleIdx);
                var item=items[this.jiggleIdx];

                var bounce = new Bounce();
                bounce
                  .scale({
                    from: { x: 1, y: 1},
                    to: { x: 1.5, y: 1.5 },
                    easing: "sway",
                    duration: 2000,
                    stiffness: 2,
                    delay: 0,
                  })
                  .applyTo(item);
                  if (this.jiggleIdx == undefined || this.jiggleIdx >= items.length -1) {
                    this.jiggleIdx=0;
                  } else {
                    this.jiggleIdx+=1;
                  }
  
                }
              } catch(err) {
                    console.log(err);
              }
      
            }
            setInterval(makeJiggle, 2000);
      }
  }

  saveEditBoard = () => {
    var self=this;
    var board=[];
    var {leftStrats, rightStrats, bottomStrats, topStrats}=this.state;
    leftStrats.map(strat => {
      var item={}
      item.id=strat.id;
      item.position='left';
      board.push(item);
    })
    rightStrats.map(strat => {
      var item={}
      item.id=strat.id;
      item.position='right';
      board.push(item);
    })
    bottomStrats.map(strat => {
      var item={}
      item.id=strat.id;
      item.position='bottom';
      board.push(item);
    })
    topStrats.map(strat => {
      var item={}
      item.id=strat.id;
      item.position='top';
      board.push(item);
    })
    console.log("Saving Board");
    console.log(self.props.email);
    console.log(board);
    axios
    .post("/utility/update_board_live/", {
      // .get("https://api.myjson.com/bins/11pqxf", {
      //only 5k chip for tier 0
      // accounts: [{ portfolio, target, accountValue }],
      username: self.props.email,
      board_config: JSON.stringify(board),
      })
    .then(({ data }) => {
      ////console.log("Practice Ranking Data")
      ////console.log(data)
      // eslint-disable-next-line react/no-is-mounted
      console.log("Save Board Response")
      console.log(data);
      if (data.message != "OK") {
        self.props.addTimedToaster({
          id: "save-error",
          text: data.message
        });
      } else {
        var update_bets="";
        if (data.update_bets)
          update_bets=JSON.stringify(data.update_bets);

        window.location='/board?reinitialize=1&update_bets=' + update_bets;
      }
    })
    .catch(error => {
      // eslint-disable-next-line react/no-is-mounted
      this._isMounted &&
        this.setState({
          rankingLoading: false,
          rankingError: error
        });
    });
  }
  /**
   * Set the _isMounted property to be false for the component to handle Promise case.
   * @function componentWillUnmount as the name suggests its pre-unmount hook for the panel component
   * @memberof Panel
   */
  componentWillUnmount() {
    this._isMounted = false;
  }

}
