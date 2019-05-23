import * as React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import StartContainer from './containers/StartContainer';
import SideMenuComp from "./components/SideMenuComp";
import TopMenuComp from "./components/TopMenuComp";
import ContestsContainer from "./containers/ContestsContainer";
import ContestContainer from "./containers/ContestContainer";

class App extends React.Component {
   public render() {
      return (
         <Router>
            <div className="App">
               <SideMenuComp/>
               <div style={{flexGrow: 1, display:'flex', flexDirection:'column'}}>
                  <TopMenuComp/>
                  <Switch>
                     <Route path="/" exact component={StartContainer} />
                     <Route path="/contests" exact component={ContestsContainer} />
                     <Route path="/contests/:id" component={ContestContainer} />
                     <Route path="/colors" exact component={StartContainer} />
                  </Switch>
               </div>
            </div>
         </Router>
      );
   }
}

export default App;
