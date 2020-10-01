import { Divider } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Palette, TableChart } from "@material-ui/icons";
import ExploreIcon from "@material-ui/icons/Explore";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import PeopleIcon from "@material-ui/icons/People";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Environment } from "src/environment";
import { StoreState } from "../model/storeState";
import { User } from "../model/user";

export interface Props {
  loggedInUser?: User;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    menuItem: {
      color: theme.palette.primary.contrastText,
    },
  })
);

function SideMenu({ loggedInUser }: Props) {
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
      name: "Locations",
      icon: <ExploreIcon />,
      path: "/locations",
      condition: loggedInUser !== undefined,
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img
            alt=""
            style={{
              width: 65,
            }}
            src="/clmb_MainLogo_NoShadow.png"
          />
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

      <div style={{ margin: "auto 10px 20px 10px", textAlign: "center" }}>
        <div>Questions, requests or just want to chat?</div>
        <div style={{ marginTop: 5 }}>
          Please{" "}
          <a target={"_NEW"} href={"https://www.facebook.com/CLMB.live"}>
            <u>click here</u>
          </a>{" "}
          to visit us on Facebook
        </div>
        <Chip
          style={{ marginTop: "1rem" }}
          label={`v.${Environment.projectVersion}`}
          color="primary"
          size="small"
        />
      </div>
    </>
  );
}

export function mapStateToProps(state: StoreState, props: any): Props {
  return {
    loggedInUser: state.loggedInUser,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
