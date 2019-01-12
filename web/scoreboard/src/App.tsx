import * as React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";

import MainContainer from './containers/MainContainer';
import StartView from './components/StartView';

class App extends React.Component {
   public render() {
      return (
         <Router>
            <div className="App">
               <Route path="/" exact component={StartView} />
               <Route path="/apa" component={MainContainer} />
            </div>
         </Router>
      );
   }
}

export default App;
