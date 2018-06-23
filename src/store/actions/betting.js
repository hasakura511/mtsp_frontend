import * as actionTypes from "./actionTypes";

export const nextDay = () => {
  return {
    type: actionTypes.MOVE_TO_NEXT_DAY
  };
};

export const updateDate = simdate => {
  return {
    type: actionTypes.UPDATE_DATE,
  };
};

export const showHeatmap = id => {
  return {
    type: actionTypes.SHOW_HEATMAP,
    id
  };
};

export const initializeData = data => {
  return {
    type: actionTypes.INITIALIZE_DATA,
    data,
  };
};

export const showPerformance = (account_id, chip=null) => {
  return {
    type: actionTypes.SHOW_PERFORMANCE,
    account_id,
    chip
  }
}

export const showLockdownDialog = show => {
  return {
    type: actionTypes.SHOW_LOCKDOWN_DIALOG,
    show,
  }
}


export const showLeaderDialog = show => {
  return {
    type: actionTypes.SHOW_LEADER_DIALOG,
    show,
  }
}


export const initializeHeatmap = (account_id, link, sym='') => {
  return {
    type: actionTypes.INITIALIZE_HEATMAP,
    account_id, 
    link, 
    sym
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

export const startLoading = () => {
  return {
    type: actionTypes.START_LOADING
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


export const setMute = (isMute) => {
  return {
    type: actionTypes.SET_MUTE,
    isMute
  };
};

export const reset = () => {
  return {
    type: actionTypes.RESET_BOARD
  };
};
