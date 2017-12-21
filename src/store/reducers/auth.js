import * as actionTypes from "../actions/actionTypes";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirect: "/",
  firstName: "Tommy",
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
        token: action.idToken,
        userId: action.userId,
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
