import {
  Button,
  CssBaseline,
  Grid,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { ReactElement } from "react";
import { StoreState } from "../model/storeState";
import { connect, ConnectedProps } from "react-redux";

interface Props {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "fixed",
      display: "flex",
      width: "100%",
      height: "100%",
      margin: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: theme.palette.primary.light,
    },
    box: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 4,
      width: 300,
      display: "inline-block",
      padding: theme.spacing(4),
    },
    logoContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    logo: {
      width: 120,
      borderRadius: 5,
    },
    buttons: {
      "& > *": {
        margin: theme.spacing(1, 0),
      },
    },
    title: {
      textAlign: "center",
      margin: theme.spacing(2, 0, 4, 0),
    },
  })
);

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

function WelcomeView(props: Props & PropsFromRedux): ReactElement {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item>
          <div className={classes.box}>
            <div className={classes.logoContainer}>
              <img alt="" className={classes.logo} src="/logo-square.png" />
            </div>
            <Typography variant="h5" className={classes.title}>
              ClimbLive Admin
            </Typography>
            {props.loggingIn ? (
              <LinearProgress />
            ) : (
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={redirectToLogin}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={redirectToSignup}
                >
                  Signup
                </Button>
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

const mapStateToProps = (state: StoreState, props: Props) => ({
  loggingIn: state.loggingIn,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(WelcomeView);
