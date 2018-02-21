import * as actionTypes from "../actions/actionTypes";
import ChipsConfig from "../../containers/_Game/ChipsConfig";
import { clone, toSlashDate, uniq } from "../../util";

const initialState = {
  // example bet:
  // {"5K_0_1516105730": {
  //   bettingDate: "2018/01/06",
  //   position: "1",
  //   bettingTime: null,
  //   changePercent: 0.01, //NOTE: NOT NORMALIZED TO 100, INSTEAD TO 1
  //   change: 25.0,
  //   amount: 5000,
  //   updateDate: ""
  // }}
  pastBets: ChipsConfig.map(({ accountId }) => accountId).reduce(
    (acc, curr) => {
      acc[curr] = null;
      return acc;
    },
    {}
  ),
  currentBets: ChipsConfig.map(({ accountId }) => accountId).reduce(
    (acc, curr) => {
      acc[curr] = null;
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
      acc[curr] = null;
      return acc;
    },
    {}
  )
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_BET: {
      const accountId = Object.keys(action.bet)[0];
      const pastBet = {};
      pastBet[accountId] = state.currentBets[accountId];
      return {
        ...state,
        currentBets: {
          ...state.currentBets,
          ...action.bet
        },
        pastBets: {
          ...state.pastBets,
          ...pastBet
        }
      };
    }
    case actionTypes.MOVE_TO_NEXT_DAY: {
      const { last3DaysProfits, simulatedDate, currentBets, accounts } = state;
      // const modifiedPastBets = {
      //   ...clone(pastBets),
      //   ...clone(clean(currentBets))
      // };

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

      if (dates.indexOf(simulatedDate) === dates.length - 1) {
        return state;
      }

      // loop this currentBets object `for` all the accounts
      for (let key in modifiedCurrentBets) {
        // ***hack*** to avoid crash when we dont have pnlData for that particular account
        // which is possible in tier 0 as the pnlData is fed from performanceData and
        // that happens when a new bet is placed which only gets performanceData for the account
        // that particular bet is using.
        // Remove hack when we have proper data feed for changePercent per account basis

        if (
          last3DaysProfits[key] &&
          last3DaysProfits[key][simulatedDate] &&
          modifiedCurrentBets[key] !== null
        ) {
          const isAnti = modifiedCurrentBets[key].isAnti;
          modifiedCurrentBets[key].changePercent =
            (last3DaysProfits[key][simulatedDate].changePercent || 0) *
            (isAnti ? -1 : 1);
          modifiedCurrentBets[key].change =
            modifiedCurrentBets[key].changePercent *
            accounts.find(({ accountId }) => accountId === key).accountValue;
          modifiedCurrentBets[key].updateDate = toSlashDate(simulatedDate);
        }
      }

      const modifiedAccounts = accounts.map(({ accountId, accountValue }) => {
        const { changePercent } = modifiedCurrentBets[accountId] || {};
        return {
          accountId,
          accountValue: accountValue * (1 + (changePercent || 0))
        };
      });

      return {
        ...state,
        accounts: modifiedAccounts,
        currentBets: modifiedCurrentBets,
        simulatedDate: dates[dates.indexOf(simulatedDate) + 1] || simulatedDate
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
    default:
      return state;
  }
};

export default reducer;
