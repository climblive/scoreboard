import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux';
import { StoreState } from './model/storeState';
import { reducer } from './reducers/reducer';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

const store = createStore<StoreState, any, any, any>(reducer, {}, applyMiddleware(thunk));

ReactDOM.render(
   <Provider store={store}>
      <App />
   </Provider>,
   document.getElementById('root') as HTMLElement
);
registerServiceWorker();
