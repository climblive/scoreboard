import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import App from "./App";
import { Environment } from "./environment";
import "./index.css";
import initialState from "./initialState";
import { StoreState } from "./model/storeState";
import { reducer } from "./reducers/reducer";
import * as serviceWorker from "./serviceWorker";

let middleware = [applyMiddleware(thunk)];

if (Environment.siteDomain === "localhost") {
  middleware.push(
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );
}

const store = createStore<StoreState, any, any, any>(
  reducer,
  initialState,
  compose(...middleware)
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
