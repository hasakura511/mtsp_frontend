import * as actionTypes from "../actions/actionTypes";

const initialState = {
  show: false,
  showHtml: false,
  htmlContent: null,
  showHtml2: false,
  htmlContent2: null,
  title: "",
  message: null,
  onSuccess: null,
  onCancel: null,
  cancelAction: "Cancel",
  successAction: "Accept",
  loading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_HTML_DIALOG:
      return {
        ...state,
        showHtml: true,
        htmlContent: action.htmlContent

      }

    case actionTypes.SILENCE_HTML_DIALOG:
      return {
        ...state,
        showHtml: false,
        htmlContent: null,
        
      }

      case actionTypes.SHOW_HTML_DIALOG2:
      return {
        ...state,
        showHtml2: true,
        htmlContent2: action.htmlContent

      }

    case actionTypes.SILENCE_HTML_DIALOG2:
      return {
        ...state,
        showHtml2: false,
        htmlContent2: null,
        
      }

    case actionTypes.SHOW_DIALOG:
      return {
        ...state,
        show: true,
        title: action.title,
        message: action.message,
        onSuccess: action.onSuccess,
        onCancel: action.onCancel,
        cancelAction: action.cancelAction || state.cancelAction,
        successAction: action.successAction || state.successAction,
        loading: action.loading || state.loading
      };

    case actionTypes.LOADING_DIALOG:
      return {
        ...state,
        loading: true
      };

    case actionTypes.SILENCE_DIALOG:
      return {
        ...state,
        show: false
      };
      
    default:
      return state;
  }
};

export default reducer;
