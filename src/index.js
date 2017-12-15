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

const rootReducer = combineReducers(reducers);

const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

window.ga('create', AppConfig.GA_TRACKING_ID, 'auto');

const elem = <Provider store={store}>
<BrowserRouter>
  <App />
</BrowserRouter>
</Provider>;

console.log(elem)

ReactDOM.render(
  elem,
  document.getElementById("root")
);
registerServiceWorker();
