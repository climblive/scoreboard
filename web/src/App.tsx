import * as React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import MainContainer from './containers/MainContainer';
import DashboardContainer from './containers/DashboardContainer';
import StartContainer from './containers/StartContainer';

class App extends React.Component {
   public render() {
      return (
         <Router>
            <div className="App">
               <Switch>
                  <Route path="/" exact component={StartContainer} />
                  <Route path="/dashboard" component={DashboardContainer} />
                  <Route path="/:code" component={MainContainer} />
               </Switch>
            </div>
         </Router>
      );
   }
}

export default App;
