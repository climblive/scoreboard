import * as React from "react";
import { StyledComponentProps, Theme, Typography } from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { StoreState } from "../model/storeState";
import { setTitle } from "../actions/actions";
import Alert from "@material-ui/lab/Alert";

interface Props {
  setTitle?: (title: string) => void;
}

const NotFound = (props: Props) => {
  React.useEffect(() => {
    props.setTitle?.("404");
  }, []);
  return <Alert severity="error">The requested page does not exist.</Alert>;
};

export function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {
  setTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
