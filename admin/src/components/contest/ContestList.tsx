import React, { useEffect, useState } from "react";
import { Contest } from "../../model/contest";
import {
  StyledComponentProps,
  TableCell,
  Theme,
  Hidden,
  Button,
} from "@material-ui/core";
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
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";

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

  const buttons = [
    <Button
      variant="contained"
      color="secondary"
      size="small"
      onClick={() => props.history.push("/contests/new")}
      startIcon={<AddIcon />}
    >
      Add
    </Button>,
    <ProgressButton
      variant="contained"
      color="secondary"
      size="small"
      onClick={refreshContests}
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
            <Hidden smDown>
              <TableCell>End time</TableCell>
              <TableCell>Start time</TableCell>
              <TableCell>Series</TableCell>
            </Hidden>
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
    </ContentLayout>
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
