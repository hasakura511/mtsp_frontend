import React, { Component } from "react";
import Toaster from "../../../components/UI/Toaster/Toaster";
import classes from "./Toasters.css";
import * as actions from "../../../store/actions/index";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { TransitionGroup } from "react-transition-group";
import Fade from "../../../hoc/withFade/withFade";

class Toasters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focused_toaster: null
    };
  }

  closeHandler = id => {
    this.props.removeToaster(id);
  };

  focusHandler = id => {
    this.setState({ focused_toaster: id });
  };

  unFocusHandler = () => {
    this.setState({ focused_toaster: null });
  };

  render() {
    return (
      <div className={classes.Toasters}>
        <TransitionGroup>
        {this.props.toasters.map(toaster => (
          <Fade key={toaster.id}>
            <Toaster
              id={toaster.id}
              text={toaster.text}
              closeClick={this.closeHandler}
              onFocusHandler={this.focusHandler}
              onUnfocusHandler={this.unFocusHandler}
              isFocused={this.state.focused_toaster === toaster.id}
            />
          </Fade>
        ))}
        </TransitionGroup>
      </div>
    );
  }
}

Toasters.propTypes = {
  removeToaster: PropTypes.func.isRequired,
  toasters: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  toasters: state.toasters.toasters
});

const mapDispatchToProps = dispatch => ({
  removeToaster: id => dispatch(actions.removeToaster(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Toasters);
