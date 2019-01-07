import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
/*import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { StoreState } from './storeState';
import { reducer } from './reducers/reducer';
*/
/*const store = createStore<StoreState>(reducer, {
   enthusiasmLevel: 1,
   languageName: 'TypeScript',
});*/

   // <Provider store={store}>
   // </Provider>

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
