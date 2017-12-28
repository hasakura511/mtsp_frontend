import React from "react";
import classes from "./DateTimeWidget.css";

const dateTimeWidget = props => {
  return <div className={classes.Widget}>
    <div>
      <i className={"fa fa-clock"} />
    </div>
  </div>
}

export default dateTimeWidget;