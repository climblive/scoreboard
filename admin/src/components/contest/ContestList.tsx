import React, { useEffect, useState } from "react";
import { Contest } from "../../model/contest";
import { StyledComponentProps, TableCell, Theme } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import CircularProgress from "@material-ui/core/CircularProgress";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import { reloadContests } from "../../actions/asyncActions";
import { setTitle } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import ContestLineItemView from "./ContestLineItemView";
import { OrderedMap } from "immutable";

interface Props {
  contests?: OrderedMap<number, Contest>;
  loadContests?: () => Promise<void>;
  setTitle?: (title: string) => void;
}

const ContestList = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    props.setTitle!("Contests");
  }, []);

  useEffect(() => {
    if (props.contests == undefined) {
      refreshContests();
    }
  }, [props.contests]);

  const refreshContests = () => {
    setRefreshing(true);
    props.loadContests?.().finally(() => setRefreshing(false));
  };

  return (
    <>
      <Table className={props.classes?.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
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
                {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.contests?.toArray()?.map((contest: Contest) => (
            <ContestLineItemView key={contest.id} contest={contest} />
          ))}
        </TableBody>
      </Table>
      {(props.contests?.size ?? 0) === 0 && (
        <div className={"emptyText"}>
          <div>
            Create your first contest by clicking the plus button above.
          </div>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    contests: state.contests,
  };
}

const mapDispatchToProps = {
  loadContests: reloadContests,
  setTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ContestList));
