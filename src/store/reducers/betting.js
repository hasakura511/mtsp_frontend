import * as actionTypes from "../actions/actionTypes";
import ChipsConfig from "../../containers/_Game/ChipsConfig";
import { clone, toSlashDate, uniq, toIntegerDate, clean } from "../../util";

const initialState = {
  // example bet:
  // {"5K_0_1516105730": {
  //   bettingDate: "2018/01/06",
  //   position: "1",
  //   bettingTime: null,
  //   changePercent: 0.01, //NOTE: NOT NORMALIZED TO 100, INSTEAD TO 1
  //   change: 25.0,
  //   amount: 5000,
  // }}
  pastBets: ChipsConfig.map(({ accountId }) => accountId).reduce(
    (acc, curr) => {
      acc[curr] = {
        bettingDate: "2018/02/01",
        position: "off",
        isAnti: false,
        change: 0
      };
      return acc;
    },
    {}
  ),
  currentBets: ChipsConfig.map(({ accountId }) => accountId).reduce(
    (acc, curr) => {
      acc[curr] = { bettingDate: "2018/02/02", position: "off", isAnti: false };
      return acc;
    },
    {}
  ),
  accounts: ChipsConfig.map(({ accountId, accountValue }) => ({
    accountId,
    accountValue
  })),
  simulatedDate: "20180201",
  /**
   * Last 3 days profit
   * __TEMPERORY__CODE__
   * @example {"5K_0_1516105730": {
   *  position: 7, //or "7"
   *  "20180110": {
   *    changePercent: 0.1
   *  },
   *  "20180109": {
   *    changePercent: 0.1
   *  },
   *  "20180108": {
   *    changePercent: 0.1
   *  }
   * }}
   */
  last3DaysProfits: ChipsConfig.map(({ accountId }) => accountId).reduce(
    (acc, curr) => {
      acc[curr] = {
        "20180201": {
          change: 0
        },
        "20180202": {
          change: 0
        },
        "20180205": {
          change: 0
        },
        "20180206": {
          change: 0
        },
        "20180207": {
          change: 0
        },
        "20180208": {
          change: 0
        },
        position: "off"
      };
      return acc;
    },
    {}
  )
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_BET: {
      const accountId = Object.keys(action.bet)[0];

      const { last3DaysProfits } = state;

      // __TEMPERORY_CODE__
      // update the date of this action.bet to be the next market date from current simulated date which is already passsed into the betting object
      const dates = uniq(
        Object.values(last3DaysProfits)
          // ***hack*** to avoid crash when we dont have pnlData for that particular account
          // which is possible in tier 0 as the pnlData is fed from performanceData and
          // that happens when a new bet is placed which only gets performanceData for the account
          // that particular bet is using.
          // Remove hack when we have proper data feed for changePercent per account basis
          .map(profitObj => Object.keys(profitObj || {}))
          .reduce((acc, curr) => acc.concat(curr), [])
          .filter(date => !isNaN(Number(date)))
          .sort((d1, d2) => Number(d1) > Number(d2))
      );

      action.bet[accountId].bettingDate =
        toSlashDate(
          dates[
            dates.indexOf(
              toIntegerDate(action.bet[accountId].bettingDate).toString()
            ) + 1
          ]
        ) || "2018/02/09";

      return {
        ...state,
        currentBets: {
          ...state.currentBets,
          ...action.bet
        }
      };
    }

    case actionTypes.MOVE_TO_NEXT_DAY: {
      const {
        last3DaysProfits,
        simulatedDate,
        currentBets,
        accounts,
        pastBets
      } = state;

      const modifiedPastBets = {
        ...clone(pastBets),
        ...clone(clean(currentBets))
      };

      const modifiedCurrentBets = clone(currentBets);

      const dates = uniq(
        Object.values(last3DaysProfits)
          // ***hack*** to avoid crash when we dont have pnlData for that particular account
          // which is possible in tier 0 as the pnlData is fed from performanceData and
          // that happens when a new bet is placed which only gets performanceData for the account
          // that particular bet is using.
          // Remove hack when we have proper data feed for changePercent per account basis
          .map(profitObj => Object.keys(profitObj || {}))
          .reduce((acc, curr) => acc.concat(curr), [])
          .filter(date => !isNaN(Number(date)))
          .sort((d1, d2) => Number(d1) > Number(d2))
      );

      // console.log(dates);

      if (dates.indexOf(simulatedDate) === dates.length - 1) {
        return state;
      }

      // Taking today's date:
      const newDate = dates[dates.indexOf(simulatedDate) + 1] || simulatedDate;

      // loop this currentBets object `for` all the accounts
      for (let key in modifiedPastBets) {
        // ***hack*** to avoid crash when we dont have pnlData for that particular account
        // which is possible in tier 0 as the pnlData is fed from performanceData and
        // that happens when a new bet is placed which only gets performanceData for the account
        // that particular bet is using.
        // Remove hack when we have proper data feed for change per account basis

        if (
          last3DaysProfits[key] &&
          last3DaysProfits[key][newDate] &&
          modifiedPastBets[key] !== null
        ) {
          const isAnti = modifiedPastBets[key].isAnti;

          modifiedPastBets[key].change =
            (last3DaysProfits[key][newDate].change || 0) * (isAnti ? -1 : 1);

          // moving the date to next trading day in currentBets
          modifiedCurrentBets[key].bettingDate =
            toSlashDate(
              dates[
                dates.indexOf(
                  toIntegerDate(modifiedCurrentBets[key].bettingDate).toString()
                ) + 1
              ]
              // ) || modifiedCurrentBets[key].bettingDate;
            ) || "2018/02/09";
        }
      }

      const modifiedAccounts = accounts.map(({ accountId, accountValue }) => {
        const { change } = modifiedPastBets[accountId] || {};
        return {
          accountId,
          accountValue: Math.floor(accountValue + (change || 0))
        };
      });

      return {
        ...state,
        accounts: modifiedAccounts,
        currentBets: modifiedCurrentBets,
        simulatedDate: newDate,
        pastBets: modifiedPastBets
      };
    }
    case actionTypes.ADD_LAST_3_DAYS_PROFIT: {
      return {
        ...state,
        last3DaysProfits: {
          ...state.last3DaysProfits,
          ...action.last3DaysProfit
        }
      };
    }
    case actionTypes.RESET_BOARD: {
      return {
        ...initialState
      };
    }
    default:
      return state;
  }
};

export default reducer;
