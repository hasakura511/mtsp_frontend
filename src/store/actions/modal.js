import * as actionTypes from "./actionTypes";

export const showDialog = (
  title,
  message,
  onSuccess,
  onCancel,
  successAction,
  cancelAction
) => {
  console.log(arguments);
  return {
    type: actionTypes.SHOW_DIALOG,
    onSuccess,
    onCancel,
    message,
    title,
    successAction,
    cancelAction
  };
};

export const killDialog = () => {
  return {
    type: actionTypes.KILL_DIALOG
  };
};

export const loadingDialog = () => {
  return {
    type: actionTypes.LOADING_DIALOG
  };
};
