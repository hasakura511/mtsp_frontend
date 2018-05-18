import React from "react";
import ChipsConfig from "../../ChipsConfig";
import classes from "./Dashboard.css";
import chipIcon from "../../../../assets/images/chip-icon.png";
import lossIcon from "../../../../assets/images/loss-icon.png";
import gainIcon from "../../../../assets/images/gain-icon.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toSystem, toAntiSystem } from "../../Config";

import { toSlashDate } from "../../../../util";
import ClockLoader from "../../../../components/UI/ClockLoader/ClockLoader";

var boardMode='practice';

const stateToProps = state => {
  return {
    currentBets: state.betting.currentBets,
    pastBets: state.betting.pastBets,
    accounts: state.betting.accounts,
    simulatedDate: state.betting.simulatedDate
  };
};

const dashboard = props => {
  const { currentBets, pastBets, accounts, simulatedDate, loading } = props;
  const netPnl = Object.values(pastBets)
      .map(bet => (bet ? bet.change || 0 : 0))
      .reduce((a, c) => a + c, 0),
    netStartAmount = ChipsConfig.reduce(
      (acc, chip) => acc + chip.accountValue,
      0
    ),
    netChangePercent = netPnl / netStartAmount * 100;

  const netFinalAmount = accounts
    .map(({ accountValue }) => accountValue)
    .reduce((acc, inc) => acc + inc, 0);
  const netCumChangePercent =
    (netFinalAmount - netStartAmount) / netStartAmount * 100;
  return (
    <div style={{ backgroundColor: "#e0f1f5", position: "relative" }}>
      <ClockLoader show={loading} />
      <table className={classes.Table}>
        <thead>
          <tr>
            <th>Starting Account Values</th>
            <th>Current Bet</th>
            <th>Previous Bet</th>
            <th>Previous Bet Gains/Losses</th>
            <th>Account Values</th>
            {boardMode == 'live' ? (
              <th>Lockdown</th>
            ) : null
            }
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {ChipsConfig.map(({ accountId, display, accountValue }) => {
            const lpBet = pastBets[accountId];
            const lcBet = currentBets[accountId];
            const account = accounts.find(
              account => accountId === account.accountId
            );

            const cummPercentChange =
              (account.accountValue - accountValue) / accountValue * 100;

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
                        <span>{`${
                          lcBet.isAnti
                            ? toAntiSystem(lcBet.position)
                            : toSystem(lcBet.position)
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
                        <span>{`${
                          lpBet.isAnti
                            ? toAntiSystem(lpBet.position)
                            : toSystem(lpBet.position)
                        }`}</span>&nbsp;
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
                    {lpBet !== null ? (
                      <p style={{ width: "auto" }}>
                        {lpBet.change ? (
                          <img
                            src={
                              lpBet.change > 0
                                ? gainIcon
                                : lpBet.change < 0 ? lossIcon : ""
                            }
                          />
                        ) : null}
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
                    {`$${account.accountValue.toLocaleString("en")}`}&nbsp;
                    <span
                      style={{
                        color:
                          cummPercentChange > 0
                            ? "green"
                            : cummPercentChange < 0 ? "red" : "black"
                      }}
                    >
                      ( {cummPercentChange.toFixed(2)}% )
                    </span>
                  </div>
                </td>
                {boardMode == 'live' ? (
                <td>
                <div
                  className={classes.Cell}
                  style={{ justifyContent: "center" }}
                >
                  {toSlashDate(simulatedDate)} 5PM EST
                </div>
              </td>
              ) : null
                }
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
                  {netPnl ? (
                    <img src={netPnl > 0 ? gainIcon : lossIcon} />
                  ) : null}
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
                {`$${netFinalAmount.toLocaleString("en")}`}&nbsp;
                <span
                  style={{
                    color:
                      netCumChangePercent > 0
                        ? "green"
                        : netCumChangePercent < 0 ? "red" : "black"
                  }}
                >
                  ( {netCumChangePercent.toFixed(2)}% )
                </span>
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
  simulatedDate: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
};

export default connect(stateToProps)(dashboard);
