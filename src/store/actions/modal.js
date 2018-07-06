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

export const silenceDialog = () => {
  return {
    type: actionTypes.SILENCE_DIALOG
  };
};

export const loadingDialog = () => {
  return {
    type: actionTypes.LOADING_DIALOG
  };
};

export const showHtmlDialog = (
  htmlContent
) => {
  console.log(arguments);
  return {
    type: actionTypes.SHOW_HTML_DIALOG,
    htmlContent
  };
};

export const silenceHtmlDialog = () => {
  return {
    type: actionTypes.SILENCE_HTML_DIALOG
  };
};