import * as actionTypes from "../actions/actionTypes";

const initialState = {
  token: null,
  error: null,
  loading: false,
  authRedirect: "/board",
  userId: null,
  firstName: null,
  lastName: null,
  email: null,
  tosAccepted: false,
  rdAccepted: false,
  gdprAccepted: false,
  deactivatedAt: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_AUTH_REDIRECT:
      return {
        ...state,
        authRedirect: action.path
      };
    case actionTypes.CLEAR_AUTH_REDIRECT:
      return {
        ...state,
        authRedirect: "/"
      };

    case actionTypes.TOS_AGREED:
      return {
        ...state,
        tosAccepted: true
      };
    case actionTypes.RD_AGREED:
      return {
        ...state,
        rdAccepted: true
      };
    case actionTypes.GDPR_AGREED:
      return {
        ...state,
        gdprAccepted: true
      };
    case actionTypes.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.token,
        userId: action.user.id,
        firstName: action.user.firstName,
        lastName: action.user.lastName,
        email: action.user.email,
        rdAccepted: action.user.rdAccepted,
        tosAccepted: action.user.tosAccepted,
        gdprAccepted:action.user.gdprAccepted,
        deactivatedAt: action.user.deactivatedAt,
        error: null
      };
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false
      };

    case actionTypes.LOGOUT:
      return {
        ...initialState
      };

    default:
      return state;
  }
};

export default reducer;
