import React, { Component } from "react";
import classes from "./DropDown.css";
import PropTypes from "prop-types";

class DropDown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }

  render() {
    let iconClass = "fa fa-caret-down " + classes.Icon,  displayClass = classes.Hidden;
    if(this.state.show){
      iconClass += " " + classes.Open;
      displayClass = "";
    }
    return (
      <div className={classes.DropDown}>
        <button
          onClick={this.dropDownClickHandler}
          onBlur={this.dropDownBlurHandler}
        >
          Menu
          <i className={iconClass}/>
        </button>
        <div className={classes.Items + " " + displayClass}>
          <ul>{this.props.items.map(item => <li key={item.id}>{item}</li>)}</ul>
        </div>
      </div>
    );
  }
}

DropDown.propTypes = {
  items: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired
};
