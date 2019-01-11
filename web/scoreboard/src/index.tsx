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
   name: 'Jesper Sölver',
   compClass: 'Herr',
   problems: [
      { id: 1, color: "#C50000", textColor: "#FFFFFF", colorName: "Röd", points: 150, text: "", isSent: false },
      { id: 2, color: "#ce1da4", textColor: "#FFFFFF", colorName: "Lila", points: 50, text: "", isSent: false },
      { id: 3, color: "#ffcd00", textColor: "#333", colorName: "Gul", points: 50, text: "", isSent: false },
      { id: 4, color: "#000000", textColor: "#FFFFFF", colorName: "Svart", points: 100, text: "", isSent: true },
      { id: 5, color: "#FFFFFF", textColor: "#333", colorName: "Vit", points: 250, text: "", isSent: false }
   ]
});

ReactDOM.render(
   <Provider store={store}>
      <App />
   </Provider>,
   document.getElementById('root') as HTMLElement
);
registerServiceWorker();
