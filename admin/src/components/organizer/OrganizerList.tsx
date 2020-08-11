import React, { useState } from "react";
import { StyledComponentProps, TableCell, Theme } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import CircularProgress from "@material-ui/core/CircularProgress";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import { reloadOrganizers } from "../../actions/asyncActions";
import { setTitle } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { Organizer } from "../../model/organizer";
import OrganizerListItem from "./OrganizerListItem";
import RefreshIcon from "@material-ui/icons/Refresh";
import { getSelectedOrganizer } from "src/selectors/selector";

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
    <>
      <Table className={props.classes?.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Homepage</TableCell>
            <TableCell align="right" className={"icon-cell"}>
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
                {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
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
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    organizers: state.organizers,
    selectedOrganizer: getSelectedOrganizer(state),
  };
}

const mapDispatchToProps = {
  loadOrganizers: reloadOrganizers,
  setTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OrganizerList));
