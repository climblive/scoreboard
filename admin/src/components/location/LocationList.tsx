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
import { reloadLocations } from "../../actions/asyncActions";
import { setTitle } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { CompLocation } from "../../model/compLocation";
import LocationListItem from "./LocationListItem";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Organizer } from "src/model/organizer";

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
  locations?: CompLocation[];
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

  return (
    <Paper
      className={props.classes?.root}
      style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
    >
      <div style={{ flexBasis: 0, flexGrow: 1, overflowY: "auto" }}>
        <Table className={props.classes?.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "60%" }}>Name</TableCell>
              <TableCell style={{ width: "20%" }}>Longitude</TableCell>
              <TableCell style={{ width: "20%" }}>Latitude</TableCell>
              <TableCell className={"icon-cell"} style={{ minWidth: 96 }}>
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
                  onClick={refreshLocations}
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
              <LocationListItem
                onCreateDone={onCreateDone}
                location={{
                  name: "",
                  organizerId: props.selectedOrganizer?.id!,
                }}
              />
            )}
            {props.locations?.map((location) => (
              <LocationListItem key={location.id!} location={location} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    locations: state.locations,
    selectedOrganizer: state.selectedOrganizer,
  };
}

const mapDispatchToProps = {
  loadLocations: reloadLocations,
  setTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(LocationList)));
