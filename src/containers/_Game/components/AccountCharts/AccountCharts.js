import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./AccountCharts.css";
import PerformanceChart from "./PerformanceChart/PerformanceChart";
import Spinner from "../../../../components/UI/Spinner/Spinner";
//import RankingChart from "./RankingChart/RankingChart";

const loader = (
  <div
    style={{
      width: "100%",
      height: "100%",
      backgroundColor: "white"
    }}
  >
    <Spinner />
  </div>
);

class AccountCharts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPerformance: true,
      isRanking: false
    };
  }

  toggle = isPerformance => {
    this.setState({ isPerformance, isRanking: !isPerformance });
  };

  render() {
    const { isPerformance, isRanking } = this.state;
    const {
      performance,
      rankingLoading,
      rankingData,
      rankingError,
      chip,
      slot
    } = this.props;
    return (
      <div className={classes.AccountCharts}>
        <div className={classes.Row}>
          <div className={classes.Tabs}>
            <div
              className={
                classes.Tab + " " + (isPerformance ? classes.active : "")
              }
              onClick={() => this.toggle(true)}
            >
              Performance Chart
            </div>
            <div
              className={classes.Tab + " " + (isRanking ? classes.active : "")}
              onClick={() => this.toggle(false)}
            >
              Ranking Chart
            </div>
          </div>
          
        </div>
        <div className={classes.Contents}>
          {isPerformance ? (
            <div className={classes.Content}>
              <PerformanceChart performance={performance} />
            </div>
          ) : (
            <div className={classes.Content}>
              
            </div>
          )}
        </div>
      </div>
    );
  }
}

AccountCharts.propTypes = {
  performance: PropTypes.object,
  rankingLoading: PropTypes.bool.isRequired,
  rankingData: PropTypes.array,
  rankingError: PropTypes.object,
  chip: PropTypes.object.isRequired,
  slot: PropTypes.object,
  close: PropTypes.func.isRequired
};

export default AccountCharts;
