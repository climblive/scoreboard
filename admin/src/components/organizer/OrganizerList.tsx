import React, { useState } from "react";
import {
  StyledComponentProps,
  TableCell,
  Theme,
  Button,
} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import { reloadOrganizers } from "../../actions/asyncActions";
import { setTitle } from "../../actions/actions";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { Organizer } from "../../model/organizer";
import OrganizerListItem from "./OrganizerListItem";
import RefreshIcon from "@material-ui/icons/Refresh";
import { getSelectedOrganizer } from "src/selectors/selector";
import { OrderedMap } from "immutable";
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";

interface Props {
  organizers?: OrderedMap<number, Organizer>;
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

  const buttons = [
    <Button
      variant="contained"
      color="secondary"
      size="small"
      disabled={showCreate}
      onClick={() => setShowCreate(true)}
      startIcon={<AddIcon />}
    >
      Add
    </Button>,
    <ProgressButton
      variant="contained"
      color="secondary"
      size="small"
      onClick={refreshOrganizers}
      startIcon={<RefreshIcon />}
      loading={refreshing}
    >
      Refresh
    </ProgressButton>,
  ];

  return (
    <ContentLayout buttons={buttons}>
      <Table className={props.classes?.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Homepage</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {showCreate && (
            <OrganizerListItem
              onCreateDone={onCreateDone}
              organizer={{ name: "" }}
            />
          )}
          {props.organizers?.toArray()?.map((organizer: Organizer) => (
            <OrganizerListItem key={organizer.id!} organizer={organizer} />
          ))}
        </TableBody>
      </Table>
    </ContentLayout>
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
