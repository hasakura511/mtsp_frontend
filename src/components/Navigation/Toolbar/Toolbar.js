import React from "react";
import classes from "./Toolbar.css";
import Logo from "../../Logo/Logo";
import PropTypes from "prop-types";
import NavigationItems from "../NavigationItems/NavigationItems";
import RouteModal from "../../../hoc/RouteModal/RouteModal";
import Contact from "../../../containers/Home/Contact/Contact";

const toolbar = props => {
  return (
    <header className={classes.Toolbar}>
      <RouteModal path="/contact">
        <Contact />
      </RouteModal>
      <button onClick={props.toggleSideDrawer}>
        <i className="fa fa-bars fa-2x" />
      </button>
      <Logo />
      <nav>
        {/* ... */}
        <NavigationItems links={props.links} />
      </nav>
    </header>
  );
};

toolbar.propTypes = {
  links: PropTypes.array.isRequired,
  toggleSideDrawer: PropTypes.func.isRequired
};
export default toolbar;
