import * as actionTypes from "./actionTypes";
import axios from "../../axios-gsm";
import * as H from "../../util";

const AUTH_EXPIRY_TIME = 2 * 3600;
// const AUTH_EXPIRY_TIME = 2 * 1;
const signupUrl = "/utility/auth/signup/";
const signinUrl = "/utility/auth/login/";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const auth = (
  firstName,
  lastName,
  email,
  password,
  isSignup
) => dispatch => {
  dispatch(authStart());
  const authData = {
    email: email,
    password: password
  };
  if (isSignup) {
    authData["first_name"] = firstName;
    authData["last_name"] = lastName;
  }
  const url = isSignup ? signupUrl : signinUrl;
  axios
    .post(url, authData)
    .then(response => {
      if (isSignup) {
        if (response.data.response === "") {
          dispatch(
            authFail({
              message:
                "Verification link is sent to your email, please verify.",
              status: 202,
              success: true
            })
          );
        } else {
          dispatch(
            authFail({
              message: "Email already exist.",
              status: 203
            })
          );
        }
      } else {
        dispatch(
          authSuccess(
            H.keysToCamel(response.data.user),
            response.data.sessiontoken
          )
        );
      }
    })
    .catch(error => {
      dispatch(authFail(error.response.data));
    });
};

export const googleAuth = code => dispatch => {
  dispatch(authStart());
  axios
    .post("/utility/auth/google/", { auth_code: code })
    .then(response => {
      dispatch(
        authSuccess(
          H.keysToCamel(response.data.user),
          response.data.sessiontoken
        )
      );
    })
    .catch(() => {
      dispatch(authFail());
    });
};

export const facebookAuth = (inputToken, user) => dispatch => {
  dispatch(authStart());
  axios
    .post("/utility/auth/facebook/", {
      input_token: inputToken,
      user_details: user
    })
    .then(response => {
      dispatch(
        authSuccess(
          H.keysToCamel(response.data.user),
          response.data.sessiontoken
        )
      );
    })
    .catch(error => {
      dispatch(authFail(error));
    });
};

export const authSuccess = (user, token) => dispatch => {
  if (user.deactivatedAt) {
    // dispatch(logout());
    dispatch(
      authFail({
        Message:
          "Welcome back! You can reactivate your account on profile page.",
        success: true
      })
    );
    dispatch(authSuccessSave(user, token));
  } else {
    dispatch(authSuccessSave(user, token));
  }
};

export const authSuccessSave = (user, token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem(
    "loginTime",
    localStorage.getItem("loginTime") || Date.now()
  );
  axios.defaults.headers = {
    ...axios.defaults.headers,
    sessiontoken: localStorage.getItem("token")
  };
  return { type: actionTypes.AUTH_SUCCESS, user, token };
};

export const logout = isClientOnly => dispatch => {
  const token = localStorage.getItem("token");
  if (!token || isClientOnly) {
    dispatch(logoutSave());
  } else {
    dispatch(authStart());
    axios
      .post("/utility/auth/logout/", {})
      .then(() => {
        dispatch(logoutSave());
      })
      .catch(() => {
        dispatch(logoutSave());
        dispatch(authFail({ Message: "Server warning in logging out." }));
      });
  }
};

export const logoutSave = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("loginTime");
  delete axios.defaults.headers["sessiontoken"];
  return { type: actionTypes.LOGOUT };
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
    user = JSON.parse(localStorage.getItem("user"));
  // const loginTime = localStorage.getItem("loginTime");
  // const duration = Date.now() - Number(loginTime);
  // if (!token || !user || duration / 1000 >= AUTH_EXPIRY_TIME) {
  //   dispatch(logout());
  // } else {
  //   dispatch(checkAuthTimeout(AUTH_EXPIRY_TIME - duration / 1000));
  // }

  if (token && user) {
    dispatch(authSuccess(user, token));
  }
};

export const tosAgreed = () => {
  return {
    type: actionTypes.TOS_AGREED
  };
};

export const rdAgreed = () => {
  const user = {
    ...JSON.parse(localStorage.getItem("user")),
    rdAccepted: true,
    tosAccepted: true
  };
  localStorage.setItem("user", JSON.stringify(user));
  return {
    type: actionTypes.RD_AGREED
  };
};

export const reactivate = () => dispatch => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  user.deactivatedAt = null;
  dispatch(authSuccessSave(user, token));
};
