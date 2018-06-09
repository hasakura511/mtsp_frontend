import React from "react";
import PropTypes from "prop-types";
import classes from "./FormatModal.css";

const formatModal = props => {
  const { title, children } = props;
  const Title = title;
  return (
    <div className={classes.FormatModal}>
      { 
      <div className={classes.Title}>
        {typeof title === "function" ? <Title /> : <h4><b>{title}</b></h4>}
      </div>
       }
      <div className={classes.Content}>{children}</div>
    </div>
  );
};
formatModal.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.any
};
export default formatModal;
