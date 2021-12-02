import { Menu } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import React, { useState } from "react";
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
    avatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    menuWrapper: {
      cursor: "pointer",
    },
    organizerSelector: { minWidth: 200 },
    selectOption: { color: theme.palette.primary.contrastText },
    loginProgress: { color: "white" },
  })
);

const TopMenu = (props: Props & PropsFromRedux & RouteComponentProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

      <div className={classes.authControl}>
        {props.loggedInUser && (
          <>
            <div
              className={classes.menuWrapper}
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              <Avatar className={classes.avatar}>
                <PersonIcon />
              </Avatar>
            </div>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </>
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
