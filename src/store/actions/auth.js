import * as actionTypes from "./actionTypes";
import axios from "axios";

const AUTH_EXPIRY_TIME = 2 * 3600;

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

const signupUrl =
  "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDPIWqm0iVQv7CmOSiQ_LJ26pAw43yRuU4";
const signinUrl =
  "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDPIWqm0iVQv7CmOSiQ_LJ26pAw43yRuU4";

export const authSuccess = (idToken, userId) => {
  localStorage.setItem("token", idToken);
  localStorage.setItem("userId", userId);
  localStorage.setItem("loginTime", Date.now());
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: idToken,
    userId: userId
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const auth = (email, password, isSignup) => dispatch => {
  dispatch(authStart());
  const authData = {
    email: email,
    password: password,
    returnSecureToken: true
  };
  const url = isSignup ? signupUrl : signinUrl;
  axios
    .post(url, authData)
    .then(response => {
      dispatch(checkAuthTimeout(AUTH_EXPIRY_TIME));
      dispatch(authSuccess(response.data.idToken, response.data.localId));
    })
    .catch((error, response) => {
      dispatch(authFail(error));
    });
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("loginTime");
  return {
    type: actionTypes.LOGOUT
  };
};

export const setAuthRedirect = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT,
    path: path
  };
};

export const clearAuthRedirect = () => {
  return {
    type: actionTypes.CLEAR_AUTH_REDIRECT
  };
};

export const checkAuthTimeout = expirationTime => dispatch => {
  setTimeout(() => {
    dispatch(logout());
  }, expirationTime * 1000);
};

export const checkAuth = () => dispatch => {
  const token = localStorage.getItem("token"),
    userId = localStorage.getItem("userId"),
    loginTime = localStorage.getItem("loginTime");
  const duration = Date.now() - Number(loginTime);
  if (
    token === null ||
    userId === null ||
    duration / 1000 >= AUTH_EXPIRY_TIME
  ) {
    dispatch(logout());
  } else {
    dispatch(checkAuthTimeout(AUTH_EXPIRY_TIME - duration / 1000));
    dispatch(authSuccess(token, userId));
  }
};
