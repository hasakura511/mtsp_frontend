import React, { Component } from "react";
import classes from "./Extras.css";
import Aux from "../../hoc/_Aux/_Aux";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-constants";
import Spinner from "../UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

export const WithLinks = props => {
  return props.str
    ? props.str.split(/\<|\>/).map((chunk, i) => {
        if (i % 2) {
          const splittedChunk = chunk.split(/\{|\}/);
          return (
            <a key={"link-" + i} target="_blank" href={splittedChunk[1]}>
              {splittedChunk[splittedChunk.length - 1]}
            </a>
          );
        } else {
          return chunk;
        }
      })
    : null;
};

export const withHeaders = str => {
  return str
    ? str.split("[").map((substr, i) =>
        substr.split("]").map((content, j) => {
          if (j === 0) {
            return (
              <p key={"content" + i + "-" + j}>
                <strong>
                  <WithLinks str={content} />
                </strong>
              </p>
            );
          } else {
            const formatContent = content
              .split(/[.]\n/)
              .filter(line => line && line !== "\n" && line !== " ")
              .map((line, k) => (
                <Aux key={"line" + i + j + k}>
                  <WithLinks str={line + "."} />
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

@withErrorHandler(axios)
export default class Extras extends Component {
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

  static propTypes = {
    location: PropTypes.object.isRequired
  };
}
