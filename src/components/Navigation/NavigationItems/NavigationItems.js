import React from "react";
import PropTypes from "prop-types";
import classes from "./NavigationItems.css";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LRButton from "../../UI/LeftRoundButton/LeftRoundButton";

const navigationItems = props => {
  const links = props.links.map(link => ({
    ...link,
    isVisible:
      link.show === 0 ||
      (props.isAuth && link.show === 2) ||
      (!props.isAuth && link.show === 1)
  }));
  return (
    <ul className={classes.NavigationItems}>
      {links.map(link => (
        <li key={link.id}>
          {link.isVisible ? (
            link.isButton ? (
              <LRButton width="159px" height="60%" rad="20px" style={{
                background: '#0fc6a7',
                borderColor: '#0fc6a7',
                fontSize: '0.7em'
              }}>
                <NavLink
                  exact={link.exact}
                  to={link.href}
                  activeClassName={classes.active}
                >
                  {link.text}
                </NavLink>
              </LRButton>
            ) : (
              <NavLink
                exact={link.exact}
                to={link.href}
                activeClassName={classes.active}
              >
                {link.text}
              </NavLink>
            )
          ) : null}
        </li>
      ))}
    </ul>
  );
};

navigationItems.propTypes = {
  links: PropTypes.array.isRequired,
  isAuth: PropTypes.bool.isRequired
};
export default withRouter(
  connect(state => ({
    isAuth: state.auth.token !== null
  }))(navigationItems)
);
