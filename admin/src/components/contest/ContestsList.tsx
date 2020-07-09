import React, { useEffect, useState } from "react";
import { Contest } from "../../model/contest";
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
import { connect, Dispatch } from "react-redux";
import { loadContests } from "../../actions/asyncActions";
import { setTitle } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import {
  getLocationMap,
  getOrganizerMap,
  getSeriesMap,
} from "../../selectors/selector";
import { Organizer } from "../../model/organizer";
import { CompLocation } from "../../model/compLocation";
import { Series } from "src/model/series";
import moment from "moment";
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
  contests?: Contest[];
  organizerMap: Map<number, Organizer>;
  locationMap: Map<number, CompLocation>;
  seriesMap: Map<number, Series>;
  loadContests?: () => Promise<void>;
  setTitle?: (title: string) => void;
}

const ContestsList = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    props.setTitle!("Contests");
  }, []);

  useEffect(() => {
    if (props.contests == undefined) {
      props.loadContests?.();
    }
  }, [props.contests]);

  const getLocationName = (id?: number) => {
    if (id) {
      return props.locationMap.get(id)?.name;
    } else {
      return undefined;
    }
  };

  const getSeriesName = (id?: number) => {
    if (id) {
      return props.seriesMap.get(id)?.name;
    } else {
      return undefined;
    }
  };

  const refreshContests = () => {
    setRefreshing(true);
    props.loadContests?.().finally(() => setRefreshing(false));
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
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Series</TableCell>
              <TableCell>Start time</TableCell>
              <TableCell>End time</TableCell>
              <TableCell className={"icon-cell"}>
                <IconButton
                  color="inherit"
                  aria-label="Menu"
                  title="Add"
                  onClick={() => props.history.push("/contests/new")}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  aria-label="Menu"
                  title="Refresh"
                  onClick={refreshContests}
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
            {props.contests?.map((contest) => (
              <TableRow
                key={contest.id}
                style={{ cursor: "pointer" }}
                hover
                onClick={() => props.history.push("/contests/" + contest.id)}
              >
                <TableCell component="th" scope="row">
                  {contest.name}
                </TableCell>
                <TableCell>{getLocationName(contest.locationId)}</TableCell>
                <TableCell>{getSeriesName(contest.seriesId)}</TableCell>
                <TableCell>
                  {contest.timeBegin
                    ? moment(contest.timeBegin).format("YYYY-MM-DD HH:mm")
                    : undefined}
                </TableCell>
                <TableCell>
                  {contest.timeEnd
                    ? moment(contest.timeEnd).format("YYYY-MM-DD HH:mm")
                    : undefined}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {(props.contests?.length ?? 0) === 0 && (
          <div className={"emptyText"}>
            <div>
              Create your first contest by clicking the plus button above.
            </div>
          </div>
        )}
      </div>
    </Paper>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    contests: state.contests,
    organizerMap: getOrganizerMap(state),
    locationMap: getLocationMap(state),
    seriesMap: getSeriesMap(state),
  };
}

const mapDispatchToProps = {
  loadContests,
  setTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(ContestsList)));
