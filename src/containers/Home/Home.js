import React, { Component } from "react";
import classes from "./Home.css";
import {
  Jumbotron,
  SectionTwo,
  SectionThree,
  SectionFour,
  SectionFive
} from "./HomeData";
import RouteModal from "../../hoc/RouteModal/RouteModal";
import Contact from "./Contact/Contact";
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSectionTwoCards: false,
      showSectionThreePoints: false,
      showSectionFourCards: false
    };
  }

  handleScroll = (key, top) => {
    const stateObj = {};
    if (
      this.state[key] &&
      scrollY + innerHeight < top
    ) {
      stateObj[key] = false;
    } else if (
      !this.state[key] &&
      scrollY + innerHeight > top &&
      scrollY < top
    ) {
      stateObj[key] = true;
    } else if (this.state[key] && scrollY > top) {
      stateObj[key] = false;
    }
    if (this.state[key] !== stateObj[key]) {
      this.setState(stateObj);
    }
  };

  handleSecondScroll = () => {
    this.handleScroll(
      "showSectionTwoCards",
      489 + 0.9 * innerHeight
    );
  };

  handleThirdScroll = () => {
    this.handleScroll(
      "showSectionThreePoints",
      622 + 1.7 * innerHeight
    );
  };
  handleFourthScroll = () => {
    this.handleScroll(
      "showSectionFourCards",
      1300 + 2.15 * innerHeight
    );
  };
  componentDidMount() {}

  render() {
    return (
      <div className={classes.Home}>
        <RouteModal path="/contact" redirectPath="/">
          <Contact />
        </RouteModal>
        {Jumbotron}
        <SectionTwo
          onWindowScroll={this.handleSecondScroll}
          display={this.state.showSectionTwoCards}
        />
        <SectionThree
          onWindowScroll={this.handleThirdScroll}
          display={this.state.showSectionThreePoints}
        />
        <SectionFour
          onWindowScroll={this.handleFourthScroll}
          display={this.state.showSectionFourCards}
        />
        {SectionFive}
      </div>
    );
  }
}

export default Home;
