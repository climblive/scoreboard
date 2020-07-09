import React, { useState } from "react";
import { StyledComponentProps, TableCell, Theme } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import createStyles from "@material-ui/core/styles/createStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import { loadOrganizers } from "../../actions/asyncActions";
import { setTitle } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { Organizer } from "../../model/organizer";
import OrganizerListItem from "./OrganizerListItem";
import RefreshIcon from "@material-ui/icons/Refresh";

const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      margin: 10,
    },
    table: {
      minWidth: 700,
    },
  });

interface Props {
  organizers?: Organizer[];
  selectedOrganizer?: Organizer;

  loadOrganizers?: () => Promise<void>;
  setTitle?: (title: string) => void;
}

const OrganizerList = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
  React.useEffect(() => {
    props.setTitle?.("Organizers");
  }, []);

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onCreateDone = () => {
    setShowCreate(false);
  };

  const refreshOrganizers = () => {
    setRefreshing(true);
    props.loadOrganizers?.().finally(() => setRefreshing(false));
  };

  return (
    <Paper
      className={props.classes?.root}
      style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
    >
      <div style={{ flexBasis: 0, flexGrow: 1, overflowY: "auto" }}>
        <Table className={props.classes?.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "50%" }}>Name</TableCell>
              <TableCell style={{ width: "50%" }}>Homepage</TableCell>
              <TableCell className={"icon-cell"} style={{ minWidth: 144 }}>
                <IconButton
                  color="inherit"
                  aria-label="Menu"
                  title="Add"
                  disabled={showCreate}
                  onClick={() => setShowCreate(true)}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  aria-label="Menu"
                  title="Refresh"
                  onClick={refreshOrganizers}
                >
                  {refreshing ? (
                    <CircularProgress size={24} />
                  ) : (
                    <RefreshIcon />
                  )}
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showCreate && (
              <OrganizerListItem
                onCreateDone={onCreateDone}
                organizer={{ name: "" }}
              />
            )}
            {props.organizers?.map((organizer) => (
              <OrganizerListItem key={organizer.id!} organizer={organizer} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    organizers: state.organizers,
    selectedOrganizer: state.selectedOrganizer,
  };
}

const mapDispatchToProps = {
  loadOrganizers,
  setTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(OrganizerList)));
