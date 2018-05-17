import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import * as reducers from "./store/reducers";
import thunk from "redux-thunk";

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => {
      return store[key];
    },
    setItem: (key, value) => {
      store[key] = value + "";
    },
    clear: () => {
      store = {};
    },
    removeItem: key => {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    div
  );
});
