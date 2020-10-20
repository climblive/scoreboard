import { Button, Grid, Hidden } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import * as qs from "qs";
import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { getSelectedOrganizer } from "src/selectors/selector";
import { logout } from "../actions/actions";
import { login, selectOrganizer } from "../actions/asyncActions";
import { Organizer } from "../model/organizer";
import { StoreState } from "../model/storeState";

export interface Props {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    authControl: {
      marginLeft: "auto",
    },
    userName: {
      marginRight: theme.spacing(1),
    },
    adminChip: {
      marginRight: theme.spacing(1),
    },
    organizerSelector: { minWidth: 200 },
    selectOption: { color: theme.palette.primary.contrastText },
    loginProgress: { color: "white" },
  })
);

const TopMenu = (props: Props & PropsFromRedux & RouteComponentProps) => {
  const { login } = props;

  const classes = useStyles();

  useEffect(() => {
    let query = qs.parse(props.location.hash, {
      ignoreQueryPrefix: true,
    });
    let credentials: string | null = query.access_token as string;

    if (credentials) {
      login(credentials);
      props.history.push("/contests");
    } else {
      credentials = localStorage.getItem("credentials");

      if (credentials != null) {
        login(credentials);
      }
    }
  }, [props.history, props.location.hash, login]);

  const onOrganizerChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const id = parseInt(e.target.value as string);
    let organizer = props.organizers?.get(id);
    if (organizer !== undefined) {
      props.selectOrganizer(organizer.id!);
    }
  };

  const getUrl = (command: string) => {
    let url = "https://clmb.auth.eu-west-1.amazoncognito.com/";
    url += command;
    // Response type token or code
    url +=
      "?response_type=token&client_id=55s3rmvp8t26lmi0898n9d1lfn&redirect_uri=";
    url += encodeURIComponent(window.location.origin);
    return url;
  };

  const redirectToLogin = () => {
    window.location.href = getUrl("login");
  };

  const redirectToSignup = () => {
    window.location.href = getUrl("signup");
  };

  const logout = () => {
    localStorage.removeItem("credentials");
    props.logout();
  };

  return (
    <>
      <Hidden smDown implementation="css">
        {(props.organizers?.size ?? 0) > 1 && (
          <FormControl
            className={classes.organizerSelector}
            variant="outlined"
            size="small"
          >
            {props.selectedOrganizer !== undefined && (
              <Select
                id="series-select"
                value={props.selectedOrganizer.id}
                onChange={onOrganizerChange}
                className={classes.selectOption}
              >
                {props.organizers?.toArray()?.map((organizer: Organizer) => (
                  <MenuItem key={organizer.id} value={organizer.id}>
                    {organizer.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
        )}
      </Hidden>

      <div className={classes.authControl}>
        {props.loggingIn && (
          <CircularProgress size={20} className={classes.loginProgress} />
        )}
        {!props.loggingIn && !props.loggedInUser && (
          <div>
            <Button color="inherit" onClick={redirectToLogin}>
              Login
            </Button>
            <Button color="inherit" onClick={redirectToSignup}>
              Sign up
            </Button>
          </div>
        )}
        {props.loggedInUser && (
          <div>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <div>
                  <Grid
                    container
                    direction="row"
                    alignItems="flex-end"
                    wrap="wrap"
                  >
                    <Grid item>
                      <div className={classes.userName}>
                        {props.loggedInUser.name}
                      </div>
                    </Grid>
                    {props.loggedInUser.admin && (
                      <Hidden xsDown>
                        <Grid item>
                          <div className={classes.adminChip}>
                            <Chip
                              icon={<AccountCircleIcon />}
                              label="Admin"
                              color="secondary"
                              size="small"
                            />
                          </div>
                        </Grid>
                      </Hidden>
                    )}
                  </Grid>
                </div>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={logout} size="small">
                  <ExitToAppIcon /> Logout
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: StoreState, props: Props) => ({
  loggingIn: state.loggingIn,
  loggedInUser: state.loggedInUser,
  organizers: state.organizers,
  selectedOrganizer: getSelectedOrganizer(state),
});

const mapDispatchToProps = {
  login,
  logout,
  selectOrganizer,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(TopMenu));
