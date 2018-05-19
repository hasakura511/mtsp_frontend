//@flow
import React from "react";
import classes from "./Toolbar.css";
import Logo from "../../Logo/Logo";
// import PropTypes from "prop-types";
import NavigationItems from "../NavigationItems/NavigationItems";
import { connect } from "react-redux";
// import DropDown from "../../../containers/UI/DropDown/DropDown";

type PropType = {
  links: Array<string>,
  toggleSideDrawer: Function,
  isAuth: boolean,
  firstName: string
};

const toolbar = (props: PropType): React$Element<any> => {
  return (
    <header className={classes.Toolbar}>
      <button onClick={props.toggleSideDrawer}>
        <i className="fa fa-bars fa-2x" />
      </button>
      <Logo />
      <nav>
        <NavigationItems links={props.links} />
      </nav>
    </header>
  );
};

// toolbar.propTypes = {
//   links: PropTypes.array.isRequired,
//   toggleSideDrawer: PropTypes.func.isRequired,
//   isAuth: PropTypes.bool.isRequired,
//   firstName: PropTypes.string
// };

const mapStateToProps = (state: {
  auth: {
    token: string,
    firstName: string
  }
}): { firstName: string, isAuth: boolean } => {
  return {
    isAuth: state.auth.token !== null,
    firstName: state.auth.firstName
  };
};

export default connect(mapStateToProps)(toolbar);
