import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./OrderCharts.css";
import PerformanceChart from "./PerformanceChart/PerformanceChart";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import RankingChart from "./RankingChart/RankingChart";

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

class OrderCharts extends Component {
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
      position,
      rankingLoading,
      rankingData,
      rankingError,
      chip,
      slot
    } = this.props;
    return (
      <div className={classes.OrderCharts}>
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
              <PerformanceChart performance={performance} position={position} />
            </div>
          ) : (
            <div className={classes.Content}>
              {rankingLoading ? (
                loader
              ) : rankingError ? (
                <p>
                  {rankingError.Message ||
                    "Could not load ranking charts, please contact us to report the bug."}
                </p>
              ) : (
                <RankingChart
                  moveChipToSlot={this.props.moveChipToSlot}
                  rankingData={rankingData}
                  chip={chip}
                  slot={slot}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

OrderCharts.propTypes = {
  performance: PropTypes.object.isRequired,
  position: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  rankingLoading: PropTypes.bool.isRequired,
  rankingData: PropTypes.array,
  rankingError: PropTypes.object,
  chip: PropTypes.object.isRequired,
  slot: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  moveChipToSlot:PropTypes.func
};

export default OrderCharts;
