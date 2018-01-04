import React, { Component } from "react";
import classes from "./Extras.css";
import Aux from "../../hoc/_Aux/_Aux";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-constants";
import Spinner from "../UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

export const withHeaders = str => {
  return str
    ? str.split("[").map((substr, i) =>
        substr.split("]").map((content, j) => {
          if (j === 0) {
            return (
              <p key={"content" + i + "-" + j}>
                <strong>{content}</strong>
              </p>
            );
          } else {
            const formatContent = content
              .split(/[.]\n/)
              .filter(line => line && line !== "\n" && line !== " ")
              .map((line, k) => (
                <Aux key={"line" + i + j + k}>
                  {line + "."}
                  <br />
                </Aux>
              ));
            return (
              <p key={"content" + i + "-" + j}>
                {formatContent}
                <br />
              </p>
            );
          }
        })
      )
    : null;
};

class Extras extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      text: ""
    };
  }

  componentDidMount() {
    axios
      .get(this.props.location.pathname + ".json")
      .then(response => {
        this.setState({
          loading: false,
          text: response.data
        });
      })
      .catch(() => {
        this.setState({ error: true });
      });
  }

  render() {
    if (this.state.error) {
      return <Redirect to="/" />;
    }
    return this.state.loading ? (
      <Spinner />
    ) : (
      <div className={classes.Container}>{withHeaders(this.state.text)}</div>
    );
  }
}

Extras.propTypes = {
  location: PropTypes.object.isRequired
};

// export default { PrivacyPolicy, TermsOfService, RiskDisclosure };
export default withErrorHandler(axios)(Extras);
