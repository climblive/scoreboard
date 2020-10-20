import MomentUtils from "@date-io/moment";
import { Snackbar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { Close } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import * as qs from "qs";
import * as React from "react";
import { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { clearErrorMessage } from "./actions/actions";
import { login } from "./actions/asyncActions";
import MainLayout from "./components/MainLayout";
import { StoreState } from "./model/storeState";

export interface Props {}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#5f524a",
    },
    secondary: {
      main: "#eb0708",
    },
  },
  overrides: {
    MuiTableRow: {
      root: {
        "&:last-child td": {
          borderBottom: 0,
        },
      },
    },
  },
});

const App = (props: Props & PropsFromRedux & RouteComponentProps) => {
  const { login } = props;

  const handleClose = (event: any, reason?: any) => {
    props.clearErrorMessage();
  };

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

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <MuiThemeProvider theme={theme}>
        <MainLayout />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={props.errorMessage !== undefined}
          autoHideDuration={6000}
          onClose={handleClose}
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
        >
          <Alert onClose={handleClose} severity="error">
            {props.errorMessage}
          </Alert>
        </Snackbar>
      </MuiThemeProvider>
    </MuiPickersUtilsProvider>
  );
};

const mapStateToProps = (state: StoreState, props: Props) => ({
  errorMessage: state.errorMessage,
});

const mapDispatchToProps = {
  login,
  clearErrorMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(App));
