import * as React from "react";
import { Link } from "react-router-dom";
import { Palette, TableChart } from "@material-ui/icons";
import { Button, StyledComponentProps, Theme } from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { User } from "../model/user";
import { Environment } from "src/environment";
import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from "@material-ui/icons/Explore";
import PeopleIcon from "@material-ui/icons/People";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";

export interface SideMenuCompProps {
  loggedInUser?: User;
}

const styles = ({ spacing }: Theme) =>
  createStyles({
    sideMenu: {
      background: "white",
      width: 150,
      boxShadow: "2px 0px 3px rgba(0,0,0,0.14)",
      zIndex: 2,
      backgroundImage: "url('/sideMenuBackground.jpg')",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom",
      display: "flex",
      flexDirection: "column",
    },
    menuItem: {
      width: "100%",
      display: "flex",
    },
    menuText: {
      flexGrow: 1,
      textAlign: "left",
      marginLeft: spacing(1),
      textDecoration: "none",
    },
  });

function SideMenuComp({
  classes,
  loggedInUser,
}: SideMenuCompProps & StyledComponentProps) {
  return (
    <div className={classes!!.sideMenu}>
      <div style={{ textAlign: "center" }}>
        <img
          style={{ width: 120, marginTop: 20 }}
          src="/clmb_MainLogo_NoShadow.png"
        />
      </div>
      {loggedInUser && (
        <div>
          <Link to="/start">
            <Button className={classes!!.menuItem}>
              <HomeIcon />
              <span className={classes!!.menuText}>Start</span>
            </Button>
          </Link>
          <Link to="/contests">
            <Button className={classes!!.menuItem}>
              <TableChart />
              <span className={classes!!.menuText}>Contests</span>
            </Button>
          </Link>
          <Link to="/colors">
            <Button className={classes!!.menuItem}>
              <Palette />
              <span className={classes!!.menuText}>Colors</span>
            </Button>
          </Link>
          {loggedInUser.admin && (
            <Link to="/locations">
              <Button className={classes!!.menuItem}>
                <ExploreIcon />
                <span className={classes!!.menuText}>Locations</span>
              </Button>
            </Link>
          )}
          <Link to="/organizers">
            <Button className={classes!!.menuItem}>
              <PeopleIcon />
              <span className={classes!!.menuText}>Organizers</span>
            </Button>
          </Link>
          <Link to="/series">
            <Button className={classes!!.menuItem}>
              <LibraryBooksIcon />
              <span className={classes!!.menuText}>Series</span>
            </Button>
          </Link>
        </div>
      )}
      <div style={{ margin: "auto 10px 20px 10px", textAlign: "center" }}>
        <div>Questions, requests or just want to chat?</div>
        <div style={{ marginTop: 5 }}>
          Please{" "}
          <a target={"_NEW"} href={"https://www.facebook.com/CLMB.live"}>
            <u>click here</u>
          </a>{" "}
          to visit us on Facebook
        </div>
        <div>
          <pre>v.{Environment.projectVersion}</pre>
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(SideMenuComp);