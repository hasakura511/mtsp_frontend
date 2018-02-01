import * as actionTypes from "./actionTypes";

export const nextDay = () => {
  return {
    type: actionTypes.MOVE_TO_NEXT_DAY
  };
};

export const addBet = bet => {
  return {
    type: actionTypes.ADD_BET,
    bet
  };
};

export const addLast3DaysProfit = last3DaysProfit => {
  return {
    type: actionTypes.ADD_LAST_3_DAYS_PROFIT,
    last3DaysProfit
  };
};
