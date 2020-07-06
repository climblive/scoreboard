import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { createStore, applyMiddleware, compose } from "redux";
import { StoreState } from "./model/storeState";
import { reducer } from "./reducers/reducer";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { Environment } from "./environment";

let middleware = [applyMiddleware(thunk)];

if (Environment.siteDomain.startsWith("test")) {
  const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  middleware.push(
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );
}

const store = createStore<StoreState, any, any, any>(
  reducer,
  {},
  compose(...middleware)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
