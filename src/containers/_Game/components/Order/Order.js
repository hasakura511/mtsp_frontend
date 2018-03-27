import React from "react";
import PropTypes from "prop-types";
import Slot from "../../containers/Slot/Slot";
import Chip from "../_Chip/_Chip";
import classes from "./Order.css";
// import Switch from "../../../../components/UI/Switch/Switch";
import OrderCharts from "../../containers/OrderCharts/OrderCharts";

const getSystems = slot => {
  return Object.keys(slot)
    .filter(key => key.indexOf("System") !== -1)
    .map(key => slot[key]);
};

const order = props => {
  const { slot, chip, toggleSystem, isAnti, submitBetHandler, close } = props;
  const isNumbered = !isNaN(Number(slot.position));
  return (
    <div className={classes.Order}>
      <div className={classes.TitleRow}>
        <div className={classes.Left}>
          <div
            className={classes.ElementContainer}
            style={{ padding: "0px", width: !isNumbered ? "150px" : "auto" }}
          >
            <Slot
              {...slot}
              heldChips={[]}
              width={!isNumbered ? "150px" : "60px"}
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
                onChange={toggleSystem}
              />
              <label htmlFor="system-radio" style={{ color: "#8884d8" }}>
                System
              </label>
            </div>
            <div style={{ display: "flex", width: "100%" }}>
              <input
                type="radio"
                id="anti-system-radio"
                checked={isAnti}
                onChange={toggleSystem}
              />
              <label htmlFor="anti-system-radio" style={{ color: "#e12f48" }}>
                Anti-System
              </label>
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
          <p style={{ color: "#e12f48" }}>Anti-System</p>
        </div> */}
      </div>
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
  slot: PropTypes.object.isRequired,
  chip: PropTypes.object.isRequired,
  performance: PropTypes.object.isRequired,
  toggleSystem: PropTypes.func.isRequired,
  rankingError: PropTypes.object,
  rankingData: PropTypes.array,
  rankingLoading: PropTypes.bool.isRequired,
  submitBetHandler: PropTypes.func.isRequired,
  isAnti: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};

export default order;
