import React from "react";
import Chip from "../../components/_Chip/_Chip";

export default props => () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
     
      <Chip {...props} />
      &nbsp;&nbsp;<h2 style={{ marginRight: "4px" }}>Off</h2>
    </div>
  );
};
