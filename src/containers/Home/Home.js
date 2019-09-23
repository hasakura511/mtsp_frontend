import React, { Component } from "react";
import classes from "./Home.css";
import PropTypes from "prop-types";
import {
  Jumbotron,
  SectionTwo,
  SectionThree,
  SectionFour,
  SectionFive
} from "./HomeData";
// import * as actions from "../../store/actions";
// import { connect } from "react-redux";

// @connect(null, dispatch => {
//   return {
//     addTimedToaster: () => {
//       dispatch(
//         actions.addTimedToaster({
//           text: "Testing",
//           id: "test" + Math.random().toFixed(3)
//         })
//       );
//     }
//   };
// })
export default class Home extends Component {
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
    if (this.state[key] && window.scrollY + window.innerHeight < top) {
      stateObj[key] = false;
    } else if (
      !this.state[key] &&
      window.scrollY + window.innerHeight > top &&
      window.scrollY < top
    ) {
      stateObj[key] = true;
    } else if (this.state[key] && window.scrollY > top) {
      stateObj[key] = false;
    }
    if (this.state[key] !== stateObj[key]) {
      this.setState(stateObj);
    }
  };

  handleSecondScroll = () => {
    this.handleScroll("showSectionTwoCards", 489 + 0.6 * window.innerHeight);
  };

  handleThirdScroll = () => {
    this.handleScroll("showSectionThreePoints", 622 + 1.4 * window.innerHeight);
  };
  handleFourthScroll = () => {
    this.handleScroll("showSectionFourCards", 1300 + 1.6 * window.innerHeight);
  };

  render() {
    return (
      <div className={classes.Home}>

        {Jumbotron}
        {/* <button onClick={this.showToaster}>Show</button> */}
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
  static propTypes = {
    history: PropTypes.object.isRequired
  };
}
