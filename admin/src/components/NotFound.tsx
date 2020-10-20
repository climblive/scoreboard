import Alert from "@material-ui/lab/Alert";
import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { setTitle } from "../actions/actions";

interface Props {}

const NotFound = (props: Props & PropsFromRedux) => {
  const { setTitle } = props;

  React.useEffect(() => {
    setTitle("404");
  }, [setTitle]);
  return <Alert severity="error">The requested page does not exist.</Alert>;
};

const mapDispatchToProps = {
  setTitle,
};

const connector = connect(undefined, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(NotFound);
