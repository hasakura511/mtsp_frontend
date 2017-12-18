import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import AppConfig from "./AppConfig";
import * as reducers from "./store/reducers";
// import { actionTypes } from "./store/actions";
import thunk from "redux-thunk";
import ScrollTop from "./hoc/ScrollTop/ScrollTop";
const rootReducer = combineReducers(reducers);

const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

window.ga("create", AppConfig.GA_TRACKING_ID, "auto");

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ScrollTop>
        <App />
      </ScrollTop>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
