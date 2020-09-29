import {
  Button,
  Hidden,
  StyledComponentProps,
  TableCell,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import { OrderedMap } from "immutable";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { setTitle } from "../../actions/actions";
import { reloadContests } from "../../actions/asyncActions";
import { Contest } from "../../model/contest";
import { StoreState } from "../../model/storeState";
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";
import ContestLineItemView from "./ContestLineItemView";

interface Props {
  contests?: OrderedMap<number, Contest>;
  loadContests?: () => Promise<void>;
  setTitle?: (title: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emptyText: { padding: theme.spacing(2) },
  })
);

const ContestList = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const classes = useStyles();

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
        <div className={classes.emptyText}>
          Use the plus button to create your first contest.
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
