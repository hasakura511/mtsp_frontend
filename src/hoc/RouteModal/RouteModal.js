import React, { Component } from "react";
import Modal from "../../components/UI/Modal/Modal";
import PropTypes from 'prop-types';
import { Route, withRouter } from "react-router-dom";

class RouteModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true
    };
  }

  toggle = () => {
    if(this.props.redirectPath){
      this.props.history.replace(this.props.redirectPath);
      return;
    }
    this.props.history.goBack();    
  };


  render() {
    return (
      <Route path={this.props.path} exact >
        {({ match }) => (
        <Modal hidden={!match} toggle={this.toggle}>
          {this.props.children}
        </Modal>
      )}
      </Route>
    );
  }
}

RouteModal.propTypes = {
  history: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  children: PropTypes.any,
  redirectPath: PropTypes.string
}

export default withRouter(RouteModal);
