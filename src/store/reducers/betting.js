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
  themes: {'live':{'heatmap':{'heatmap_cold':'#000000','heatmap_hot':'#FFFFFF'},
                   'background':{'bottom':'#000000', 'middle':'#FFFFFF'}}},
  loading: true,
  isLive:false,
  initializeData: {},
  simulatedDate: "20180201",
  inGameChips: {
    balanceChips: ChipsConfig.map(chip => {
      chip["count"] = 1;
      return chip;
    }),
    bettingChips: [],
  },  
  leftSystems: [
    {
    color: "#FF0000",
    position: "left",
    // display: "Previous\n(10 day)",
    display: "Prev 10",
    type:"",
    id: "PREVIOUS_10D",
    column: "prev10",
    description: "Bet that the 10 day price change will continue",
    short: "Prev 10",
    heldChips: []
    },
    {
    color: "#BE0032",
    position: "left",
    // display: "Previous\n(5 day)",
    display: "Prev 5",
    type:"",
    id: "PREVIOUS_5D",
    column: "prev5",
    description: "Bet that the 5 day price change will continue",
    short: "Prev 5",
    heldChips: []
    }],
  rightSystems: [
    {
      color: "#FFD966 ",
      position: "right",
      display: "A-Trend120",
      type:"",
      id: "ANTI_ZZ-TREND_120D",
      column: "antiZz120",
      description: "Bet against the trends as seen from a 120 day perspective.",
      short: "A-Trend120",
      heldChips: []
    },
    {
      color: "#9D67D1",
      position: "right",
      display: "Mode 30",
      id: "ZZ-MODE_30D",
      column: "zz30",
      description:
        "Bet on recent market swings as seen from a 30 day perspective.",
      short: "Mode 30",
      heldChips: []
    },
  ],
  topSystems: [
    {
    color: "#F2F3F4",
    position: "top",
    display: "Risk On",
    type:"",
    id: "RISK-ON",
    column: "riskOn",
    description: "Bet on risky assets and against government bonds.",
    short: "Risk On",
    heldChips: []
    },
    {
    color: "#222222",
    position: "top",
    display: "Risk Off",
    type:"",
    id: "RISK-OFF",
    column: "riskOff",
    description: "Bet on government bonds and against risky assets.",
    short: "Risk Off",
    heldChips: []
    },
  ],
  bottomSystems: [ 
    {
    color: "#B84E00",
    position: "bottom",
    display: "A-Season",
    type:"",
    id: "ANTI_SEASONALITY",
    column: "antiSea",
    description: "Bet against long-term seasonal trends.",
    short: "A-Season",
    heldChips: []
    },
    {
    color: "#006256",
    position: "bottom",
    display: "A-ScalpA",
    type:"",
    id: "ANTI_ML-SCALP-ALL",
    column: "antiMlScalpAll",
    description:
      "Bet against prediction models that try to predict the next day.",
    short: "A-ScalpA",
    heldChips: []
    },
    {
    color: "#00C256",
    position: "bottom",
    display: "Big Scalp",
    type:"",
    id: "ML-SCALP-BIG_FB",
    column: "mlScalpBigFb",
    description:
      "Bet on prediction models that try to predict days with big price movements.",
    short: "Big Scalp",
    heldChips: []
    },
    {
    color: "#003773",
    position: "bottom",
    display: "Big Swing",
    type:"",
    id: "ML-SWING-BIG_FB",
    column: "mlSwingBigFb",
    description:
      "Bet on prediction models that try to predict multi-day swings in the market.",
    short: "Big Swing",
    heldChips: []
    },
    {
    color: "#CE8B8B",
    position: "bottom",
    display: "BestF",
    type:"",
    id: "ML-LAST-BEST_FB",
    column: "mlLastBestFb",
    description:
      "Bet on the best prediction models based on the previous day’s results.",
    short: "BestF",
    heldChips: []
    },
    {
    color: "#C69300",
    position: "bottom",
    display: "A-WorstF",
    type:"",
    id: "ANTI_ML-LAST-WORST_FW",
    column: "antiMlLastWorstFw",
    description:
      "Bet against the worst prediction models based on the previous day's results.",
    short: "A-WorstF",
    heldChips: []
    },
  ],
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
    case actionTypes.FINISH_LOADING:
    {
      const loading=false;
      return {
        ...state,
        loading
      };
    }
    case actionTypes.UPDATE_DATE:
    {
        const simulatedDate = action.simdate;
        return {
            ...state,
            simulatedDate
        };
    }
    case actionTypes.UPDATE_BET:
    {
        const topSystems=action.topSystems;
        const bottomSystems=action.bottomSystems;
        const leftSystems=action.leftSystems;
        const rightSystems=action.rightSystems;
        const inGameChips=action.inGameChips;
        const accounts=action.accounts;
        return {
          ...state,
          topSystems,
          bottomSystems,
          leftSystems,
          rightSystems,
          inGameChips,
          accounts
        };
    }
    case actionTypes.INITIALIZE_DATA:
    {
        var initializeData =  action.data;
        var accounts= JSON.parse(action.data.accounts)
        const heatmap = JSON.parse(action.data.heatmap)
        const dictionary_strategy = JSON.parse(action.data.dictionary_strategy)
        const themes = action.data.themes
        const loading=false;
        var hasSystem=false;
        var leftSystems= [],
        rightSystems= [],
        topSystems =[],
        bottomSystems= [];
        var account_list=[];
        var balanceChips=[];
        Object.keys(accounts).map(function(key) {
          const board_config=JSON.parse(accounts[key].board_config_fe);
          accounts[key].board_config_fe=board_config;
          accounts[key].accountId=accounts[key].account_id;
          accounts[key].accountValue=accounts[key].accountValue;

          var chip=accounts[key];
          chip['chip_id']=key;
          chip['count']=1;
          chip['qty']={};
          chip['display']=chip.account_chip_text;
          
          balanceChips.push(chip);
          account_list.push(accounts[key]); 
          
          if (!hasSystem) {
            Object.keys(board_config).map(function(key) {
              var name, strat;
              if (board_config[key].position == 'left') {
                name=board_config[key].id;
                strat=dictionary_strategy[name];
                strat.heldChips=[];       
                strat.column=name;
                strat.display=name;         
                strat.id=name;
                strat.short=strat.board_name;
                strat.position="left";
                leftSystems.push(strat);
              } else if (board_config[key].position == 'right') {
                name=board_config[key].id;
                strat=dictionary_strategy[name];
                strat.heldChips=[];       
                strat.column=name;
                strat.display=name;         
                strat.id=name;
                strat.short=strat.board_name;
                strat.position="right";
                rightSystems.push(strat);
              } else if (board_config[key].position == 'top') {
                name=board_config[key].id;
                strat=dictionary_strategy[name];
                strat.heldChips=[];       
                strat.column=name;
                strat.display=name;         
                strat.id=name;
                strat.short=strat.board_name;
                strat.position="top";
                topSystems.push(strat);
              } else if (board_config[key].position == 'bottom') {
                name=board_config[key].id;
                strat=dictionary_strategy[name];
                strat.heldChips=[];       
                strat.column=name;
                strat.display=name;         
                strat.id=name;
                strat.short=strat.board_name;
                strat.position="bottom";
                bottomSystems.push(strat);
              }  

            });
            hasSystem=true;
          }
        });
      
        var inGameChips = {
          balanceChips: balanceChips,
          bettingChips: []
        }
        initializeData.accounts=account_list;
        initializeData.heatmap=heatmap;
        initializeData.themes=themes;
        initializeData.dictionary_strategy=dictionary_strategy;
        //console.log(leftSystems);
        //console.log(rightSystems);
        //console.log(topSystems);
        //console.log(bottomSystems);
        accounts=account_list;
       
        const isLive=true;
        return {
            ...state,
            initializeData,
            accounts, 
            heatmap,
            themes,
            dictionary_strategy,
            leftSystems,
            rightSystems,
            topSystems,
            bottomSystems,
            loading,
            isLive,
            inGameChips
        };
    }
    case actionTypes.ADD_BET: {
      const accountId = Object.keys(action.bet)[0];
      const { isLive } = state;
      if (!isLive) {
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
        } else {
          action.bet[accountId].bettingDate = "";          
        }
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
