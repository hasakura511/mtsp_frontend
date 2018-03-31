import * as actionTypes from "./actionTypes";

export const addToaster = toaster => ({
  toaster: toaster,
  type: actionTypes.ADD_TOASTER
});

export const removeToaster = id => ({
  id: id,
  type: actionTypes.REMOVE_TOASTER
});

export const addTimedToaster = (toaster, timeout) => dispatch => {
  dispatch(addToaster(toaster));

  // enable it for disappearing message
  // if (timeout) {
  //   setTimeout(() => {
  //     dispatch(removeToaster(toaster.id));
  //   }, timeout);
  // }
};

export const clearAll = () => ({
  type: actionTypes.CLEAR_ALL
})
