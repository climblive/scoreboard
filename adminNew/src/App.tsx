import * as React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import StartContainer from './containers/StartContainer';
import SideMenuComp from "./components/SideMenuComp";
import TopMenuComp from "./components/TopMenuComp";
import ContestsContainer from "./containers/ContestsContainer";
import ContestContainer from "./containers/ContestContainer";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import IconButton from "@material-ui/core/IconButton";
import {Snackbar} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import {StoreState} from "./model/storeState";
import {connect, Dispatch} from "react-redux";
import * as actions from "./actions/actions";

export interface Props  {
   title: string,
   errorMessage?: string,
   clearErrorMessage?: () => void
}

class App extends React.Component<Props> {

   theme = createMuiTheme({
      palette: {
         primary: {
            // light: will be calculated from palette.primary.main,
            main: '#5f524a',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
         },
         secondary: {
            //light: '#0066ff',
               main: '#eb0708',
            // dark: will be calculated from palette.secondary.main,
            //contrastText: '#ffcc00',
         },
         // error: will use the default color
      },
   });

   handleClose = (event: any, reason?: any) => {
      this.props.clearErrorMessage!!()
   };

   public render() {
      return (
         <Router>
            <MuiThemeProvider theme={this.theme}>
               <div className="App">
                  <SideMenuComp/>
                  <div style={{flexGrow: 1, flexBasis: 0, display:'flex', flexDirection:'column'}}>
                     <TopMenuComp title={this.props.title} />
                     <div className="mainView">
                        <Switch>
                           <Route path="/" exact component={StartContainer} />
                           <Route path="/contests" exact component={ContestsContainer} />
                           <Route path="/contests/:id" component={ContestContainer} />
                           <Route path="/colors" exact component={StartContainer} />
                        </Switch>
                     </div>
                  </div>
               </div>
               <Snackbar
                  anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'center',
                  }}
                  style={{bottom:15}}
                  open={this.props.errorMessage != undefined}
                  autoHideDuration={6000}
                  onClose={this.handleClose}
                  message={<span id="message-id">{"" + this.props.errorMessage}</span>}
                  action={[
                     <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={this.handleClose}
                     >
                        <Close />
                     </IconButton>,
                  ]}
               />
            </MuiThemeProvider>
         </Router>
      );
   }
}

export function mapStateToProps(state: StoreState, props: any): Props {
   return {
      errorMessage: state.errorMessage,
      title: state.title,
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      clearErrorMessage: () => dispatch(actions.clearErrorMessage()),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
