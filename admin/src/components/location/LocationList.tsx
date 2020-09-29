import { Button, TableCell } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import { OrderedMap } from "immutable";
import React, { useState } from "react";
import { connect } from "react-redux";
import { getSelectedOrganizer } from "src/selectors/selector";
import { setTitle } from "../../actions/actions";
import { reloadLocations } from "../../actions/asyncActions";
import { CompLocation } from "../../model/compLocation";
import { Organizer } from "../../model/organizer";
import { StoreState } from "../../model/storeState";
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import LocationEdit from "./LocationEdit";
import LocationView from "./LocationView";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

interface Props {
  locations?: OrderedMap<number, CompLocation>;
  selectedOrganizer?: Organizer;

  loadLocation?: () => Promise<void>;
  setTitle?: (title: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emptyText: { padding: theme.spacing(2) },
  })
);

const breakpoints = new Map<number, string>().set(1, "smDown").set(2, "smDown");

const LocationList = (props: Props) => {
  React.useEffect(() => {
    props.setTitle?.("Location");
  }, []);

  React.useEffect(() => {
    if (props.locations == undefined) {
      refreshLocation();
    }
  }, [props.locations]);

  const classes = useStyles();

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const theme = useTheme();

  const onCreateDone = () => {
    setShowCreate(false);
  };

  const refreshLocation = () => {
    setRefreshing(true);
    props.loadLocation?.().finally(() => setRefreshing(false));
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
      onClick={refreshLocation}
      startIcon={<RefreshIcon />}
      loading={refreshing}
    >
      Refresh
    </ProgressButton>,
  ];

  const headings = [
    <TableCell>Name</TableCell>,
    <TableCell>Latitude</TableCell>,
    <TableCell>Longitude</TableCell>,
  ];

  return (
    <ContentLayout buttons={buttons}>
      <Table>
        <ResponsiveTableHead cells={headings} breakpoints={breakpoints} />
        <TableBody>
          {showCreate && (
            <TableRow selected>
              <TableCell padding="none" colSpan={4}>
                <div style={{ padding: theme.spacing(0, 2) }}>
                  <LocationEdit
                    onDone={onCreateDone}
                    editable
                    cancellable
                    location={{
                      name: "",
                      organizerId: props.selectedOrganizer?.id,
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          )}

          {props.locations?.toArray()?.map((location: CompLocation) => (
            <LocationView
              key={location.id!}
              location={location}
              breakpoints={breakpoints}
            />
          ))}
        </TableBody>
      </Table>
      {!showCreate && props.locations?.size === 0 && (
        <div className={classes.emptyText}>
          Use the plus button to create your first location.
        </div>
      )}
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
  loadLocation: reloadLocations,
  setTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationList);
