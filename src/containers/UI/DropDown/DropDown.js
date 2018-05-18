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

  dropDownBlurHandler = () => {
    this.timeout = setTimeout(() => {
      this.setState({ show: false });
    }, 200);
  };

  dropDownClickHandler = () => {
    this.setState(prev => ({ show: !prev.show }));
  };

  componentWillUnmount(){
    clearTimeout(this.timeout);
  }

  render() {
    let iconClass = "fa fa-caret-down " + classes.Icon,
      displayClass = classes.Hide;
    if (this.state.show) {
      iconClass += " " + classes.Open;
      displayClass = "";
    }
    return (
      <div className={classes.DropDown}>
        <button
          onClick={this.dropDownClickHandler}
          onBlur={this.dropDownBlurHandler}
          style={this.props.btnStyle}
        >
          {this.props.name.toUpperCase()}
          <i className={iconClass} />
        </button>
        <div className={classes.Items + " " + displayClass} style={this.props.ddnStyle}>
          <ul>
            {this.props.items}
          </ul>
        </div>
      </div>
    );
  }
}

DropDown.propTypes = {
  items: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  ddnStyle: PropTypes.object,
  btnStyle: PropTypes.object
};

export default DropDown;
