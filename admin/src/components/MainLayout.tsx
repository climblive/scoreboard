import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { StoreState } from "../model/storeState";
import ColorList from "./color/ColorList";
import ContestInfo from "./contest/ContestInfo";
import ContestList from "./contest/ContestList";
import LocationList from "./location/LocationList";
import NotFound from "./NotFound";
import OrganizerList from "./organizer/OrganizerList";
import SeriesList from "./series/SeriesList";
import SideMenu from "./SideMenu";
import TopMenu from "./TopMenu";
import { RouteComponentProps } from "react-router";

const drawerWidth = 180;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
      backgroundColor: theme.palette.primary.dark,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: theme.palette.primary.light,
    },
    content: {
      padding: theme.spacing(2),
      overflow: "hidden",
      width: "100%",
    },
  })
);

interface Props {
  isLoggedIn: boolean;
  title: string;
}

const MainLayout = (props: Props & RouteComponentProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <TopMenu />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <SideMenu />
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <SideMenu />
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.isLoggedIn && (
          <Switch>
            <Route path="(/|/contests)" exact component={ContestList} />
            <Route
              path="/contests/:contestId"
              render={(props) => {
                let contestId: number | undefined = undefined;
                if (
                  props.match.params.contestId !== undefined &&
                  props.match.params.contestId !== "new"
                ) {
                  contestId = parseInt(props.match.params.contestId);
                }
                return <ContestInfo {...props} contestId={contestId} />;
              }}
            />
            <Route path="/colors" exact component={ColorList} />
            <Route path="/series" exact component={SeriesList} />
            <Route path="/organizers" exact component={OrganizerList} />
            <Route path="/locations" exact component={LocationList} />
            <Route path="/" component={NotFound} />
          </Switch>
        )}
      </main>
    </div>
  );
};

export function mapStateToProps(state: StoreState, props: any): Props {
  return {
    title: state.title,
    isLoggedIn: state.loggedInUser !== undefined,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
