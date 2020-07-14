import * as React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import SideMenuComp from "./components/SideMenuComp";
import TopMenuComp from "./components/TopMenuComp";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { Snackbar } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { StoreState } from "./model/storeState";
import { connect } from "react-redux";
import { clearErrorMessage, logout } from "./actions/actions";
import { selectOrganizer } from "./actions/asyncActions";
import { login } from "./actions/asyncActions";
import ContestList from "./components/contest/ContestList";
import ContestInfo from "./components/contest/ContestInfo";
import ColorList from "./components/color/ColorList";
import SeriesList from "./components/series/SeriesList";
import { User } from "./model/user";
import { Organizer } from "./model/organizer";
import WelcomeView from "./views/WelcomeView";
import OrganizerList from "./components/organizer/OrganizerList";
import LocationList from "./components/location/LocationList";
import { getSelectedOrganizer } from "src/selectors/selector";

export interface Props {
  title: string;
  errorMessage?: string;
  loggedInUser?: User;
  loggingIn: boolean;
  organizers?: Organizer[];
  selectedOrganizer?: Organizer;
  clearErrorMessage?: () => void;
  changeOrganizer?: (organizer: Organizer) => void;
  login?: (code: string) => void;
  logout?: () => void;
  selectOrganizer?: (organizerId: number) => void;
}

class App extends React.Component<Props> {
  theme = createMuiTheme({
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: "#5f524a",
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        //light: '#0066ff',
        main: "#eb0708",
        // dark: will be calculated from palette.secondary.main,
        //contrastText: '#ffcc00',
      },
      // error: will use the default color
    },
  });

  handleClose = (event: any, reason?: any) => {
    this.props.clearErrorMessage!!();
  };

  public render() {
    return (
      <Router>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <MuiThemeProvider theme={this.theme}>
            <div className="App">
              <SideMenuComp loggedInUser={this.props.loggedInUser} />
              <div
                style={{
                  flexGrow: 1,
                  flexBasis: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TopMenuComp
                  login={this.props.login}
                  logout={this.props.logout}
                  loggingIn={this.props.loggingIn}
                  loggedInUser={this.props.loggedInUser}
                  organizers={this.props.organizers}
                  selectedOrganizer={this.props.selectedOrganizer}
                  selectOrganizer={this.props.selectOrganizer}
                  title={this.props.title}
                />
                <div className="mainView">
                  {this.props.loggedInUser && (
                    <Switch>
                      <Route path="/" exact component={WelcomeView} />
                      <Route path="/start" exact component={WelcomeView} />
                      <Route path="/contests" exact component={ContestList} />
                      <Route
                        path="/contests/:contestId"
                        component={ContestInfo}
                      />
                      <Route path="/colors" exact component={ColorList} />
                      <Route path="/series" exact component={SeriesList} />
                      <Route
                        path="/organizers"
                        exact
                        component={OrganizerList}
                      />
                      <Route path="/locations" exact component={LocationList} />
                    </Switch>
                  )}
                  {!this.props.loggedInUser && <WelcomeView />}
                </div>
              </div>
            </div>
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              style={{ bottom: 15 }}
              open={this.props.errorMessage != undefined}
              autoHideDuration={6000}
              onClose={this.handleClose}
              message={
                <span id="message-id">{"" + this.props.errorMessage}</span>
              }
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
        </MuiPickersUtilsProvider>
      </Router>
    );
  }
}

export function mapStateToProps(state: StoreState, props: any): Props {
  return {
    errorMessage: state.errorMessage,
    title: state.title,
    loggingIn: state.loggingIn,
    loggedInUser: state.loggedInUser,
    organizers: state.organizers,
    selectedOrganizer: getSelectedOrganizer(state),
  };
}

const mapDispatchToProps = {
  clearErrorMessage,
  login,
  logout,
  selectOrganizer,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
