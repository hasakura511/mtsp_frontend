export default {
  title: {
    label: "Title",
    elementType: "select",
    elementConfig: {
      options: [
        {
          value: "Mr.",
          displayValue: "Mr."
        },
        {
          value: "Ms.",
          displayValue: "Ms."
        },
        {
          value: "Mrs.",
          displayValue: "Mrs."
        },
        {
          value: "Miss",
          displayValue: "Miss"
        }
      ]
    },
    validation: {
      required: true
    },
    value: "Mr.",
    valid: true,
    touched: false,
    visible: true,
    signupField: true
  },

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
    signupField: true
  },

  surname: {
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: ""
    },
    label: "Surname",
    validation: {
      required: true,
      pattern: /^[A-Za-z]+$/
    },
    valid: false,
    value: "",
    touched: false,
    visible: true,
    signupField: true
  },

  houseNumber: {
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: ""
    },
    label: "House Number",
    validation: {
      required: true
    },
    isHalf: true,
    valid: false,
    value: "",
    touched: false,
    visible: true,
    signupField: true
  },

  street: {
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: "Street"
    },
    validation: {
      required: true
    },
    label: "Street",
    isHalf: true,
    valid: false,
    value: "",
    touched: false,
    visible: true,
    signupField: true
  },

  city: {
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: ""
    },
    label: "City",
    validation: {
      required: true
    },
    valid: false,
    value: "",
    touched: false,
    isHalf: true,
    visible: true,
    signupField: true
  },

  postcode: {
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: "Postcode"
    },
    validation: {
      required: true
    },
    label: "Postcode",
    valid: false,
    value: "",
    touched: false,
    isHalf: true,
    visible: true,
    signupField: true
  },

  phoneNumber: {
    label: "Phone Number",
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: ""
    },
    validation: {
      required: true,
      pattern: /^(\+\d{1,3})*\s?\d{10}$/
    },
    valid: false,
    value: "",
    touched: false,
    visible: true,
    signupField: true
  },

  email: {
    label: "Email",
    elementType: "input",
    elementConfig: {
      type: "email",
      placeholder: "Mail Address"
    },
    value: "",
    validation: {
      required: true,
      isEmail: true
    },
    valid: false,
    touched: false,
    visible: true,
    signupField: true,
    signinField: true
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
      minLength: 6
    },
    valid: false,
    touched: false,
    visible: true,
    signupField: true,
    signinField: true
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
      minLength: 6
    },
    valid: false,
    touched: false,
    visible: true,
    signupField: true
  }
};
