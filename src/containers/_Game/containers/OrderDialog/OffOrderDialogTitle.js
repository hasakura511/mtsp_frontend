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
      <h2 style={{ marginRight: "4px" }}>OFF</h2>
      <Chip {...props} />
    </div>
  );
};
