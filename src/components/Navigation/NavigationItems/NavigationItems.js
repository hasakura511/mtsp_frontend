import React from "react";
import PropTypes from "prop-types";
import classes from "./NavigationItems.css";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LRButton from "../../UI/LeftRoundButton/LeftRoundButton";
import DropDown from "../../../containers/UI/DropDown/DropDown";

const _ddnLinks = [
  {
    id: "ddn-1",
    href: "/profile",
    text: "Profile"
  },
  {
    id: "ddn-2",
    href: "/board",
    text: "Board"
  },
  {
    id: "ddn-3",
    href: "/logout",
    text: "Logout"
  }
];

const navigationItems = props => {
  const links = props.links.map(link => ({
    ...link,
    isVisible:
      link.show === 0 ||
      (props.isAuth && link.show === 2) ||
      (!props.isAuth && link.show === 1)
  }));
  const ddnLinks = _ddnLinks.map(ddnLink => (
    <li key={ddnLink.id}>
      <NavLink style={{fontSize: '0.5em'}} to={ddnLink.href}>
        {ddnLink.text}
      </NavLink>
    </li>
  ));

  return (
    <ul className={classes.NavigationItems}>
      {links.map(link => (
        <li key={link.id}>
          {link.isVisible ? (
            link.isButton ? (
              <LRButton
                width="159px"
                height="60%"
                style={{
                  background: "#0fc6a7",
                  borderColor: "#0fc6a7",
                  fontSize: "0.7em"
                }}
              >
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
      {props.isAuth ? (
        <li>
          <DropDown btnStyle={{fontSize: '0.5em'}} name={props.firstName} items={ddnLinks} />
        </li>
      ) : null}
    </ul>
  );
};

navigationItems.propTypes = {
  links: PropTypes.array.isRequired,
  isAuth: PropTypes.bool.isRequired,
  firstName: PropTypes.string
};
export default withRouter(
  connect(state => ({
    isAuth: state.auth.token !== null,
    firstName: state.auth.firstName
  }))(navigationItems)
);
