import { Divider } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Palette, TableChart } from "@material-ui/icons";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import PeopleIcon from "@material-ui/icons/People";
import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import { Environment } from "src/environment";
import { StoreState } from "../model/storeState";

export interface Props {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    menuItem: {
      color: theme.palette.primary.contrastText,
    },
    logoContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    logo: {
      height: 45,
      borderRadius: 3,
    },
    questions: { margin: theme.spacing("auto", 1, 2, 1), textAlign: "center" },
  })
);

function SideMenu({ loggedInUser }: Props & PropsFromRedux) {
  const classes = useStyles();

  const items = [
    {
      name: "Contests",
      icon: <TableChart />,
      path: "/contests",
      condition: loggedInUser !== undefined,
    },
    {
      name: "Colors",
      icon: <Palette />,
      path: "/colors",
      condition: loggedInUser !== undefined,
      divider: true,
    },
    {
      name: "Organizers",
      icon: <PeopleIcon />,
      path: "/organizers",
      condition: loggedInUser !== undefined,
    },
    {
      name: "Series",
      icon: <LibraryBooksIcon />,
      path: "/series",
      condition: loggedInUser !== undefined,
    },
  ];

  return (
    <>
      <div className={classes.toolbar}>
        <div className={classes.logoContainer}>
          <img alt="" className={classes.logo} src="/logo-square.png" />
        </div>
      </div>
      <Divider />
      <List>
        {items
          .filter(({ condition }) => condition ?? true)
          .map(({ name, icon, path, divider }) => {
            return (
              <React.Fragment key={path}>
                <ListItem
                  button
                  component={Link}
                  to={path}
                  className={classes.menuItem}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={name} />
                </ListItem>
                {divider && <Divider />}
              </React.Fragment>
            );
          })}
      </List>

      <div className={classes.questions}>
        <p>Questions, requests or just want to chat?</p>
        <p>
          Please{" "}
          <a target={"_NEW"} href={"https://www.facebook.com/CLMB.live"}>
            <u>click here</u>
          </a>{" "}
          to visit us on Facebook.
        </p>
        <Chip
          label={`v.${Environment.projectVersion}`}
          color="primary"
          size="small"
        />
      </div>
    </>
  );
}

const mapStateToProps = (state: StoreState, props: Props) => ({
  loggedInUser: state.loggedInUser,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SideMenu);
