import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { StoreState } from './model/storeState';
import { reducer } from './reducers/reducer';
import { Provider } from 'react-redux';

const store = createStore<StoreState>(reducer, {
   enthusiasmLevel: 1,
   languageName: 'TypeScript',
   problems: [
      { id: 1, color: "#FF0000", points: 150, text: "" },
      { id: 2, color: "#FF0000", points: 50, text: "" },
      { id: 3, color: "#FF0000", points: 100, text: "" }
   ]
});

ReactDOM.render(
   <Provider store={store}>
      <App />
   </Provider>,
   document.getElementById('root') as HTMLElement
);
registerServiceWorker();
