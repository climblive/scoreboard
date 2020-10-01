import Alert from "@material-ui/lab/Alert";
import * as React from "react";
import { connect } from "react-redux";
import { setTitle } from "../actions/actions";
import { StoreState } from "../model/storeState";

interface Props {
  setTitle?: (title: string) => void;
}

const NotFound = (props: Props) => {
  React.useEffect(() => {
    props.setTitle?.("404");
  }, [props.setTitle]);
  return <Alert severity="error">The requested page does not exist.</Alert>;
};

export function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {
  setTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
