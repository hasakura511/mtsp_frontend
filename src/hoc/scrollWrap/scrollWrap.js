import React, { Component } from "react";
import PropTypes from "prop-types";

const scrollWrap = WrappedComponent => {
  class ScrollWrap extends Component {
    static propTypes = {
      onWindowScroll: PropTypes.func
    };

    componentDidMount() {
      if (this.props.onWindowScroll) {
        window.addEventListener("scroll", this.handleScroll);
      }
    }

    componentWillUnmount() {
      if (this.props.onWindowScroll) {
        window.removeEventListener("scroll", this.handleScroll);
      }
    }

    handleScroll = event => {
      if (this.props.onWindowScroll) {
        this.props.onWindowScroll(event);
      }
    };

    render() {
      this.props.onWindowScroll;
      return <WrappedComponent {...this.props}/>;
    }
  }

  ScrollWrap.propTypes = {
    onWindowScroll: PropTypes.func
  };

  return ScrollWrap;
};

export default scrollWrap;
