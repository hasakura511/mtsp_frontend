import React from "react";
import Input from "../../../components/UI/Input/Input";
import PropTypes from 'prop-types';
import Btn from "../components/Button/Button";

export default {
  // title: {
  //   label: "Title",
  //   elementType: "select",
  //   elementConfig: {
  //     options: [
  //       {
  //         value: "Mr.",
  //         displayValue: "Mr."
  //       },
  //       {
  //         value: "Ms.",
  //         displayValue: "Ms."
  //       },
  //       {
  //         value: "Mrs.",
  //         displayValue: "Mrs."
  //       },
  //       {
  //         value: "Miss",
  //         displayValue: "Miss"
  //       }
  //     ]
  //   },
  //   validation: {
  //     required: true
  //   },
  //   value: "Mr.",
  //   valid: true,
  //   touched: false,
  //   visible: true,
  //   signupField: true
  // },

  firstName: {
    label: "First Name",
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: ""
    },
    value: "",
    validation: {
      required: true,
      pattern: /^[A-Za-z]+$/
    },
    visible: true,
    valid: false,
    touched: false,
    signupField: true,
    errorMessage: "First name can't be blank and only letters are allowed."
  },

  lastName: {
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: ""
    },
    label: "Last Name",
    validation: {
      required: true,
      pattern: /^[A-Za-z]+$/
    },
    valid: false,
    value: "",
    touched: false,
    visible: true,
    signupField: true,
    errorMessage: "Last name can't be blank and only letters are allowed."
  },

  // houseNumber: {
  //   elementType: "input",
  //   elementConfig: {
  //     type: "text",
  //     placeholder: ""
  //   },
  //   label: "House Number",
  //   validation: {
  //     required: true
  //   },
  //   isHalf: true,
  //   valid: false,
  //   value: "",
  //   touched: false,
  //   visible: true,
  //   signupField: true
  // },

  // street: {
  //   elementType: "input",
  //   elementConfig: {
  //     type: "text",
  //     placeholder: "Street"
  //   },
  //   validation: {
  //     required: true
  //   },
  //   label: "Street",
  //   isHalf: true,
  //   valid: false,
  //   value: "",
  //   touched: false,
  //   visible: true,
  //   signupField: true
  // },

  // city: {
  //   elementType: "input",
  //   elementConfig: {
  //     type: "text",
  //     placeholder: ""
  //   },
  //   label: "City",
  //   validation: {
  //     required: true
  //   },
  //   valid: false,
  //   value: "",
  //   touched: false,
  //   isHalf: true,
  //   visible: true,
  //   signupField: true
  // },

  // postcode: {
  //   elementType: "input",
  //   elementConfig: {
  //     type: "text",
  //     placeholder: "Postcode"
  //   },
  //   validation: {
  //     required: true
  //   },
  //   label: "Postcode",
  //   valid: false,
  //   value: "",
  //   touched: false,
  //   isHalf: true,
  //   visible: true,
  //   signupField: true
  // },

  // phoneNumber: {
  //   label: "Phone Number",
  //   elementType: "input",
  //   elementConfig: {
  //     type: "text",
  //     placeholder: ""
  //   },
  //   validation: {
  //     required: true,
  //     pattern: /^(\+\d{1,3})*\s?\d{10}$/
  //   },
  //   valid: false,
  //   value: "",
  //   touched: false,
  //   visible: true,
  //   signupField: true
  // },

  email: {
    label: "Email",
    elementType: "input",
    elementConfig: {
      type: "email",
      placeholder: ""
    },
    value: "",
    validation: {
      required: true,
      maxLength: 255,
      pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    valid: false,
    touched: false,
    visible: true,
    signupField: true,
    signinField: true,
    errorMessage: "Please fill valid email."
  },

  password: {
    label: "Password",
    elementType: "input",
    elementConfig: {
      type: "password"
    },
    value: "",
    validation: {
      required: true,
      minLength: 8,
      pattern: /[^a-z]/,
      maxLength: 255
    },
    valid: false,
    touched: false,
    visible: true,
    signupField: true,
    signinField: true,
    errorMessage:
      "Password must have at least 8 characters, with at least one capitalized letter, number, or symbol"
  },

  rePassword: {
    label: "Confirm Password",
    elementType: "input",
    elementConfig: {
      type: "password"
    },
    value: "",
    validation: {
      required: true,
      minLength: 8
    },
    valid: false,
    touched: false,
    visible: true,
    signupField: true,
    errorMessage: "Please make sure passwords match, re-enter if forgotten."
  }
};

export const FormInput = props => {
  const { formElem } = props;
  return <Input
    elementType={formElem.elementType}
    elementConfig={formElem.elementConfig}
    value={formElem.value}
    inputChangeHandler={event => props.inputChangeHandler(event, formElem.id)}
    valid={formElem.valid || !formElem.touched}
    errorMessage={formElem.errorMessage}
    label={formElem.label}
    onBlurHandler={event => props.onBlurHandler(event, formElem.id)}
    style={{ width: formElem.isHalf ? "50%" : "100%" }}
  />;
};

export const Button = Btn;

FormInput.propTypes = {
  formElem: PropTypes.object.isRequired,
  onBlurHandler: PropTypes.func.isRequired,
  inputChangeHandler: PropTypes.func.isRequired
}
