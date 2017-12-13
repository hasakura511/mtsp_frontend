import crosshairIcon from "../../assets/images/crosshair-icon.png";
import faceIcon from "../../assets/images/face-icon.png";
import signalsIcon from "../../assets/images/signals-icon.png";
import sectionThreeBkg from "../../assets/images/section3-bkg.png";
import sectionThreeBg from "../../assets/images/section3-bg.png";
import monitorImage from "../../assets/images/monitor-2.png";
import background from "../../assets/images/home-background.png";
import backgroundFilter from "../../assets/images/background-filter.png";
import React from "react";
import LRButton from "../../components/UI/LeftRoundButton/LeftRoundButton";
import { Link } from "react-router-dom";
import Point from "../../components/UI/Point/Point";
import Card from "../../components/UI/Card/Card";
import classes from "./Home.css";
import scrollWrap from "../../hoc/scrollWrap/scrollWrap";

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

export const Jumbotron = (
  <div
    className={classes.Jumbotron}
    style={{
      backgroundImage:
        "url(" +
        HomeData.sectionOne.background +
        "), url(" +
        HomeData.sectionOne.backgroundFilter +
        ")"
    }}
  >
    <div className={classes.JumbotronHeading}>
      <h2>{HomeData.sectionOne.jumbotronHeading}</h2>
    </div>
    <LRButton
      width="30%"
      height="6vh"
      rad="3vh"
      style={{
        backgroundColor: "#0fc6a7",
        borderColor: "#31c5a8",
        color: "white"
      }}
    >
      <strong>{HomeData.sectionOne.jumbotronButtonText}</strong>
    </LRButton>
  </div>
);

export const SectionTwo = scrollWrap(props => {
  let displayClass = "";
  if (props.display) {
    displayClass = classes.Shown;
  }
  return (
    <div className={classes.SectionTwo}>
      <div className={classes.Left}>
        <h2>
          <b>{"How it works:"}</b>
        </h2>
        <hr />
        <p>{HomeData.sectionTwo.LeftPara}</p>
      </div>
      <div className={classes.Right}>
        {HomeData.sectionTwo.Right.map((card, i) => (
          <div
            key={card.id}
            style={{ animationDelay: i * 0.3 + "s" }}
            className={classes.Card + " " + displayClass}
          >
            <Card
              iconSrc={card.icon}
              title={card.title}
              description={card.description}
              style={{ width: "341px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export const SectionThree = scrollWrap(props => {
  let displayClass = props.display ? classes.Shown : "";
  return (
    <div
      className={classes.SectionThree}
      style={{
        backgroundImage: "url(" + HomeData.sectionThree.fullBackground + ")"
      }}
    >
      <h2>
        <b>{HomeData.sectionThree.title}</b>
      </h2>
      <hr />
      <div className={classes.Points}>
        {HomeData.sectionThree.points.map((point, i) => (
          <div
            className={classes.Point + " "+ displayClass}
            key={point.id}
            style={{ animationDelay: i * 0.5 + "s" }}
          >
            <Point index={i + 1} description={point.description} />
          </div>
        ))}
      </div>
      <div className={classes.Container}>
        <img src={HomeData.sectionThree.background} alt="" useMap="mapname" />
        <Link to={"/link"}>
          <map name="mapname">
            <area
              shape="rect"
              coords={
                HomeData.sectionThree.startMap +
                ",210," +
                HomeData.sectionThree.endMap +
                ",263"
              }
              alt="alttext"
            />
          </map>
        </Link>
      </div>
    </div>
  );
});

export const SectionFour = scrollWrap(props => {
  let displayClass = props.display ? classes.Shown : "";
  return (
    <div className={classes.SectionFour}>
      <h2>
        <b>{HomeData.sectionFour.title}</b>
      </h2>
      <hr />
      <div className={classes.Container}>
        <div className={classes.Left}>
          {HomeData.sectionFour.cards.map((card, i) => (
            <div
              key={card.id}
              style={{ animationDelay: i * 0.3 + "s" }}
              className={classes.Card + " " + displayClass}
            >
              <Card
                iconSrc={card.icon}
                title={card.title}
                description={card.description}
                style={{ width: "563px" }}
              />
            </div>
          ))}
        </div>
        <div className={classes.Right}>
          <img src={HomeData.sectionFour.monitorImage} alt="" />
        </div>
      </div>
    </div>
  );
});

export const SectionFive = (
  <div className={classes.SectionFive}>
    <div className={classes.Heading}>
      <h2>{HomeData.sectionFive.title}</h2>
    </div>
    {
      <LRButton
        width="60%"
        height="6vh"
        rad="3vh"
        style={{
          backgroundColor: "#1c2791",
          borderColor: "#1c2791",
          color: "white"
        }}
      >
        <strong>{"REGISTER NOW   >"}</strong>
      </LRButton>
    }
  </div>
);

export default HomeData;
