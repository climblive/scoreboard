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
import createStyles from "@material-ui/core/styles/createStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import { reloadLocations } from "../../actions/asyncActions";
import { setTitle } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { CompLocation } from "../../model/compLocation";
import LocationListItem from "./LocationListItem";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Organizer } from "src/model/organizer";
import { getSelectedOrganizer } from "src/selectors/selector";
import { OrderedMap } from "immutable";
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";

interface Props {
  locations?: OrderedMap<number, CompLocation>;
  selectedOrganizer?: Organizer;

  loadLocations?: () => Promise<void>;
  setTitle?: (title: string) => void;
}

const LocationList = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
  React.useEffect(() => {
    props.setTitle?.("Locations");
  }, []);

  React.useEffect(() => {
    if (props.locations == undefined) {
      refreshLocations();
    }
  }, [props.locations]);

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onCreateDone = () => {
    setShowCreate(false);
  };

  const refreshLocations = () => {
    setRefreshing(true);
    props.loadLocations?.().finally(() => setRefreshing(false));
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
      onClick={refreshLocations}
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
            <TableCell>Longitude</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {showCreate && (
            <LocationListItem
              onCreateDone={onCreateDone}
              location={{
                name: "",
                organizerId: props.selectedOrganizer?.id!,
              }}
            />
          )}
          {props.locations?.toArray()?.map((location: CompLocation) => (
            <LocationListItem key={location.id!} location={location} />
          ))}
        </TableBody>
      </Table>
    </ContentLayout>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    locations: state.locations,
    selectedOrganizer: getSelectedOrganizer(state),
  };
}

const mapDispatchToProps = {
  loadLocations: reloadLocations,
  setTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LocationList));
