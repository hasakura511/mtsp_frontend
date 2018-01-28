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
  return (
    <div className={classes.Order}>
      <div className={classes.TitleRow}>
        <div className={classes.Left}>
          <p>Bet: </p>
          <Chip chip={props.chip} />
          <Slot {...props.slot} heldChips={[]} />
          <div className={classes.Systems}>
            <ul>
              {getSystems(props.slot).map(system => (
                <li key={system.id}>
                  <p>{system.display}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={classes.Right}>
          <p>System</p>
          <Switch toggle={props.toggleSystem} />
          <p>Anti-System</p>
        </div>
      </div>
      <div className={classes.Content}>
        <OrderCharts performance={props.performance} />
      </div>
    </div>
  );
};

order.propTypes = {
  slot: PropTypes.object.isRequired,
  chip: PropTypes.object.isRequired,
  performance: PropTypes.object.isRequired,
  toggleSystem: PropTypes.func.isRequired
};

export default order;
