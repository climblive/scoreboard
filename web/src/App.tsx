import * as React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import MainContainer from './containers/MainContainer';
import ScoreboardContainer from './containers/ScoreboardContainer';
import StartContainer from './containers/StartContainer';

class App extends React.Component {
   public render() {
      return (
         <Router>
            <div className="App">
               <Switch>
                  <Route path="/" exact component={StartContainer} />
                  <Route path="/scoreboard/:id" component={ScoreboardContainer} />
                  <Route path="/:code" component={MainContainer} />
               </Switch>
            </div>
         </Router>
      );
   }
}

export default App;
