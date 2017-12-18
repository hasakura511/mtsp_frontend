import crosshairIcon from "../../assets/images/crosshair-icon.png";
import faceIcon from "../../assets/images/face-icon.png";
import signalsIcon from "../../assets/images/signals-icon.png";
import sectionThreeBkg from "../../assets/images/section3-bkg.png";
import sectionThreeBg from "../../assets/images/section3-bg.png";
import monitorImage from "../../assets/images/monitor-3.png";
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
    jumbotronHeading: "Trade futures contracts easily,\nyet fun and reliably!",
    jumbotronButtonText: "TRY DEMO BELOW >",
    background: background
  },

  sectionTwo: {
    LeftPara:
      "Design your own\ntrading board,\nplace your bets,\nand beat the\nfutures markets.",
    Right: [
      {
        id: "sec2-card1",
        icon: faceIcon,
        title: "Make Smart Bets",
        description:
          "Bet on different trading strategies using live market analytics, all from one easy to understand game board."
      },
      {
        id: "sec2-card3",
        icon: signalsIcon,
        title: "Helpful Live Analytics",
        description:
          "We provide easy to understand analytics such as heatmaps, performance charts and ranking charts to help you create the highest-performing strategies."
      },
      {
        id: "sec2-card2",
        icon: crosshairIcon,
        title: "Customize Your Strategies",
        description:
          "You can easily customize any strategies you choose to implement, modify or polish in any way you like to improve your performance quickly."
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
    map: (() => {
      let wImg = 1256,
        hImg = 450;
      if (innerWidth <= 1346) {
        (wImg = (innerWidth - 2) / 1.07),
          (hImg = 450 * (innerWidth - 2) / (1256 * 1.07));
      }
      console.log(wImg, hImg);
      return {
        start: {
          x: 750 / 1256 * wImg,
          y: 17 / 45 * hImg
        },
        end: {
          x: 1050 / 1256 * wImg,
          y: 212 / 450 * hImg
        }
      };
    })()
  },

  sectionFour: {
    title:
      "Register to unlock easy to use professional-grade tools that will assist you at every step.",
    cards: [
      {
        id: "sec4-card1",
        icon: faceIcon,
        title: "Smart Customization",
        description:
          "You can customize your account portfolio to manage volatility and create or improve strategies which will avail unlimited trading options. This allows you test, improve, and implement your market hypothesis."
      },
      {
        id: "sec4-card2",
        icon: crosshairIcon,
        title: "Analytics and Reporting for Advanced Players",
        description:
          "We provide a multitude of advanced analytics such as accuracy maps, market internals, system internals and trading reports so you can see what’s going on inside the hood."
      },
      {
        id: "sec4-card3",
        icon: signalsIcon,
        title: "Broker Integrations",
        description:
          "COMING SOON: When you are ready to trade with real money, we will walk you through the simple setup process."
      }
    ],
    monitorImage: monitorImage
  },

  sectionFive: {
    title:
      "Register today for six months free access to our new and exciting customization and analytics features on launch."
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
      onClick={() => document.getElementById('sec4').scrollIntoView()}
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
        <div style={{ width: "423px", marginLeft: "auto" }}>
          <h2>
            <b>{"How it works:"}</b>
          </h2>
        </div>
        <hr style={{ width: "" }} />
        <div style={{ width: "423px", marginLeft: "auto" }}>
          <p>{HomeData.sectionTwo.LeftPara}</p>
        </div>
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
              style={{ width: "290px" }}
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
            className={classes.Point + " " + displayClass}
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
                HomeData.sectionThree.map.start.x.toFixed(0) +
                "," +
                HomeData.sectionThree.map.start.y.toFixed(0) +
                "," +
                HomeData.sectionThree.map.end.x.toFixed(0) +
                "," +
                HomeData.sectionThree.map.end.y.toFixed(0)
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
    <div className={classes.SectionFour} id="sec4">
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
                style={{ width: "400px" }}
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
      <Link to="/auth">
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
      </Link>
    }
  </div>
);

export default HomeData;
