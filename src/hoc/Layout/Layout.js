import React from "react";
import PropTypes from "prop-types";
import Aux from "../_Aux/_Aux";
import styles from "./Layout.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Footer from "../../components/UI/Footer/Footer";
import Toasters from "../../containers/UI/Toasters/Toasters";
import Dialog from "../../components/UI/Modal/Dialog";
import HtmlDialog from "../../components/UI/Modal/HtmlDialog"
import HtmlDialog2 from "../../components/UI/Modal/HtmlDialog2"
import HtmlDialog3 from "../../components/UI/Modal/HtmlDialog3"
// show 0 to show always, 1 for logged out and 2 for logged in users
const LINKS = [
  
  {
    id: "link5",
    href: "/accounts",
    target: "_self",
    active: false,
    text: "ACCOUNTS",
    exact: true,
    show: 2
  },
  {
    id: "link6",
    href: "/markets",
    target: "_self",
    active: false,
    text: "MARKETS",
    exact: true,
    show: 2
  },
  {
    id: "link4",
    href: "/board",
    target: "_self",
    active: false,
    text: "BOARD",
    exact: true,
    show: 2
  },
  {
    id: "link2",
    href: "/auth?signin",
    target: "_self",
    active: false,
    text: "LOGIN",
    show: 1
  },
  {
    id: "link3",
    href: "/auth?signup",
    target: "_self",
    active: false,
    text: "REGISTER",
    show: 1,
    isButton: true
  }
];

const layout = props => (
  <Aux style={{zIndex:0}}>
    

    <Toolbar links={LINKS} toggleSideDrawer={props.toggleSideDrawer} />
    {/* <div>SideDrawer, Backdrop</div> */}
    <SideDrawer
      links={LINKS}
      show={props.showSideDrawer}
      toggle={props.toggleSideDrawer}
    />
    <Backdrop show={props.showSideDrawer} toggle={props.toggleSideDrawer} />
    <main style={{zIndex:0}} className={styles.Content}>{props.children}</main>
    <Footer />
    <div style={{zIndex:1}}>
      <Dialog />
    </div>  
    <div style={{zIndex:2}}>
        <HtmlDialog />
    </div>
    <div style={{zIndex:3}}>
        <HtmlDialog2 />
    </div>
    <div style={{zIndex:4}}>
        <HtmlDialog3 />
    </div>
    <Toasters />
    
  </Aux>
);

layout.propTypes = {
  children: PropTypes.any,
  toggleSideDrawer: PropTypes.func.isRequired,
  showSideDrawer: PropTypes.bool.isRequired
};

export default layout;
