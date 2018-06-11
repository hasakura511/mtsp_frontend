import React from "react";
import PropTypes from "prop-types";
import Slot from "../../containers/Slot/Slot";
import Chip from "../_Chip/_Chip";
import classes from "./Order.css";
// import Switch from "../../../../components/UI/Switch/Switch";
import OrderCharts from "../../containers/OrderCharts/OrderCharts";
import AccountCharts from "../../components/AccountCharts/AccountCharts";
import { toSystem  } from "../../Config";
import Sound from 'react-sound';
const getSystems = slot => {
  return Object.keys(slot)
    .filter(key => key.indexOf("System") !== -1)
    .map(key => slot[key]);
};



const order = props => {
  const { slot, chip, setAnti, setNotAnti, isAnti, toAntiSystem, submitBetHandler, close, isLive,  dictionary_strategy, isPerformance } = props;
  console.log(slot);
  var isNumbered;
  if (!isPerformance) {
    isNumbered = !isNaN(Number(slot.position));
  }

  return (
    <div className={classes.Order}>
      {!isPerformance ? (
      <div className={classes.TitleRow}>
        <div className={classes.Left}>
          <div
            className={classes.ElementContainer}
            style={{ padding: "0px", width: !isNumbered ? "160px" : "auto" }}
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
            style={{ paddingTop: "15px" }}
          >
            <Chip chip={chip} />
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
            <button className={classes.Submit} onClick={submitBetHandler}>
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
        
        <div
          className={classes.ElementContainer}
          style={{ paddingTop: "15px" }}
        >
          <Chip chip={chip} />
        </div>
        <div           style={{ minWidth:"100px", padding: "15px" }}
>
           {chip.tier}<br/>
            Tier {chip.chip_tier}<br/>
            {chip.chip_tier_text}<br/>
            Rank: {chip.rank}<br/>
        </div>
        
      <table style={{border:"none", borderCollapse: "collapse"}}>
      <thead  style={{border:"none"}}>
        <tr style={{border:"none"}}>
        <th  style={{border:"none"}}>
            Starting Value:
            </th>
            <th  style={{border:"none"}}>
            Account Value:
            </th>
            <th  style={{border:"none"}}>
            Total Margin:
            </th>
            <th  style={{border:"none"}}>
            Cumulative %Chg.
            </th>
            <th  style={{border:"none"}}>
            Previous %Chg.:
            </th>
            <th  style={{border:"none"}}>
            Markets in Portfolio:
            </th>
            <th  style={{border:"none"}}>
              Age
            </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{border:"1px", "padding":"1px"}}>
            <td style={{borderLeft:"1px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
            $ {chip.starting_value}
            </td>            
            <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>

            $ {chip.account_value}
            </td>            
            <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
            $ {chip.total_margin}
            </td>            
            <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
            {chip.pnl_cumpct} %
            </td>            
            <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
            {chip.pnl_pct} %
            </td>            
            <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"none"}}>
              {chip.num_markets}
            </td>            
            <td style={{borderLeft:"0px solid black",borderTop:"1px solid black",borderBottom:"1px solid black",borderRight:"1px solid black"}}>
              {chip.age}
            </td></tr>
            </tbody>
            </table>
      </div>
    )}
      
      {isLive ? (

        <div className={classes.Content}>
          <AccountCharts {...props} />
        </div>


      ) :  (
          <div className={classes.Content}>
            <OrderCharts position={slot.position} {...props} />
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
};

order.propTypes = {
  slot: PropTypes.object,
  chip: PropTypes.object.isRequired,
  isLive: PropTypes.bool.isRequired,
  performance: PropTypes.object,
  setAnti: PropTypes.func.isRequired,
  setNotAnti: PropTypes.func.isRequired,
  toAntiSystem: PropTypes.func.isRequired,
  rankingError: PropTypes.object,
  rankingData: PropTypes.array,
  rankingLoading: PropTypes.bool.isRequired,
  submitBetHandler: PropTypes.func.isRequired,
  isAnti: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  dictionary_strategy:PropTypes.object.isRequired,
  isPerformance:PropTypes.bool,
  performance_account_id:PropTypes.string,
};

export default order;
