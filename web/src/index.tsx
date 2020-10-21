import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { createStore, applyMiddleware, compose } from "redux";
import { StoreState } from "./model/storeState";
import { reducer, ScoreboardActions } from "./reducers/reducer";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import initialState from "./initialState";
import * as serviceWorker from "./serviceWorker";

let middleware = [applyMiddleware(thunk)];

if (false) {
  middleware.push(
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );
}

const store = createStore<StoreState | undefined, ScoreboardActions, any, any>(
  reducer,
  initialState,
  compose(...middleware)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
