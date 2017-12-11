import React from 'react';
import PropTypes from 'prop-types';
import classes from './Footer.css'

const footer = (props) => {
  return (
    <div className={classes.Footer}>
      <div className={classes.Left}>
        <p><strong>Copyright © 2017 GSM – All rights reserved.</strong></p>
      </div>
      <div className={classes.Right}>
        <a href="/privacy_policy" target="_blank"><strong>PRIVACY POLICY</strong></a>
        <a href="/terms_of_service" target="_blank"><strong>TERMS OF SERVICE</strong></a>
      </div>
    </div>
  );
};
footer.propTypes = {
  
}
export default footer;