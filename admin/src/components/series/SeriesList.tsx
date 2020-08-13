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
import { reloadSeries } from "../../actions/asyncActions";
import { setTitle } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { Series } from "../../model/series";
import SeriesListItem from "./SeriesListItem";
import { Organizer } from "src/model/organizer";
import RefreshIcon from "@material-ui/icons/Refresh";
import { getSelectedOrganizer } from "src/selectors/selector";
import { OrderedMap } from "immutable";

interface Props {
  series?: OrderedMap<number, Series>;
  selectedOrganizer?: Organizer;

  loadSeries?: () => Promise<void>;
  setTitle?: (title: string) => void;
}

const SeriesList = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
  React.useEffect(() => {
    props.setTitle?.("Series");
  }, []);

  React.useEffect(() => {
    if (props.series == undefined) {
      refreshSeries();
    }
  }, [props.series]);

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onCreateDone = () => {
    setShowCreate(false);
  };

  const refreshSeries = () => {
    setRefreshing(true);
    props.loadSeries?.().finally(() => setRefreshing(false));
  };

  return (
    <>
      <Table className={props.classes?.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
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
                onClick={refreshSeries}
              >
                {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showCreate && (
            <SeriesListItem
              onCreateDone={onCreateDone}
              series={{ organizerId: props.selectedOrganizer?.id!, name: "" }}
            />
          )}
          {props.series?.toArray()?.map((s: Series) => (
            <SeriesListItem key={s.id!} series={s} />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    series: state.series,
    selectedOrganizer: getSelectedOrganizer(state),
  };
}

const mapDispatchToProps = {
  loadSeries: reloadSeries,
  setTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SeriesList));
