import { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

class ScrollTop extends Component {
  componentDidUpdate(prevProps) {
    if(prevProps.location !== this.props.location && this.props.location.hash === ""){
      window.scrollTo(0,0);
    }
  }

  render() {
    return this.props.children
  }
}

ScrollTop.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object.isRequired,
};

export default withRouter(ScrollTop);