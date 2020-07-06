import * as React from "react";
import { Button, InputLabel, StyledComponentProps } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import withStyles from "@material-ui/core/styles/withStyles";
import { RouteComponentProps, withRouter } from "react-router";
import * as qs from "qs";
import CircularProgress from "@material-ui/core/CircularProgress";
import { User } from "../model/user";
import { Organizer } from "../model/organizer";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export interface TopMenuCompProps {
  title: string;
  loggingIn: boolean;
  loggedInUser?: User;
  organizers?: Organizer[];
  organizer?: Organizer;

  login?: (code: string) => void;
  logout?: () => void;
  setOrganizer?: (organizer: Organizer) => void;
}

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class TopMenuComp extends React.Component<
  TopMenuCompProps & RouteComponentProps & StyledComponentProps
> {
  theme = createMuiTheme({
    palette: {
      type: "dark",
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

  componentDidMount() {
    let query = qs.parse(this.props.location.hash, {
      ignoreQueryPrefix: true,
    });
    let credentials = query.access_token;

    if (credentials) {
      this.props.login!(credentials);
      this.props.history.push("/");
    } else {
      credentials = localStorage.getItem("credentials");

      if (credentials != null) {
        this.props.login!(credentials);
      }
    }
  }

  onOrganizerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    this.props.setOrganizer!(this.props.organizers!.find((o) => o.id == id)!);
  };

  getUrl = (command: string) => {
    let url = "https://clmb.auth.eu-west-1.amazoncognito.com/";
    url += command;
    // Response type token or code
    url +=
      "?response_type=token&client_id=55s3rmvp8t26lmi0898n9d1lfn&redirect_uri=";
    url += encodeURIComponent(window.location.origin);
    return url;
  };

  login = () => {
    window.location.href = this.getUrl("login");
  };

  signup = () => {
    window.location.href = this.getUrl("signup");
  };

  logout = () => {
    localStorage.removeItem("credentials");
    this.props.logout!();
  };

  render() {
    const title = this.props.title;
    const loggingIn = this.props.loggingIn;
    const loggedInUser = this.props.loggedInUser;
    const classes = this.props.classes!;
    const organizers = this.props.organizers;
    const organizer = this.props.organizer;
    return (
      <div>
        <AppBar position="static">
          <MuiThemeProvider theme={this.theme}>
            <Toolbar>
              {organizers && organizers.length > 1 && (
                <FormControl style={{ minWidth: 200, marginRight: 10 }}>
                  <InputLabel shrink htmlFor="series-select">
                    Organizer
                  </InputLabel>
                  <Select
                    id="series-select"
                    value={organizer!.id}
                    onChange={this.onOrganizerChange}
                  >
                    {organizers!.map((organizer) => (
                      <MenuItem key={organizer.id} value={organizer.id}>
                        {organizer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <Typography
                variant="h6"
                style={{ marginTop: 11 }}
                className={classes.grow}
              >
                {title}
              </Typography>
              {loggingIn && (
                <CircularProgress
                  style={{ color: "white", width: 20, height: 20 }}
                />
              )}
              {!loggingIn && !loggedInUser && (
                <div>
                  <Button color="inherit" onClick={this.login}>
                    Login
                  </Button>
                  <Button color="inherit" onClick={this.signup}>
                    Sign up
                  </Button>
                </div>
              )}
              {loggedInUser && (
                <div>
                  <span style={{ marginRight: 10 }}>{loggedInUser.name}</span>
                  <Button color="inherit" onClick={this.logout}>
                    Logout
                  </Button>
                </div>
              )}
            </Toolbar>
          </MuiThemeProvider>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(TopMenuComp));
