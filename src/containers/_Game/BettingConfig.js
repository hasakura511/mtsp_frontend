import { toIntegerDate } from "../../util";
import ChipsConfig from "./ChipsConfig";

const Bettings = {
  pastBets: [
    {
      bettingDate: "2018/01/06",
      account: "5K_0_1516105730",
      position: "1",
      bettingTime: null,
      changePercent: 5,
      change: 25.0,
      amount: 5000
    },
    {
      bettingDate: "2018/01/06",
      account: "25K_0_1516006972",
      position: "1",
      bettingTime: null,
      changePercent: 5,
      change: 50.0,
      amount: 25000
    },
    {
      bettingDate: "2018/01/06",
      account: "50K_0_1516105887",
      position: "1",
      bettingTime: null,
      changePercent: 5,
      change: 250.0,
      amount: 50000
    },
    {
      bettingDate: "2018/01/06",
      account: "500K_0_1516105902",
      position: "1",
      bettingTime: null,
      changePercent: 5,
      change: 2500.0,
      amount: 500000
    },
    {
      bettingDate: "2018/01/06",
      account: "5000K_0_1516106713",
      position: "1",
      bettingTime: null,
      changePercent: -5,
      change: -25000.0,
      amount: 5000000
    }
  ],
  currentBets: [
    {
      bettingDate: "2018/01/07",
      account: "5K_0_1516105730",
      position: "OFF",
      bettingTime: null,
      amount: 5000
    }
  ]
};

// export const accountValue = account => {
//   const chip = ChipsConfig.find(chip => chip.accountId === account);
//   let sum = chip.accountValue;
//   if (chip) {
//     Bettings.pastBets.forEach(bet => {
//       if (bet.account === account) {
//         sum += bet.change;
//       }
//     });
//   }
//   return sum;
// };

export const lastUpdatedDate = account => {
  const bets = Bettings.pastBets.filter(bet => bet.account === account);
  bets.sort((bet1, bet2) => toIntegerDate(bet2) - toIntegerDate(bet1));
  if (bets.length) {
    return bets[0].bettingDate + " 16:00:00";
  }
  return "2018/01/01 16:00:00";
};

export const lastPastBet = account => {
  const bets = Bettings.pastBets.filter(bet => bet.account === account);
  bets.sort(
    (bet1, bet2) =>
      toIntegerDate(bet2.bettingDate) - toIntegerDate(bet1.bettingDate)
  );
  return bets.length ? bets[0] : null;
};

export const lastCurrentBet = account => {
  const bets = Bettings.currentBets.filter(bet => bet.account === account);
  bets.sort(
    (bet1, bet2) =>
      toIntegerDate(bet1.bettingDate) - toIntegerDate(bet2.bettingDate)
  );
  return bets.length ? bets[0] : null;
};

export default Bettings;
