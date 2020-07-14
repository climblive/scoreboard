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
import { reloadSeries } from "../../actions/asyncActions";
import { setTitle } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { Series } from "../../model/series";
import SeriesListItem from "./SeriesListItem";
import { Organizer } from "src/model/organizer";
import RefreshIcon from "@material-ui/icons/Refresh";
import { getSelectedOrganizer } from "src/selectors/selector";

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
  series?: Series[];
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
    <Paper
      className={props.classes?.root}
      style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
    >
      <div style={{ flexBasis: 0, flexGrow: 1, overflowY: "auto" }}>
        <Table className={props.classes?.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "100%" }}>Name</TableCell>
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
                  onClick={refreshSeries}
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
              <SeriesListItem
                onCreateDone={onCreateDone}
                series={{ organizerId: props.selectedOrganizer?.id!, name: "" }}
              />
            )}
            {props.series?.map((s) => (
              <SeriesListItem key={s.id!} series={s} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
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
)(withStyles(styles)(withRouter(SeriesList)));
