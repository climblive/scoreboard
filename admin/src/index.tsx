import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import App from "./App";
import { Environment } from "./environment";
import "./index.css";
import initialStore from "./initialState";
import { StoreState } from "./model/storeState";
import { reducer, ScoreboardActions } from "./reducers/reducer";
import * as serviceWorker from "./serviceWorker";

let middleware = [applyMiddleware(thunk)];

if (Environment.siteDomain === "localhost") {
  middleware.push(
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );
}

const store = createStore<StoreState | undefined, ScoreboardActions, any, any>(
  reducer,
  initialStore,
  compose(...middleware)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
