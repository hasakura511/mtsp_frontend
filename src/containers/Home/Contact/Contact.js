import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./Contact.css";
import FormatModal from "../../../components/UI/FormatModal/FormatModal";
import Input from "../../../components/UI/Input/Input";
import { clone } from "../../../util";
import { withRouter } from "react-router-dom";
import axios from "axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";

class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: {
        name: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "Full name"
          },
          value: "",
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        email: {
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
          touched: false
        },
        message: {
          elementType: "textarea",
          elementConfig: {
            type: "text",
            placeholder: "Message"
          },
          value: "",
          validation: {},
          valid: false,
          touched: false
        }
      },
      formIsValid: false,
      loading: false
    };
  }

  inputChangeHandler = (event, identifier) => {
    const updatedValue = event.target.value,
      isValid = this.checkValidity(
        updatedValue,
        this.state.controls[identifier].validation
      );
    this.setState(prevState => {
      const controls = clone(prevState.controls);
      controls[identifier]["value"] = updatedValue;
      controls[identifier]["valid"] = isValid;
      controls[identifier]["touched"] = true;
      let formIsValid = true;
      for (let key in controls) {
        formIsValid = formIsValid && controls[key].valid;
      }
      return { controls: controls, formIsValid: formIsValid };
    });
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.trim().length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.trim().length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isValid = pattern.test(value.trim()) && isValid;
    }

    return isValid;
  }

  onFormSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });

    //Do axios
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.history.goBack();
    }, 2000);
  };

  render() {
    const formArr = [];
    Object.keys(this.state.controls).forEach(key => {
      formArr.push({
        id: key,
        ...this.state.controls[key]
      });
    });
    return (
      <FormatModal title="Contact Us">
        <div className={classes.Contact}>
          {this.state.loading ? (
            <Spinner />
          ) : (
            <form onSubmit={this.onFormSubmit}>
              {formArr.map(formElem => (
                <Input
                  key={formElem.id}
                  elementType={formElem.elementType}
                  elementConfig={formElem.elementConfig}
                  value={formElem.value}
                  inputChangeHandler={event =>
                    this.inputChangeHandler(event, formElem.id)
                  }
                  valid={formElem.valid || !formElem.touched}
                />
              ))}
              <span>
                <button disabled={!this.state.formIsValid} type="submit">
                  Continue
                </button>
              </span>
            </form>
          )}
        </div>
      </FormatModal>
    );
  }
}

Contact.propTypes = {
  history: PropTypes.object.isRequired
};
export default withErrorHandler(withRouter(Contact), axios);
