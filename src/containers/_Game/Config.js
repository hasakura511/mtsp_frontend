// export default {
//   /** Systems configuration
//    * @field color
//    * @field position
//    */
//   PREVIOUS_1_DAY: {
//     color: "pink",
//     position: "left",
//     display: "Previous\n(1 day)",
//     description:
//       "Previous trading days signals. For example if gold went up the previous day, the signal would be LONG.",
//     column: "prev1",
//     heldChips: []
//   },
//   ANTI_PREVIOUS_1_DAY: {
//     color: "indigo",
//     position: "left",
//     display: "Anti Previous\n(1 day)",
//     description: "Opposite of Previous signals.",
//     column: "antiPrev1",
//     heldChips: []
//   },
//   PREVIOUS_5_DAYS: {
//     color: "yellow",
//     position: "right",
//     display: "Previous\n(5 days)",
//     description:
//       "Previous trading days signals. For example if gold went up the previous day, the signal would be LONG.",
//     column: "prev5",
//     heldChips: []
//   },
//   RISK_OFF: {
//     color: "black",
//     position: "top",
//     display: "Risk Off",
//     description:
//       "Opposite of RiskOn signals. (Fixed Signals consisting of Long precious metals and bonds, Short all other risky assets)",
//     column: "riskOff",
//     heldChips: []
//   },
//   RISK_ON: {
//     color: "red",
//     position: "top",
//     display: "Risk On",
//     description:
//       "Fixed Signals consisting of Short precious metals and bonds, Long all other risky assets",
//     column: "riskOn",
//     heldChips: []
//   },
//   LOWEST_EQ: {
//     color: "#f8cd80",
//     position: "bottom",
//     display: "Lowest Eq.",
//     description:
//       "Machine learning system prioritizing signals from worst performing systems.",
//     column: "lowEq",
//     heldChips: []
//   },

//   // ANTI_LE: {
//   //   color: "white",
//   //   position: "bottom",
//   //   display: "Anti-LE",
//   //   description: "Opposite of LowestEquity signals."
//   // },

//   HIGHEST_EQ: {
//     color: "#0049c1",
//     position: "bottom",
//     display: "Highest Eq.",
//     description:
//       "Machine learning system prioritizing signals from best performing systems.",
//     column: "highEq",
//     heldChips: []
//   },
//   ANTI_HE: {
//     color: "#c25de3",
//     position: "bottom",
//     display: "Anti-HE",
//     description: "Opposite of HighestEquity signals",
//     column: "antiHighEq",
//     heldChips: []
//   },

//   // 50: {
//   //   color: "maroon",
//   //   position: "bottom",
//   //   display: "50/50",
//   //   description: "Combination of signals from HighestEquity and LowestEquity"
//   // },
//   ANTI_50: {
//     color: "#8ec54e",
//     position: "bottom",
//     display: "Anti-50",
//     description: "Opposite of 50/50 signals",
//     column: "anti50",
//     heldChips: []
//   },
//   SEASONALITY: {
//     color: "#f49535",
//     position: "bottom",
//     display: "Seasonality",
//     description:
//       "Signals computed from 10 to 30+ years of seasonal daily data.",
//     column: "sea",
//     heldChips: []
//   },
//   ANTI_SEA: {
//     color: "#3fa3e7",
//     position: "bottom",
//     display: "Anti-Sea",
//     description: "Opposite of Seasonality signals.",
//     column: "antiSea",
//     heldChips: []
//   },
//   BLANK: {
//     color: "transparent",
//     position: null
//   }
// };

export const RISK_OFF = "RISK_OFF";
export const PREVIOUS = "PREVIOUS";
export const RISK_ON = "RISK_ON";
export const ANTI_PREVIOUS = "ANTI_PREVIOUS";
export const LOWEST_EQ = "LOWEST_EQ";
export const HIGHEST_EQ = "HIGHEST_EQ";
export const ALPHA = "ALPHA";

export const TARGET = 500;

// Top systems: Keep to Risk On & Risk Off with a slightly updated description. It's a simple concept for people to grasp and helps reinforce the betting board nature of this initial introduction

// Left systems: Previous 5 Day & Anti-Previous 5 Day. The idea of a daily % change is something people are familiar with and by utilising a small number of days, it seems like there is a good mix of not just yesterday's data but also not too much historic data. This is also the only place where I'd suggest having an "anti" system actively installed as it introduces the concept, but in all other cases users can just choose to place an anti-system bet if they really want to.

// Right system: 90 Day Trend or Mode Trend system. As a counterpart to what they will see on the left, this will show the impact of taking into account market performance over a longer period. I'm not entirely sure on the length of the trend or whether we should use Mode versus standard, but either option allows for a good intro point to this family of systems. Additionally, as there is only one system on the right and two on the left, the user will be able to determine the impact of a previous day system without the Trend parent by utilising the row the Anti-Previous Day system is on.

// Bottom systems:
// 1) Swing All: The concept of swings is relatively straightforward, and if this is the leftmost system then we are only introducing a single concept here
// 2) Scalp Big: Introduces the concept of volatility based signals AND the fact that you can control for a parameter within i.e. only big swings
// 3) Scalp Big Filtered: Introduces the concept of filtering out 50% of the worst performing symbols, but unsure of how this would work in practice with smaller portfolios e.g. 5K chip
// 4) Last Best Filtered: Allowing the system to select the system for you is interesting, but without visibility of which system it selected on a daily/market basis, I wonder if this might be too much of a black box. Can keep it filtered or unfiltered
// 5) Last Worst Filtered: As above but showing the alternate view. My understanding of this is based on how it's built, it wouldn't necessarily have the same results as Anti-Last Best
// 6) Seasonality or Adjusted Seasonality: Tbh I'm not entirely sure how these two work but would rather show this than the "Overall Best/Worst" systems as they are too close conceptually to Last Best/Worst. If you feel Overall is a stronger proposition could do those instead of Last Best/Worst as well.

export default {
  PREVIOUS_5D: {
    color: "#BE0032",
    position: "left",
    display: "Previous\n(5 day)",
    id: "PREVIOUS_5D",
    column: "prev5",
    description:
      "Preious trading day(s) signals, if contract went up last 5 days, the signal would be LONG",
    short: "Prev 5",
    heldChips: []
  },
  PREVIOUS_10D: {
    color: "#FF0000",
    position: "left",
    display: "Previous\n(10 day)",
    id: "PREVIOUS_10D",
    column: "prev10",
    description:
      "Preious trading day(s) signals, if contract went up last 10 days, the signal would be LONG",
    short: "Prev 10",
    heldChips: []
  },
  ANTI_ZZ_TREND_120D: {
    color: "#FFD966 ",
    position: "right",
    display: "Anti-Trend\n120D",
    id: "ANTI_ZZ-TREND_120D",
    column: "antiZz120",
    description: "Bet against the trends as seen from a 120 day perspective.",
    short: "Anti-Trend120",
    heldChips: []
  },
  ZZ_MODE_30D: {
    color: "#9D67D1",
    position: "right",
    display: "Mode 30D",
    id: "ZZ-MODE_30D",
    column: "zz30",
    description:
      "Bet on recent market swings as seen from a 30 day perspective.",
    short: "Mode 30",
    heldChips: []
  },
  RISK_ON: {
    color: "#F2F3F4",
    position: "top",
    display: "Risk On",
    id: "RISK-ON",
    column: "riskOn",
    description: "Bet on risky assets and against government bonds.",
    short: "Risk On",
    heldChips: []
  },
  RISK_OFF: {
    color: "#222222",
    position: "top",
    display: "Risk Off",
    id: "RISK-OFF",
    column: "riskOff",
    description: "Bet on government bonds and against risky assets.",
    short: "Risk Off",
    heldChips: []
  },
  ANTI_SEASONALITY: {
    color: "#B84E00",
    position: "bottom",
    display: "Anti-\nSeasonality",
    id: "ANTI_SEASONALITY",
    column: "antiSea",
    description: "Bet against long-term seasonal trends.",
    short: "A-Season",
    heldChips: []
  },
  ANTI_ML_SCALP_ALL: {
    color: "#006256",
    position: "bottom",
    display: "Anti-All Scalper\n(non-filtered)",
    id: "ANTI_ML-SCALP-ALL",
    column: "antiMlScalpAll",
    description:
      "Bet against prediction models that try to predict the next day.",
    short: "A-All Scalp",
    heldChips: []
  },
  ML_SCALP_BIG_FB: {
    color: "#00C256",
    position: "bottom",
    display: "Big Scalper\n(filtered)",
    id: "ML-SCALP-BIG_FB",
    column: "mlScalpBigFb",
    description:
      "Bet on prediction models that try to predict days with big price movements.",
    short: "Big Scalp",
    heldChips: []
  },
  ML_SWING_BIG_FB: {
    color: "#003773",
    position: "bottom",
    display: "Big Swinger\n(filtered)",
    id: "ML-SWING-BIG_FB",
    column: "mlSwingBigFb",
    description:
      "Bet on prediction models that try to predict multi-day swings in the market.",
    short: "Big Swing",
    heldChips: []
  },
  ML_LAST_BEST_FB: {
    color: "#CE8B8B",
    position: "bottom",
    display: "Search Best\n(filtered)",
    id: "ML-LAST-BEST_FB",
    column: "mlLastBestFb",
    description:
      "Bet on the best prediction models based on the previous day’s results.",
    short: "Best Mod",
    heldChips: []
  },
  ANTI_ML_LAST_WORST_FW: {
    color: "#C69300",
    position: "bottom",
    display: "Anti-Search\nWorst (filtered)",
    id: "ANTI_ML-LAST-WORST_FW",
    column: "antiMlLastWorstFw",
    description:
      "Bet against the worst prediction models based on the previous day's results.",
    short: "A-Worst",
    heldChips: []
  }
};
