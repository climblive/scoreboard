import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { IStoreState } from './storeState';
import { reducer } from './reducers/reducer';
import { Provider } from 'react-redux';

const store = createStore<IStoreState>(reducer, {
   enthusiasmLevel: 1,
   languageName: 'TypeScript',
});

ReactDOM.render(
   <Provider store={store}>
      <App />
   </Provider>,
   document.getElementById('root') as HTMLElement
);
registerServiceWorker();
