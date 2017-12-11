import crosshairIcon from "../../assets/images/crosshair-icon.png";
import faceIcon from "../../assets/images/face-icon.png";
import signalsIcon from "../../assets/images/signals-icon.png";
import sectionThreeBkg from "../../assets/images/section3-bkg.png";
import sectionThreeBg from "../../assets/images/section3-bg.png";
import monitorImage from "../../assets/images/monitor-2.png";
import background from "../../assets/images/home-background.png";
import backgroundFilter from "../../assets/images/background-filter.png";

const HomeData = {
  sectionOne: {
    backgroundFilter: backgroundFilter,
    jumbotronHeading:
      "Trade futures contracts,\nthe reliable, easy and fun way!",
    jumbotronButtonText: "TRY DEMO BELOW >",
    background: background
  },

  sectionTwo: {
    LeftPara:
      "Design your own\ntrading board,\nplace your bets\nand dominate the\nfutures markets!",
    Right: [
      {
        id: "sec2-card1",
        icon: faceIcon,
        title: "Make Smart Bets",
        description:
          "Bet on the different trading systems using live market data, all from one easy to understand game board."
      },
      {
        id: "sec2-card2",
        icon: crosshairIcon,
        title: "Create New Strategies",
        description:
          "You can create many different strategies by trying new board configurations. It’s easy to do and there's no advanced knowledge necessary!"
      },
      {
        id: "sec2-card3",
        icon: signalsIcon,
        title: "Straightforward Analytics",
        description:
          "Bet on the different trading systems using live market data, all from one easy to understand game board."
      }
    ]
  },

  sectionThree: {
    title: "Try our demo board",
    points: [
      {
        id: "sec3-point1",
        description: "Select account value"
      },
      {
        id: "sec3-point2",
        description: "Place bet"
      },
      {
        id: "sec3-point3",
        description: "Review Analytics"
      },
      {
        id: "sec3-point4",
        description: "Simulate results"
      }
    ],
    background: sectionThreeBkg,
    fullBackground: sectionThreeBg,
    startMap: 0.55125 * innerWidth,
    endMap: 0.55125 * innerWidth + 0.229375 * innerWidth
  },

  sectionFour: {
    title:
      "Register to unlock professional-grade\ntools that will assist you every step of the way",
    cards: [
      {
        id: "sec4-card1",
        icon: faceIcon,
        title: "Smart Customization",
        description:
          "As an advanced user you can customize your account portfolio to create strategies that offer unlimited trading options!"
      },
      {
        id: "sec4-card2",
        icon: crosshairIcon,
        title: "Advanced Analytics and Reporting",
        description:
          "We provide a multitude of advanced features such as accuracy maps,  market internals, system internals, and trading reports so you can see what's going on under the hood. "
      },
      {
        id: "sec4-card3",
        icon: signalsIcon,
        title: "Broker Integrations",
        description:
          "COMING SOON: When you are ready to take the plunge and trade with real money, we will walk you through the simple setup process."
      }
    ],
    monitorImage: monitorImage
  },

  sectionFive: {
    title:
      "Register today for six months free\naccess to advanced customisation\nand analytics options on launch"
  }
};

export default HomeData;
