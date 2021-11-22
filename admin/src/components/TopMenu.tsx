import { Button, Grid, Hidden } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { getSelectedOrganizer } from "src/selectors/selector";
import { logout } from "../actions/actions";
import { selectOrganizer } from "../actions/asyncActions";
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
  const classes = useStyles();

  const onOrganizerChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const id = parseInt(e.target.value as string);
    let organizer = props.organizers?.get(id);
    if (organizer !== undefined) {
      props.selectOrganizer(organizer.id!);
    }
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
  loggedInUser: state.loggedInUser,
  organizers: state.organizers,
  selectedOrganizer: getSelectedOrganizer(state),
});

const mapDispatchToProps = {
  logout,
  selectOrganizer,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(TopMenu));
