import MomentUtils from "@date-io/moment";
import { Snackbar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { Close } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import * as React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { clearErrorMessage } from "./actions/actions";
import MainLayout from "./components/MainLayout";
import { StoreState } from "./model/storeState";

export interface Props {
  errorMessage?: string;
  clearErrorMessage?: () => void;
}

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

const App = (props: Props) => {
  const handleClose = (event: any, reason?: any) => {
    props.clearErrorMessage!!();
  };

  return (
    <Router>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <MuiThemeProvider theme={theme}>
          <MainLayout />
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            style={{ bottom: 15 }}
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
    </Router>
  );
};

export function mapStateToProps(state: StoreState, props: any): Props {
  return {
    errorMessage: state.errorMessage,
  };
}

const mapDispatchToProps = {
  clearErrorMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
