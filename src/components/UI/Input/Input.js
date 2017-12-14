import React from "react";
import PropTypes from "prop-types";
import classes from "./Input.css";

const input = props => {
  let inputElement = null;
  let inputClass = classes.InputElement;
  if (!props.valid) {
    inputClass += " " + classes.Invalid;
  }
  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          className={inputClass}
          {...props.elementConfig}
          defaultValue={props.value}
          onChange={props.inputChangeHandler}
        />
      );
      break;

    case "textarea":
      inputElement = (
        <textarea
          className={inputClass}
          {...props.elementConfig}
          value={props.value}
          onChange={props.inputChangeHandler}
        />
      );
      break;

    case "select":
      inputElement = (
        <select
          className={inputClass}
          value={props.value}
          onChange={props.inputChangeHandler}
        >
          {props.elementConfig.options.map(option => (
            <option key={"op" + option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;

    default:
      inputElement = (
        <input
          className={inputClass}
          {...props.elementConfig}
          value={props.value}
          onChange={props.inputChangeHandler}
        />
      );
      break;
  }
  
  return (
    <div className={classes.Input} style={props.style}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
    </div>
  );
};

input.propTypes = {
  elementType: PropTypes.string.isRequired,
  label: PropTypes.string,
  elementConfig: PropTypes.object,
  value: PropTypes.string.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  valid: PropTypes.bool,
  style: PropTypes.object
};

export default input;
