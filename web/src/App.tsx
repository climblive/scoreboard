import * as React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import MainContainer from './containers/MainContainer';
import StartView from './components/StartView';
import DashboardContainer from './containers/DashboardContainer';

class App extends React.Component {
   public render() {
      return (
         <Router>
            <div className="App">
               <Switch>
                  <Route path="/" exact component={StartView} />
                  <Route path="/dashboard" component={DashboardContainer} />
                  <Route path="/:code" component={MainContainer} />
               </Switch>
            </div>
         </Router>
      );
   }
}

export default App;
