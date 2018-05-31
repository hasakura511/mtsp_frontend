import React from "react";
import ChipsConfig from "../../ChipsConfig";
import classes from "./Dashboard.css";
import chipIcon from "../../../../assets/images/chip-icon.png";
import lossIcon from "../../../../assets/images/loss-icon.png";
import gainIcon from "../../../../assets/images/gain-icon.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toSystem, toAntiSystem } from "../../Config";

import { toSlashDate, toSlashTime } from "../../../../util";
import ClockLoader from "../../../../components/UI/ClockLoader/ClockLoader";

const stateToProps = state => {
  return {
    currentBets: state.betting.currentBets,
    pastBets: state.betting.pastBets,
    accounts: state.betting.accounts,
    simulatedDate: state.betting.simulatedDate,
    loading:state.betting.loading,
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
  console.log(accounts);
  return (
    <div style={{ backgroundColor: "#e0f1f5", position: "relative" }}>
      <ClockLoader show={loading} />
      <table className={classes.Table}>
        <thead>
          <tr>
            <th><b>Starting Values</b></th>
            <th><b>Next Bet</b></th>
            <th><b>Current Bet</b></th>
            <th><b>Current PnL</b></th>
            <th><b>Account Values</b></th>
            <th><span style={{"float": "left", "width": "80%", "textAlign": "left"}}>
                  <b>Last Update</b>
                </span>
                <span style={{"float": "left", "width": "20%", "textAlign": "right"}}>
                </span>
              

            </th>
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
            console.log(lpBet);
            console.log(lcBet)
            return (
              <tr key={`dashboard-row-${accountId}`}>
                <td>
                  <div className={classes.Cell + " " + classes.Flex}>
                    <img src={chipIcon} width="25" />
                    <strong>$ {display}</strong>
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
                <b>Total: ${netStartAmount.toLocaleString("en")}</b>
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
                  <b>
                  {netPnl ? (
                    <img src={netPnl > 0 ? gainIcon : lossIcon} />
                  ) : null}
                  <b>
                  ${Math.abs(Math.round(netPnl)).toLocaleString("en")}
                  </b>
                   (
                  <span
                    style={{
                      color: netPnl > 0 ? "green" : netPnl < 0 ? "red" : "black"
                    }}
                  >
                  <b>
                    {netChangePercent.toFixed(2)}%
                  </b>
                  </span>
                  )
                  </b>
                </p>
              </div>
            </td>
            
            <td>
              <div className={classes.Cell}>
              <b>
                {`$${netFinalAmount.toLocaleString("en")}`}&nbsp;
              </b>
                <span
                  style={{
                    color:
                      netCumChangePercent > 0
                        ? "green"
                        : netCumChangePercent < 0 ? "red" : "black"
                  }}
                >
                <b>
                  ( {netCumChangePercent.toFixed(2)}% )
                </b>
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
