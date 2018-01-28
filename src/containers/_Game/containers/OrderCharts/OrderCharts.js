import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./OrderCharts.css";
import PerformanceChart from "./PerformanceChart/PerformanceChart";

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
    const { performance } = this.props;
    return (
      <div className={classes.OrderCharts}>
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
        <div className={classes.Contents}>
          {isPerformance ? (
            <div className={classes.Content}>
              <PerformanceChart performance={performance} />
            </div>
          ) : (
            <div className={classes.Content}>Ranking Content</div>
          )}
        </div>
      </div>
    );
  }
}

OrderCharts.propTypes = {
  performance: PropTypes.object.isRequired
};

export default OrderCharts;
