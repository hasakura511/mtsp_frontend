export default [
  // {
  //   accountId: "5K_0_1516105730",
  //   display: "5K",
  //   accountValue: 5000.0,
  //   portfolio: ["TU", "BO"],
  //   qty: "{'TU': 2, 'BO': 1}",
  //   target: 250,
  //   totalMargin: 1925.0,
  //   maxCommissions: 8.100000000000001,
  //   created: 1516105728,
  //   updated: 1516105730
  // },
  {
    accountId: "25K_0_1516006972",
    display: "25K",
    accountValue: 25000,
    portfolio: ["TU", "BO", "SB", "LH", "MP", "CL", "PL"],
    qty: { TU: 1, BO: 1, SB: 1, LH: 1, MP: 1, PL: 1, CL: 1 },
    target: 250,
    totalMargin: 11535.0,
    maxCommissions: 18.9,
    created: 1516006970,
    updated: 1516006972
  },
  {
    accountId: "50K_0_1516105887",
    display: "50K",
    accountValue: 50000.0,
    portfolio: [
      "TU",
      "BO",
      "SB",
      "LH",
      "MP",
      "CL",
      "PL",
      "YM",
      "FV",
      "C",
      "CC",
      "LC"
    ],
    qty: {
      TU: 1,
      BO: 1,
      SB: 1,
      LH: 1,
      MP: 1,
      PL: 1,
      CL: 1,
      YM: 1,
      FV: 1,
      C: 1,
      CC: 1,
      LC: 1
    },
    target: 250,
    totalMargin: 24471.0,
    maxCommissions: 32.4,
    created: 1516105885,
    updated: 1516105887
  },
  {
    accountId: "100K_0_1516105902",
    display: "0.1M",
    accountValue: 100000.0,
    portfolio: [
      "TU",
      "BO",
      "LC",
      "MP",
      "PL",
      "NG",
      "NQ",
      "FV",
      "C",
      "LH",
      "CD",
      "HG",
      "CL",
      "YM",
      "TY",
      "W",
      "FC",
      "AD",
      "SI",
      "HO",
      "ES",
      "US",
      "SM",
      "NE",
      "GC",
      "RB",
      "NIY",
      "S",
      "JY",
      "PA",
      "EMD",
      "SF",
      "BP",
      "CU"
    ],
    qty: {
      TU: 1,
      BO: 1,
      SB: 1,
      LH: 1,
      MP: 1,
      PL: 1,
      CL: 1,
      YM: 1,
      FV: 1,
      C: 1,
      CC: 1,
      LC: 1,
      CD: 1,
      HG: 1,
      NG: 1,
      NQ: 1,
      TY: 1,
      W: 1,
      CT: 1,
      FC: 1,
      AD: 0,
      SI: 0,
      HO: 0,
      ES: 0,
      US: 0,
      SM: 0,
      NE: 0,
      GC: 0,
      RB: 0,
      NIY: 0,
      S: 0,
      JY: 0,
      PA: 0,
      EMD: 0,
      SF: 0,
      BP: 0,
      CU: 0
    },
    target: 1500,
    totalMargin: 48925.0,
    maxCommissions: 54.0,
    created: 1516105900,
    updated: 1516105902
  }
  // {
  //   accountId: "5000K_0_1516106713",
  //   display: "5M",
  //   accountValue: 5000000.0,
  //   portfolio: [
  //     "TU",
  //     "BO",
  //     "LC",
  //     "MP",
  //     "PL",
  //     "NG",
  //     "NQ",
  //     "FV",
  //     "C",
  //     "LH",
  //     "CD",
  //     "HG",
  //     "CL",
  //     "YM",
  //     "TY",
  //     "W",
  //     "FC",
  //     "NE",
  //     "SI",
  //     "HO",
  //     "NIY",
  //     "US",
  //     "SM",
  //     "AD",
  //     "GC",
  //     "RB",
  //     "ES",
  //     "S",
  //     "JY",
  //     "PA",
  //     "EMD",
  //     "SF",
  //     "BP",
  //     "CU"
  //   ],
  //   qty:
  //     "{'TU': 115, 'BO': 47, 'LC': 19, 'MP': 52, 'PL': 20, 'NG': 11, 'NQ': 11, 'FV': 75, 'C': 100, 'LH': 24, 'CD': 25, 'HG': 11, 'CL': 15, 'YM': 17, 'TY': 41, 'W': 44, 'FC': 10, 'NE': 29, 'SI': 12, 'HO': 11, 'NIY': 12, 'US': 13, 'SM': 35, 'AD': 31, 'GC': 12, 'RB': 10, 'ES': 16, 'S': 28, 'JY': 24, 'PA': 7, 'EMD': 9, 'SF': 17, 'BP': 27, 'CU': 14}",
  //   target: 13750,
  //   totalMargin: 2344404.0,
  //   maxCommissions: 2548.8000000000006,
  //   created: 1516106711,
  //   updated: 1516106713
  // }
];

export const description = {
  AD: "Australian Dollar",
  BO: "Soybean Oil",
  BP: "British Pound",
  C: "Corn",
  CD: "Canadian Dollar",
  CL: "Crude Oil",
  CU: "Euro",
  EMD: "S&P Midcap 400",
  ES: "S&P 500",
  FC: "Feeder Cattle",
  FV: "5 Year T-Note",
  GC: "Gold",
  HG: "Copper",
  HO: "Heating Oil",
  JY: "Japanese Yen",
  LC: "Live Cattle",
  LH: "Lean Hogs",
  MP: "Mexican Peso",
  NE: "New Zealand Dollar",
  NG: "Natural Gas",
  NIY: "Nikkei 225",
  NQ: "Nasdaq 100",
  PA: "Palladium",
  PL: "Platinum",
  RB: "Gasoline",
  S: "Soybeans",
  SF: "Swiss Franc",
  SI: "Silver",
  SM: "Soybean Meal",
  TU: "2 Year T-Note",
  TY: "10 Year T-Note",
  US: "30 Year T-Bond",
  W: "Wheat",
  YM: "Dow Jones Industrial Avg."
};

export const replaceSymbols = str => {
  str = str.replace(
    new RegExp(Object.keys(description).join("|"), "gi"),
    $1 => description[$1]
  );

  return str;
};
