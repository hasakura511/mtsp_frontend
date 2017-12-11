import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const saveOrder = order => dispatch => {
  dispatch({
    type: actionTypes.LOADING
  });
  axios
    .post("/orders.json", order)
    .then(response => {
      // console.log("response", response);
      // this.props.history.replace("/orders");
      // this.props.clearBurger();
      dispatch({
        type: actionTypes.LOADED
      })
      dispatch({
        type: actionTypes.CLEAR_BURGER
      })
    })
    .catch(error => {
      console.log("error", error);
      // this.setState({ loading: false, error: true });
      dispatch({
        type: actionTypes.ERROR
      });
    });
};
