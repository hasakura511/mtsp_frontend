import React from "react";
import ChipsConfig from "../../ChipsConfig";
import classes from "./Dashboard.css";
import chipIcon from "../../../../assets/images/chip-icon.png";
import lossIcon from "../../../../assets/images/loss-icon.png";
import gainIcon from "../../../../assets/images/gain-icon.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { LongShortMap } from "../../Config";

const stateToProps = state => {
  return {
    currentBets: state.betting.currentBets,
    pastBets: state.betting.pastBets,
    accounts: state.betting.accounts
  };
};

const dashboard = props => {
  const { currentBets, pastBets, accounts } = props;
  const netPnl = Object.values(currentBets)
      .map(bet => (bet ? bet.change || 0 : 0))
      .reduce((a, c) => a + c, 0),
    netStartAmount = ChipsConfig.reduce(
      (acc, chip) => acc + chip.accountValue,
      0
    ),
    netChangePercent = netPnl / netStartAmount * 100;
  return (
    <div style={{ backgroundColor: "#e0f1f5" }}>
      <table className={classes.Table}>
        <thead>
          <tr>
            <th>Account</th>
            <th>Current Bet</th>
            <th>Previous Bet</th>
            <th>Gains/Losses</th>
            <th>Account Values</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {ChipsConfig.map(({ accountId, display }) => {
            const lpBet = pastBets[accountId];
            const lcBet = currentBets[accountId];
            return (
              <tr key={`dashboard-row-${accountId}`}>
                <td>
                  <div className={classes.Cell + " " + classes.Flex}>
                    <img src={chipIcon} />
                    <strong>{display}</strong>
                  </div>
                </td>
                <td>
                  <div className={classes.Cell}>
                    {lcBet ? (
                      <p>
                        <span>{`${lcBet.isAnti ? "Anti" : ""} ${
                          LongShortMap[lcBet.position]
                        }`}</span>
                        <span>{`MOC(${lcBet.bettingDate})`}</span>
                      </p>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div className={classes.Cell}>
                    {lpBet ? (
                      <p>
                        <span>{LongShortMap[lpBet.position]}</span>
                        <span>{`MOC(${lpBet.bettingDate})`}</span>
                      </p>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                    {lcBet && lcBet.change ? (
                      <p style={{ width: "auto" }}>
                        <img src={lcBet.change > 0 ? gainIcon : lossIcon} />
                        ${Math.abs(lcBet.change).toLocaleString("en")} ({(
                          lcBet.changePercent * 100
                        ).toFixed(2)}%)
                      </p>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                    {`$${accounts
                      .find(account => accountId === account.accountId)
                      .accountValue.toLocaleString("en")}`}
                  </div>
                </td>
                <td>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                    {lpBet ? lpBet.updateDate : null}
                  </div>
                </td>
              </tr>
            );
          })}
          <tr>
            <th>
              <div className={classes.Cell}>
                Totals: ${netStartAmount.toLocaleString("en")}
              </div>
            </th>
            <td />
            <td />
            <td>
              <div
                className={classes.Cell}
                style={{ justifyContent: "center" }}
              >
                <p style={{ width: "auto" }}>
                  <img src={netPnl > 0 ? gainIcon : lossIcon} />
                  ${Math.abs(netPnl).toLocaleString(
                    "en"
                  )} ({netChangePercent.toFixed(3)}%)
                </p>
              </div>
            </td>
            <td>
              <div className={classes.Cell}>
                {`$${accounts
                  .map(({ accountValue }) => accountValue)
                  .reduce((acc, inc) => acc + inc, 0)
                  .toLocaleString("en")}`}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

dashboard.propTypes = {
  currentBets: PropTypes.object.isRequired,
  pastBets: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired
};

export default connect(stateToProps)(dashboard);
