import React from 'react';
import classes from './Footer.css'
import { Link } from "react-router-dom";

const footer = () => {
  return (
    <div className={classes.Footer}>
      <div className={classes.Left}>
        <p><strong>Copyright © 2017 GSM – All rights reserved.</strong></p>
      </div>
      <div className={classes.Right}>
        <Link to="/privacy_policy" target="_blank"><strong>PRIVACY POLICY</strong></Link>
        <Link to="/terms_of_service" target="_blank"><strong>TERMS OF SERVICE</strong></Link>
        <Link to="/risk_disclosure" target="_blank"><strong>RISK DISCLOSURE</strong></Link>
      </div>
    </div>
  );
};
footer.propTypes = {
  
}
export default footer;