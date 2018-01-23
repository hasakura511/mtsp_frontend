import React, { Component } from "react";
import ChipsConfig from "../../ChipsConfig";
import {
  accountValue,
  lastUpdatedDate,
  lastPastBet,
  lastCurrentBet
} from "../../BettingConfig";
import classes from "./Dashboard.css";
import chipIcon from "../../../../assets/images/chip-icon.png";
import lossIcon from "../../../../assets/images/loss-icon.png";
import gainIcon from "../../../../assets/images/gain-icon.png";

const dashboard = () => {
  return (
    <div>
      <table className={classes.Table}>
        <thead>
          <tr>
            <th>Current Bet</th>
            <th>Past Bet</th>
            <th>Gains/Losses</th>
            <th>Account Values</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {ChipsConfig.map(chip => {
            const lpBet = lastPastBet(chip.accountId);
            const lcBet = lastCurrentBet(chip.accountId);
            return (
              <tr key={"dashboard-row-" + chip.accountId}>
                <td>
                  <div className={classes.Cell}>
                    <img src={chipIcon} />
                    <strong>{chip.display}</strong>
                    {lcBet ? (
                      <p>
                        <span>{lcBet.slot}</span>
                        <span>{"(MOC " + lcBet.bettingDate + ")"}</span>
                      </p>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div className={classes.Cell}>
                    <img src={chipIcon} />
                    <strong>{chip.display}</strong>
                    {lpBet ? (
                      <p>
                        <span>{lpBet.slot}</span>
                        <span>{"(MOC " + lpBet.bettingDate + ")"}</span>
                      </p>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                    {lpBet ? (
                      <p style={{ width: "auto" }}>
                        <img src={lpBet.change > 0 ? gainIcon : lossIcon} />
                        ${Math.abs(lpBet.change)} ({lpBet.changePercent}%)
                      </p>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                    {lpBet
                      ? "$" + accountValue(chip.accountId).toFixed(3)
                      : null}
                  </div>
                </td>
                <td>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                    {lpBet ? lastUpdatedDate(chip.accountId) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default dashboard;
