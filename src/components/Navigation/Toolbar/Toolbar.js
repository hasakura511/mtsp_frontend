import React from "react";
import classes from "./Toolbar.css";
import Logo from "../../Logo/Logo";
import PropTypes from "prop-types";
import NavigationItems from "../NavigationItems/NavigationItems";
import { connect } from "react-redux";
import DropDown from "../../../containers/UI/DropDown/DropDown";

const toolbar = props => {
  return (
    <header className={classes.Toolbar}>
      <button onClick={props.toggleSideDrawer}>
        <i className="fa fa-bars fa-2x" />
      </button>
      <Logo />
      <DropDown name={props.firstName} items={['1','2','3']}/>
      <nav>
        <NavigationItems links={props.links} />
      </nav>
    </header>
  );
};

toolbar.propTypes = {
  links: PropTypes.array.isRequired,
  toggleSideDrawer: PropTypes.func.isRequired,
  isAuth: PropTypes.bool.isRequired,
  firstName: PropTypes.string
};

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token !== null,
    firstName: state.auth.firstName
  }
}

export default connect(mapStateToProps)(toolbar);
