import React from "react";
import PropTypes from "prop-types";
import Slot from "../../containers/Slot/Slot";
import Chip from "../_Chip/_Chip";
import classes from "./Order.css";
import {numberWithCommas, toTitleCase} from "../../../../util"
// import Switch from "../../../../components/UI/Switch/Switch";
import OrderCharts from "../../containers/OrderCharts/OrderCharts";
import AccountCharts from "../../components/AccountCharts/AccountCharts";
import { toSystem  } from "../../Config";
import StrategyButton from "../../containers/NewBoard/components/StrategyButton/StrategyButton"
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import Sound from 'react-sound';

const getSystems = slot => {
  return Object.keys(slot)
    .filter(key => key.indexOf("System") !== -1)
    .map(key => slot[key]);
};


const stateToProps = state => {
  return {
    simulatedDate: state.betting.simulatedDate,
    isAuth: state.auth.token !== null,
    isLive: state.betting.isLive,
    dictionary_strategy: state.betting.dictionary_strategy,
    mute:state.betting.mute,
    themes:state.betting.themes,
    accounts:state.betting.accounts,

  };
};

const dispatchToProps = dispatch => {
  return {
    addLast3DaysProfit: last3DaysProfit => {
      dispatch(actions.addLast3DaysProfit(last3DaysProfit));
    },
    addBet: bet => {
      dispatch(actions.addBet(bet));
    },
    addTimedToaster(toaster) {
      dispatch(actions.addTimedToaster(toaster));
    },
    setStrat(strat) {
      dispatch(actions.setStrat(strat));
    },
    
    showHtmlDialog: (htmlContent) => {
      dispatch(actions.showHtmlDialog(htmlContent));
      
    },
    silenceHtmlDialog: () => {
      dispatch(actions.silenceHtmlDialog());
      
    },
    showHtmlDialog2: (htmlContent) => {
      dispatch(actions.showHtmlDialog2(htmlContent));
      
    },
    silenceHtmlDialog2: () => {
      dispatch(actions.silenceHtmlDialog2());
      
    },
  }
};



@connect(stateToProps, dispatchToProps)
export default class Order extends React.Component {
  /**
   * Creates an instance of OrderDialog.
   * @constructor
   * @param {any} props
   * @memberof OrderDialog
   */

  static propTypes = {
      slot: PropTypes.object,
      chip: PropTypes.object.isRequired,
      isEdit: PropTypes.bool,
      strategy:PropTypes.object,
      isLive: PropTypes.bool.isRequired,
      isPractice: PropTypes.bool,
      performance: PropTypes.object,
      setAnti: PropTypes.func,
      setNotAnti: PropTypes.func,
      toAntiSystem: PropTypes.func,
      rankingError: PropTypes.object,
      rankingData: PropTypes.array,
      rankingLoading: PropTypes.bool,
      submitBetHandler: PropTypes.func,
      isAnti: PropTypes.bool,
      close: PropTypes.func.isRequired,
      toggle:PropTypes.func,
      dictionary_strategy:PropTypes.object.isRequired,
      isPerformance:PropTypes.bool,
      isPortfolio:PropTypes.bool,
      isAccount:PropTypes.bool,
      performance_account_id:PropTypes.string,
      themes:PropTypes.object,
      accounts:PropTypes.array.isRequired,
      moveChipToSlot:PropTypes.func,
      moveStratToSlot:PropTypes.func,
      showHtmlDialog:PropTypes.func,
      silenceHtmlDialog:PropTypes.func,
      showHtmlDialog2:PropTypes.func,
      silenceHtmlDialog2:PropTypes.func,
      stratParams:PropTypes.object
    };
    
    
  constructor(props) {
    super(props);
    this.state={}

  }

  
  componentWillReceiveProps(newProps) {
    console.log("Order Received New Props")
    console.log(newProps);
    var self=this;
   
    if (this.props.performance_account_id && this.props.isPerformance) {
      if (newProps.accounts) {
          var orderChip='';
          var updated=false;
          newProps.accounts.map(account => {
              if (account.account_id == this.props.performance_account_id) {
                orderChip=account;
                self.setState({orderChip:orderChip});
                console.log("new state for chip " + account.account_id);
                console.log(orderChip);
                updated=true;
              }
          });
          if (updated) 
            self.forceUpdate();

      }
    }

  }
  render() {
      var self=this;
      
      var { slot, chip, setAnti, setNotAnti, isAnti, toAntiSystem, submitBetHandler, close, isLive,  dictionary_strategy, isPerformance, accounts, themes, isEdit } = this.props;

      if (this.props.isEdit) {
        isAnti=this.state.isAnti;
      }
      if (this.state.orderChip)  {
        chip=this.state.orderChip;
        console.log('Order Rendering Chip')
        console.log(chip)
      }

      console.log(slot);
      var isNumbered;
      if (!isPerformance) {
        isNumbered = !isNaN(Number(slot.position));
      }
      return (
        <div className={classes.Order} style={isLive ? {background: themes.live.dialog.background} : {}}>
          {!isPerformance ? isLive ? isEdit ?(
            


          <div className={classes.TitleRow} style={{background: themes.live.dialog.background}}>
            <div className={classes.Left}>
              <div
                className={classes.ElementContainer}
                style={{ paddingTop: "15px", width: !isNumbered ? "160px" : "auto", background: themes.live.dialog.background_inner }}
              >
                <StrategyButton strategy={this.props.strategy} />
              </div>
              <div
                className={classes.Systems}
                style={isNumbered ? {} : { visibility: "hidden" }}
              >
                <ul>
                  {getSystems(slot).map(system => (
                    <li key={`${system.id}${Math.random().toFixed(3)}`}>
                      <p>{system.display}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={classes.ElementContainer}
                style={{ paddingTop: "15px",background: themes.live.dialog.background_inner }}
              >
                <Chip chip={chip} isNewBoard={true} />
              </div>
            </div>
            <div className={classes.Right} style={{background: themes.live.dialog.background_inner}}>
              <div className={classes.ElementContainer} style={{background: themes.live.dialog.background_inner}}>
                <div style={{ display: "flex", width: "100%" }}>
                  <input
                    type="radio"
                    id="system-radio"
                    checked={!this.state.isAnti}
                    onChange={(e) => {

                      setNotAnti(e);
                      self.props.setStrat(toSystem(slot.position));
                      self.setState({isAnti:false, strat:toSystem(slot.position)})
                    }}
                    title={"Orders will be placed for the strategy selected here."}
                  />
                  {isLive ? (

                      <label id="system-label" htmlFor="system-radio" style={{ color: "#8884d8" }}>
                        {toSystem(slot.position)}
                      </label>

                      ) : (
                      <label htmlFor="system-radio" style={{ color: "#8884d8" }}>
                        {toSystem(slot.position)}
                      </label>
                      )}
                </div>
                <div style={{ display: "flex", width: "100%" }}>
                  <input
                    type="radio"
                    id="anti-system-radio"
                    checked={this.state.isAnti}
                    onChange={(e) => {
                      setAnti(e)
                      self.props.setStrat(toAntiSystem(slot.position));
                      self.setState({isAnti:true, strat:toAntiSystem(slot.position)})
                      

                    }}
                    title={"Orders will be placed for the strategy selected here."}
                  />
                  {isLive ? (
                    <label id="anti-system-label" htmlFor="anti-system-radio" style={{ color: "#63a57c" }}>
                      {toAntiSystem(slot.position)}
                    </label>
                  ) : (
                    <label htmlFor="anti-system-radio" style={{ color: "#63a57c" }}>
                      {toAntiSystem(slot.position)}
                    </label>
                  )}
                </div>
              </div>
              <div className={classes.ActionBar} style={{background: themes.live.dialog.background_inner}}>
                <button className={classes.Submit} onClick={() => {
                  var orderStrat=this.props.stratParams.strat;
                  if (this.state.strat) {
                    orderStrat.strategy=this.state.strat;
                    orderStrat.display=this.state.strat;
                    orderStrat.id=this.state.strat;
                  }
                  self.props.moveStratToSlot(orderStrat, 
                            this.props.stratParams.position, 
                            this.props.stratParams.isAnti, 
                            this.props.stratParams.swapStrat)
                  self.props.silenceHtmlDialog2();
                }} title={"This Strategy will be Placed in the Slot"}>
                  Place Strategy
                </button>
                <button onClick={close}>Cancel</button>
              </div>
            </div>

            {/* <div className={classes.Right}>
              <p style={{ color: "#8884d8" }}>System</p>
              <Switch toggle={toggleSystem} />
              <p style={{ color: "#63a57c" }}>Anti-System</p>
            </div> */}
          </div>
          ) : (
            


          <div className={classes.TitleRow} style={{background: themes.live.dialog.background}}>
            <div className={classes.Left}>
              <div
                className={classes.ElementContainer}
                style={{ padding: "0px", width: !isNumbered ? "160px" : "auto", background: themes.live.dialog.background_inner }}
              >
                <Slot
                  {...slot}
                  dictionary_strategy={ dictionary_strategy}
                  heldChips={[]}
                  width={!isNumbered ? "160px" : "60px"}
                  fontSize={!isNumbered ? "1.5em" : "2.2em"}
                />
              </div>
              <div
                className={classes.Systems}
                style={isNumbered ? {} : { visibility: "hidden" }}
              >
                <ul>
                  {getSystems(slot).map(system => (
                    <li key={`${system.id}${Math.random().toFixed(3)}`}>
                      <p>{system.display}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={classes.ElementContainer}
                style={{ paddingTop: "15px",background: themes.live.dialog.background_inner }}
              >
                <Chip chip={chip}  />
              </div>
            </div>
            <div className={classes.Right} style={{background: themes.live.dialog.background_inner}}>
              <div className={classes.ElementContainer} style={{background: themes.live.dialog.background_inner}}>
                <div style={{ display: "flex", width: "100%" }}>
                  <input
                    type="radio"
                    id="system-radio"
                    checked={!isAnti}
                    onChange={(e) => {

                      setNotAnti(e);
                      if (isLive)
                        self.props.setStrat(toSystem(slot.position));
                    }}
                    title={"Orders will be placed for the strategy selected here."}
                  />
                  {isLive ? (

                      <label id="system-label" htmlFor="system-radio" style={{ color: "#8884d8" }}>
                        {toSystem(slot.position)}
                      </label>

                      ) : (
                      <label htmlFor="system-radio" style={{ color: "#8884d8" }}>
                        {toSystem(slot.position)}
                      </label>
                      )}
                </div>
                <div style={{ display: "flex", width: "100%" }}>
                  <input
                    type="radio"
                    id="anti-system-radio"
                    checked={isAnti}
                    onChange={(e) => {
                      setAnti(e)
                      if (isLive)
                        self.props.setStrat(toAntiSystem(slot.position));
                    }}
                    title={"Orders will be placed for the strategy selected here."}
                  />
                  {isLive ? (
                    <label id="anti-system-label" htmlFor="anti-system-radio" style={{ color: "#63a57c" }}>
                      {toAntiSystem(slot.position)}
                    </label>
                  ) : (
                    <label htmlFor="anti-system-radio" style={{ color: "#63a57c" }}>
                      {toAntiSystem(slot.position)}
                    </label>
                  )}
                </div>
              </div>
              <div className={classes.ActionBar} style={{background: themes.live.dialog.background_inner}}>
                <button className={classes.Submit} onClick={submitBetHandler} title={"This order will be placed as a Market-on-Close (MOC) order."}>
                  Place MOC Order
                </button>
                <button onClick={close}>Cancel</button>
              </div>
            </div>

            {/* <div className={classes.Right}>
              <p style={{ color: "#8884d8" }}>System</p>
              <Switch toggle={toggleSystem} />
              <p style={{ color: "#63a57c" }}>Anti-System</p>
            </div> */}
          </div>
          ) : (
            


          <div className={classes.TitleRow}>
          <div className={classes.Left}>
            <div
              className={classes.ElementContainer}
              style={{ padding: "0px", width: !isNumbered ? "160px" : "auto" }}
            >
              <Slot
                {...slot}
                dictionary_strategy={ dictionary_strategy }
                heldChips={[]}
                width={!isNumbered ? "160px" : "60px"}
                fontSize={!isNumbered ? "1.5em" : "2.2em"}
              />
            </div>
            <div
              className={classes.Systems}
              style={isNumbered ? {} : { visibility: "hidden" }}
            >
              <ul>
                {getSystems(slot).map(system => (
                  <li key={`${system.id}${Math.random().toFixed(3)}`}>
                    <p>{system.display}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={classes.ElementContainer}
              style={{ paddingTop: "15px" }}
            >
              
              <Chip chip={chip}  />

            </div>
          </div>
          <div className={classes.Right}>
            <div className={classes.ElementContainer}>
              <div style={{ display: "flex", width: "100%" }}>
                <input
                  type="radio"
                  id="system-radio"
                  checked={!isAnti}
                  onChange={setNotAnti}
                  title={"Orders will be placed for the strategy selected here."}
                />
                {isLive ? (

                    <label htmlFor="system-radio" style={{ color: "#8884d8" }}>
                      {toSystem(slot.position)}
                    </label>

                    ) : (
                    <label htmlFor="system-radio" style={{ color: "#8884d8" }}>
                      {toSystem(slot.position)}
                    </label>
                    )}
              </div>
              <div style={{ display: "flex", width: "100%" }}>
                <input
                  type="radio"
                  id="anti-system-radio"
                  checked={isAnti}
                  onChange={setAnti}
                  title={"Orders will be placed for the strategy selected here."}
                />
                {isLive ? (
                  <label htmlFor="anti-system-radio" style={{ color: "#63a57c" }}>
                    {toAntiSystem(slot.position)}
                  </label>
                ) : (
                  <label htmlFor="anti-system-radio" style={{ color: "#63a57c" }}>
                    {toAntiSystem(slot.position)}
                  </label>
                )}
              </div>
            </div>
            <div className={classes.ActionBar}>
              <button className={classes.Submit} onClick={submitBetHandler} title={"This order will be placed as a Market-on-Close (MOC) order."}>
                Place MOC Order
              </button>
              <button onClick={close}>Cancel</button>
            </div>
          </div>

          {/* <div className={classes.Right}>
            <p style={{ color: "#8884d8" }}>System</p>
            <Switch toggle={toggleSystem} />
            <p style={{ color: "#63a57c" }}>Anti-System</p>
          </div> */}
        </div>
          
        ) : chip.isReadOnly ? chip.isAccountView ? (
          <div className={classes.TitleRow} style={{background:self.props.themes.live.dialog.background,
            color:self.props.themes.live.dialog.text, fontSize:"12px", fontWeight:400}}
            >
            
            <div
              className={classes.ElementContainer}
              style={{ paddingTop: "15px",background:self.props.themes.live.dialog.background_inner,
              color:self.props.themes.live.dialog.text }}
            >
            
              <Chip chip={chip} isAccount={self.props.isAccount} />
            </div>
            <div           style={{ minWidth:"100px", padding: "15px" }}
    >
              {toTitleCase(chip.tier)}<br/>
                Tier {chip.chip_tier}<br/>
                {chip.chip_tier_text}<br/>
                Rank: {chip.rank}<br/>
            </div>
            
          <table style={{border:"none", borderCollapse: "collapse",
        background:self.props.themes.live.dialog.background_inner,
        color:self.props.themes.live.dialog.text }}>
          <thead  style={{border:"none"}}>
            <tr style={{border:"none"}}>
            <th  style={{border:"none"}}>
              <center> 
                Account Value
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Cumulative %Chg
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Previous %Chg
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                  Age
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Markets in Portfolio
                </center>
                </th>
                
                </tr>
              </thead>
              <tbody>
                <tr style={{border:"1px", "padding":"1px"}}>
               
                <td style={{borderLeft:"1px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                          
                        {parseFloat(chip.account_value) ? (
                          <span style={parseFloat(chip.account_value) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                        <b>
                        $ {parseFloat(chip.account_value).toLocaleString("en")} 
                        </b>
                        </span>
                        ) : (
                          <span style={{color:self.props.themes.live.dialog.text_color}}>
                        <b>
                        $ {parseFloat(chip.account_value).toLocaleString("en")} 
                        </b>
                        </span>
                        )}
                      
                      </center>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                          
                        {parseFloat(chip.pnl_cumpct) ? (
                          <span style={parseFloat(chip.pnl_cumpct) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                        <b>
                        {parseFloat(chip.pnl_cumpct).toLocaleString("en")} %
                        </b>
                        </span>
                        ) : (
                          <span style={{color:self.props.themes.live.dialog.text_color}}>
                        <b>
                        {parseFloat(chip.pnl_cumpct).toLocaleString("en")} % 
                        </b>
                        </span>
                        )}
                      
                      </center>

                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                          
                          {parseFloat(chip.pnl_pct) ? (
                          <span style={parseFloat(chip.pnl_pct) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                        <b>
                        {parseFloat(chip.pnl_pct).toLocaleString("en")} %
                        </b>
                        </span>
                        ) : (
                          <span style={{color:self.props.themes.live.dialog.text_color}}>
                        <b>
                        {parseFloat(chip.pnl_pct).toLocaleString("en")} % 
                        </b>
                        </span>
                        )}
              </center>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black", borderRight:"0px solid black"}}>
                <center>
                  {chip.age}
                </center>
                </td>
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                {chip.num_markets}
                </center>
                </td>            
               
                <td style={{width:"1px", margin:"0px", padding:"0px", borderLeft:"1px solid black",borderTop:"1px solid black",borderBottom:"1px solid black", borderRight:"1px solid black"}}>
                </td></tr>
                </tbody>
                </table>
                <div style={{"float": "right", "padding":"9px","textAlign": "right", background:self.props.themes.live.dialog.background,
            color:self.props.themes.live.dialog.text, fontSize:"12px", fontWeight:400}}>
                      <button onClick={() => {self.props.toggle(); } } >
                      <font style={{fontSize:"22px"}}>Close</font>
                      </button>
              </div>

          </div>

        ) :
        (
          <div className={classes.TitleRow} style={{background:self.props.themes.live.dialog.background,
            color:self.props.themes.live.dialog.text, fontSize:"12px", fontWeight:400}}
            >
            
            <div
              className={classes.ElementContainer}
              style={{ paddingTop: "15px",background:self.props.themes.live.dialog.background_inner,
              color:self.props.themes.live.dialog.text }}
            >
              <Chip chip={chip} />
            </div>
            <div           style={{ minWidth:"100px", padding: "15px" }}
    >
              {toTitleCase(chip.tier)}<br/>
                Tier {chip.chip_tier}<br/>
                {chip.chip_tier_text}<br/>
                Rank: {chip.rank}<br/>
            </div>
            
          <table style={{border:"none", borderCollapse: "collapse",
        background:self.props.themes.live.dialog.background_inner,
        color:self.props.themes.live.dialog.text }}>
          <thead  style={{border:"none"}}>
            <tr style={{border:"none"}}>
            <th  style={{border:"none"}}>
              <center> 
                Player 
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Cumulative %Chg
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Previous %Chg
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                  Age
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Markets in Portfolio
                </center>
                </th>
                
                </tr>
              </thead>
              <tbody>
                <tr style={{border:"1px", "padding":"1px"}}>
               
                <td style={{borderLeft:"1px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                {chip.player}
                </center>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                          
                        {parseFloat(chip.pnl_cumpct) ? (
                          <span style={parseFloat(chip.pnl_cumpct) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                        <b>
                        {parseFloat(chip.pnl_cumpct).toLocaleString("en")} %
                        </b>
                        </span>
                        ) : (
                          <span style={{color:self.props.themes.live.dialog.text_color}}>
                        <b>
                        {parseFloat(chip.pnl_cumpct).toLocaleString("en")} % 
                        </b>
                        </span>
                        )}
                      
                      </center>

                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                          
                          {parseFloat(chip.pnl_pct) ? (
                          <span style={parseFloat(chip.pnl_pct) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                        <b>
                        {parseFloat(chip.pnl_pct).toLocaleString("en")} %
                        </b>
                        </span>
                        ) : (
                          <span style={{color:self.props.themes.live.dialog.text_color}}>
                        <b>
                        {parseFloat(chip.pnl_pct).toLocaleString("en")} % 
                        </b>
                        </span>
                        )}
              </center>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black", borderRight:"0px solid black"}}>
                <center>
                  {chip.age}
                </center>
                </td>
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                {chip.num_markets}
                </center>
                </td>            
               
                <td style={{width:"1px", margin:"0px", padding:"0px", borderLeft:"1px solid black",borderTop:"1px solid black",borderBottom:"1px solid black", borderRight:"1px solid black"}}>
                </td></tr>
                </tbody>
                </table>
                <div style={{"float": "right", "padding":"9px","textAlign": "right", background:self.props.themes.live.dialog.background,
            color:self.props.themes.live.dialog.text, fontSize:"12px", fontWeight:400}}>
                      <button onClick={() => {self.props.toggle(); } } >
                      <font style={{fontSize:"22px"}}>Close</font>
                      </button>
              </div>

          </div>
        ) : (
          <div className={classes.TitleRow} style={{background:self.props.themes.live.dialog.background,
            color:self.props.themes.live.dialog.text, fontSize:"12px", fontWeight:400}}
            >
            
            <div
              className={classes.ElementContainer}
              style={{ paddingTop: "15px",background:self.props.themes.live.dialog.background_inner,
              color:self.props.themes.live.dialog.text }}
            >
              <Chip chip={chip} isAccount={true} />
            </div>
            <div           style={{ minWidth:"100px", padding: "15px" }}
    >
              {toTitleCase(chip.tier)}<br/>
                Tier {chip.chip_tier}<br/>
                {chip.chip_tier_text}<br/>
                Rank: {chip.rank}<br/>
            </div>
            
          <table style={{border:"none", borderCollapse: "collapse",
        background:self.props.themes.live.dialog.background_inner,
        color:self.props.themes.live.dialog.text }}>
          <thead  style={{border:"none"}}>
            <tr style={{border:"none"}}>
            <th  style={{border:"none"}}>
              <center>
                Starting Value
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Account Value
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Total Margin
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Cumulative %Chg
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Previous %Chg
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                Markets in Portfolio
                </center>
                </th>
                <th  style={{border:"none"}}>
                <center>
                  Age
                </center>
                </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{border:"1px", "padding":"1px"}}>
                <td style={{borderLeft:"1px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                $ {numberWithCommas(chip.starting_value.toString())}
                </center>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>

                $ {numberWithCommas(chip.account_value.toString())}
                </center>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                $ {numberWithCommas(chip.total_margin.toString())}
                </center>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                          
                        {parseFloat(chip.pnl_cumpct) ? (
                          <span style={parseFloat(chip.pnl_cumpct) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                        <b>
                        {parseFloat(chip.pnl_cumpct).toLocaleString("en")} %
                        </b>
                        </span>
                        ) : (
                          <span style={{color:self.props.themes.live.dialog.text_color}}>
                        <b>
                        {parseFloat(chip.pnl_cumpct).toLocaleString("en")} % 
                        </b>
                        </span>
                        )}
                      
                      </center>

                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                          
                          {parseFloat(chip.pnl_pct) ? (
                          <span style={parseFloat(chip.pnl_pct) > 0 ? {color:self.props.themes.live.dialog.text_gain} : {color:self.props.themes.live.dialog.text_loss}} >
                        <b>
                        {parseFloat(chip.pnl_pct).toLocaleString("en")} %
                        </b>
                        </span>
                        ) : (
                          <span style={{color:self.props.themes.live.dialog.text_color}}>
                        <b>
                        {parseFloat(chip.pnl_pct).toLocaleString("en")} % 
                        </b>
                        </span>
                        )}
              </center>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
                <center>
                {chip.num_markets}
                </center>
                </td>            
                <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black", borderRight:"1px solid black"}}>
                <center>
                  {chip.age}
                </center>
                </td>
                <td style={{width:"1px", margin:"0px", padding:"0px", borderLeft:"1px solid black",borderTop:"1px solid black",borderBottom:"1px solid black", borderRight:"1px solid black"}}>
                </td></tr>
                </tbody>
                </table>
                <div style={{"float": "right", "padding":"9px","textAlign": "right", background:self.props.themes.live.dialog.background,
            color:self.props.themes.live.dialog.text, fontSize:"12px", fontWeight:400}}>
                      <button onClick={() => {self.props.toggle(); } } >
                      <font style={{fontSize:"22px"}}>Close</font>
                      </button>
              </div>

          </div>
        )}
          
          {isLive ? isEdit ? (

            <div className={classes.Content}  style={{background:self.props.themes.live.dialog.background,
              color:self.props.themes.live.dialog.text, borderColor:self.props.themes.live.dialog.lines}}>
              <AccountCharts 
              isOrder={!isPerformance} 
              moveChipToSlot={this.props.moveChipToSlot} 
              moveStratToSlot={this.props.moveStratToSlot}
              stratParams={this.props.stratParams}
              isEdit={true} 
              chip={chip} 
              slot={slot} 
              isAnti={this.state.isAnti} 
              rankingLoading={false} 
              close={this.props.close} 
              />
            </div>


          ) :(

            <div className={classes.Content}  style={{background:self.props.themes.live.dialog.background,
              color:self.props.themes.live.dialog.text, borderColor:self.props.themes.live.dialog.lines}}>
              <AccountCharts isOrder={!isPerformance} chip={chip} slot={slot} isAnti={isAnti} {...this.props} />
            </div>


          )
          :  (
              <div className={classes.Content}>
                <OrderCharts position={slot.position} moveChipToSlot={this.props.moveChipToSlot} {...this.props} />
                {/* // performance={performance}
                // rankingError={rankingError}
                // rankingLoading={rankingLoading}
                // rankingData={rankingData}
                // chip={chip}
                // slot={slot}
                // submitBetHandler={submitBetHandler}
                // close={close} */}
              </div>
          ) 
          }
          {/* <div className={classes.ActionFooter}>
            <button onClick={close}>Cancel</button>
            <button className={classes.Submit} onClick={submitBetHandler}>
              Place Bet Order
            </button>
          </div> */}
        </div>
      );
    }
}
