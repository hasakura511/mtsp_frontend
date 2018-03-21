import React from "react";
import ChipsConfig from "../../ChipsConfig";
import classes from "./Dashboard.css";
import chipIcon from "../../../../assets/images/chip-icon.png";
import lossIcon from "../../../../assets/images/loss-icon.png";
import gainIcon from "../../../../assets/images/gain-icon.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { LongShortMap } from "../../Config";

import { toSlashDate } from "../../../../util";

const stateToProps = state => {
  return {
    currentBets: state.betting.currentBets,
    pastBets: state.betting.pastBets,
    accounts: state.betting.accounts,
    simulatedDate: state.betting.simulatedDate
  };
};

const dashboard = props => {
  const { currentBets, pastBets, accounts, simulatedDate } = props;
  const netPnl = Object.values(pastBets)
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
            <th>Starting Account Values</th>
            <th>Current Bet</th>
            <th>Previous Bet</th>
            <th>Previous Bet Gains/Losses</th>
            <th>Account Values</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {ChipsConfig.map(({ accountId, display }) => {
            const lpBet = pastBets[accountId];
            const lcBet = currentBets[accountId];
            const account = accounts.find(
              account => accountId === account.accountId
            );

            //eslint-disable-next-line
            // if (lpBet) console.log(account.accountValue - lpBet.change);

            //eslint-disable-next-line
            // console.log(account.accountValue);

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
                        <span>{`MOC (${lcBet.bettingDate.substring(5)})`}</span>
                      </p>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div className={classes.Cell}>
                    {lpBet ? (
                      <p>
                        <span>{LongShortMap[lpBet.position]}</span>
                        <span>{`MOC(${lpBet.bettingDate.substring(5)})`}</span>
                      </p>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                    {lpBet && lpBet.change ? (
                      <p style={{ width: "auto" }}>
                        <img
                          src={
                            lpBet.change > 0
                              ? gainIcon
                              : lpBet.change < 0 ? lossIcon : ""
                          }
                          alt="No Image"
                        />
                        ${Math.abs(Math.round(lpBet.change)).toLocaleString(
                          "en"
                        )}{" "}
                        (
                        <span
                          style={{
                            color:
                              lpBet.change > 0
                                ? "green"
                                : lpBet.change < 0 ? "red" : "black"
                          }}
                        >
                          {(
                            lpBet.change /
                            (account.accountValue - lpBet.change) *
                            100
                          ).toFixed(2)}%
                        </span>
                        )
                      </p>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                    {`$${account.accountValue.toLocaleString("en")}`}
                  </div>
                </td>
                <td>
                  <div
                    className={classes.Cell}
                    style={{ justifyContent: "center" }}
                  >
                    {toSlashDate(simulatedDate)} 5PM EST
                  </div>
                </td>
              </tr>
            );
          })}
          <tr className={classes.LastRow}>
            <th>
              <div className={classes.Cell}>
                Total: ${netStartAmount.toLocaleString("en")}
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
                  <img
                    src={netPnl > 0 ? gainIcon : netPnl < 0 ? lossIcon : ""}
                  />
                  ${Math.abs(Math.round(netPnl)).toLocaleString("en")} (
                  <span
                    style={{
                      color: netPnl > 0 ? "green" : netPnl < 0 ? "red" : "black"
                    }}
                  >
                    {netChangePercent.toFixed(2)}%
                  </span>
                  )
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
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

dashboard.propTypes = {
  currentBets: PropTypes.object.isRequired,
  pastBets: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  simulatedDate: PropTypes.string.isRequired
};

export default connect(stateToProps)(dashboard);
