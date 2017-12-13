import React from "react";
import logoImg from "../../assets/images/logo.png";
import classes from "./Logo.css";
import { NavLink } from "react-router-dom";

const logo = () => {
  return (
    <div className={classes.Logo}>
      <NavLink to="/">
        <img src={logoImg} alt="GSM" />
      </NavLink>
    </div>
  );
};
export default logo;
