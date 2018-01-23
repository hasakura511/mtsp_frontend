export default {
  /** Systems configuration
   * @field color
   * @field position
   */
  PREVIOUS_1_DAY: {
    color: "pink",
    position: "left",
    display: "Previous (1 day)",
    description:
      "Previous trading days signals. For example if gold went up the previous day, the signal would be LONG."
  },
  ANTI_PREVIOUS_1_DAY: {
    color: "indigo",
    position: "left",
    display: "Anti Previous (1 day)",
    description: "Opposite of Previous signals."
  },
  PREVIOUS_5_DAYS: {
    color: "yellow",
    position: "right",
    display: "Previous (5 days)",
    description:
      "Previous trading days signals. For example if gold went up the previous day, the signal would be LONG."
  },
  RISK_OFF: {
    color: "black",
    position: "top",
    display: "Risk Off",
    description:
      "Opposite of RiskOn signals. (Fixed Signals consisting of Long precious metals and bonds, Short all other risky assets)"
  },
  RISK_ON: {
    color: "red",
    position: "top",
    display: "Risk On",
    description:
      "Fixed Signals consisting of Short precious metals and bonds, Long all other risky assets"
  },
  LOWEST_EQ: {
    color: "#f8cd80",
    position: "bottom",
    display: "Lowest Eq.",
    description:
      "Machine learning system prioritizing signals from worst performing systems."
  },

  // ANTI_LE: {
  //   color: "white",
  //   position: "bottom",
  //   display: "Anti-LE",
  //   description: "Opposite of LowestEquity signals."
  // },

  HIGHEST_EQ: {
    color: "#0049c1",
    position: "bottom",
    display: "Highest Eq.",
    description:
      "Machine learning system prioritizing signals from best performing systems."
  },
  ANTI_HE: {
    color: "#c25de3",
    position: "bottom",
    display: "Anti-HE",
    description: "Opposite of HighestEquity signals"
  },

  // 50: {
  //   color: "maroon",
  //   position: "bottom",
  //   display: "50/50",
  //   description: "Combination of signals from HighestEquity and LowestEquity"
  // },
  ANTI_50: {
    color: "#8ec54e",
    position: "bottom",
    display: "Anti-50",
    description: "Opposite of 50/50 signals"
  },
  SEASONALITY: {
    color: "#f49535",
    position: "bottom",
    display: "Seasonality",
    description:
      "Signals computed from 10 to 30+ years of seasonal daily data."
  },
  ANTI_SEA: {
    color: "#3fa3e7",
    position: "bottom",
    display: "Anti-Sea",
    description: "Opposite of Seasonality signals."
  },
  BLANK: {
    color: "transparent",
    position: null
  }
};

export const RISK_OFF = "RISK_OFF";
export const PREVIOUS = "PREVIOUS";
export const RISK_ON = "RISK_ON";
export const ANTI_PREVIOUS = "ANTI_PREVIOUS";
export const LOWEST_EQ = "LOWEST_EQ";
export const HIGHEST_EQ = "HIGHEST_EQ";
export const ALPHA = "ALPHA";
