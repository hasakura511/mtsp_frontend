import React from "react";
import PropTypes from "prop-types";
import Slot from "../../containers/Slot/Slot";
import Chip from "../_Chip/_Chip";
import classes from "./Order.css";
import Switch from "../../../../components/UI/Switch/Switch";
import OrderCharts from "../../containers/OrderCharts/OrderCharts";

const getSystems = slot => {
  return Object.keys(slot)
    .filter(key => key.indexOf("System") !== -1)
    .map(key => slot[key]);
};

const order = props => {
  const {
    slot,
    performance,
    toggleSystem,
    rankingError,
    rankingLoading,
    rankingData,
    chip,
    submitBetHandler,
    close
  } = props;
  return (
    <div className={classes.Order}>
      <div className={classes.TitleRow}>
        <div className={classes.Left}>
          <p>Bet: </p>
          <Chip chip={chip} />
          <Slot
            {...slot}
            heldChips={[]}
            width={isNaN(Number(slot.position)) ? "100px" : "60"}
          />
          <div className={classes.Systems}>
            <ul>
              {getSystems(slot).map(system => (
                <li key={`${system.id}${Math.random().toFixed(3)}`}>
                  <p>{system.display}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={classes.Right}>
          <p>System</p>
          <Switch toggle={toggleSystem} />
          <p>Anti-System</p>
        </div>
      </div>
      <div className={classes.Content}>
        <OrderCharts
          performance={performance}
          position={slot.position}
          rankingError={rankingError}
          rankingLoading={rankingLoading}
          rankingData={rankingData}
          chip={chip}
          slot={slot}
        />
      </div>
      <div className={classes.ActionFooter}>
        <button onClick={close}>Cancel</button>
        <button className={classes.Submit} onClick={submitBetHandler}>
          Place Bet Order
        </button>
      </div>
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
  close: PropTypes.func.isRequired
};

export default order;
