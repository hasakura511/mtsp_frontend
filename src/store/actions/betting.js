import * as actionTypes from "./actionTypes";

export const nextDay = () => {
  return {
    type: actionTypes.MOVE_TO_NEXT_DAY
  };
};

export const updateDate = simdate => {
  return {
    type: actionTypes.UPDATE_DATE,
    simdate
  };
};

export const initializeData = data => {
  return {
    type: actionTypes.INITIALIZE_DATA,
    data
  };
};

export const updateBet = ( topSystems,
  bottomSystems,
  leftSystems,
  rightSystems,
  inGameChips, 
  accounts) => {
  return {
    type: actionTypes.UPDATE_BET,
    topSystems,
    bottomSystems,
    leftSystems,
    rightSystems,
    inGameChips,
    accounts
  };
};

export const finishLoading = () => {
  return {
    type: actionTypes.FINISH_LOADING
  };
};

export const toggleMode = () => {
  return {
    type: actionTypes.RESET_BOARD
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

export const reset = () => {
  return {
    type: actionTypes.RESET_BOARD
  };
};
