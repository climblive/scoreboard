import * as React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import StartView from "./components/StartView";
import ScoreboardView from "./components/ScoreboardView";
import MainView from "./components/MainView";

class App extends React.Component {
  public render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component={StartView} />
            <Route path="/scoreboard/:id" component={ScoreboardView} />
            <Route path="/:code" component={MainView} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
