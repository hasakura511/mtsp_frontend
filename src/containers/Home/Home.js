import React, { Component } from "react";
import classes from "./Home.css";
import Card from "../../components/UI/Card/Card";
import HomeData from "./HomeData";
import Point from "../../components/UI/Point/Point";
import LRButton from "../../components/UI/LeftRoundButton/LeftRoundButton";
import { Link } from "react-router-dom";
import RouteModal from "../../hoc/RouteModal/RouteModal";
import Contact from "./Contact/Contact";
import { Route, Switch } from "react-router-dom";

const home = () => (
  <div className={classes.Home}>
    <RouteModal path="/contact" redirectPath="/">
      <Contact />
    </RouteModal>
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

    <div className={classes.SectionTwo}>
      <div className={classes.Left}>
        <h2>
          <b>{"How it works:"}</b>
        </h2>
        <hr />
        <p>{HomeData.sectionTwo.LeftPara}</p>
      </div>
      <div className={classes.Right}>
        {HomeData.sectionTwo.Right.map(card => (
          <Card
            key={card.id}
            iconSrc={card.icon}
            title={card.title}
            description={card.description}
            style={{ width: "341px" }}
          />
        ))}
      </div>
    </div>

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
          <Point key={point.id} index={i + 1} description={point.description} />
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

    <div className={classes.SectionFour}>
      <h2>
        <b>{HomeData.sectionFour.title}</b>
      </h2>
      <hr />
      <div className={classes.Container}>
        <div className={classes.Left}>
          {HomeData.sectionFour.cards.map(card => (
            <Card
              key={card.id}
              iconSrc={card.icon}
              title={card.title}
              description={card.description}
              style={{ width: "563px" }}
            />
          ))}
        </div>
        <div className={classes.Right}>
          <img src={HomeData.sectionFour.monitorImage} alt="" />
        </div>
      </div>
    </div>

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
  </div>
);

export default home;
