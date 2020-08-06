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

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#5f524a",
    },
    secondary: {
      main: "#eb0708",
    },
  },
});

const App = (props: Props) => {
  const handleClose = (event: any, reason?: any) => {
    props.clearErrorMessage!!();
  };

  return (
    <Router>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <MuiThemeProvider theme={theme}>
          <div className="App">
            <SideMenuComp loggedInUser={props.loggedInUser} />
            <div
              style={{
                flexGrow: 1,
                flexBasis: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <TopMenuComp
                login={props.login}
                logout={props.logout}
                loggingIn={props.loggingIn}
                loggedInUser={props.loggedInUser}
                organizers={props.organizers}
                selectedOrganizer={props.selectedOrganizer}
                selectOrganizer={props.selectOrganizer}
                title={props.title}
              />
              <div className="mainView">
                {props.loggedInUser && (
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
                    <Route path="/organizers" exact component={OrganizerList} />
                    <Route path="/locations" exact component={LocationList} />
                  </Switch>
                )}
                {!props.loggedInUser && <WelcomeView />}
              </div>
            </div>
          </div>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            style={{ bottom: 15 }}
            open={props.errorMessage != undefined}
            autoHideDuration={6000}
            onClose={handleClose}
            message={<span id="message-id">{"" + props.errorMessage}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={handleClose}
              >
                <Close />
              </IconButton>,
            ]}
          />
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    </Router>
  );
};

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
