import { Button, Hidden, TableCell } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import React, { useCallback, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { setTitle } from "../../actions/actions";
import { reloadContests } from "../../actions/asyncActions";
import { Contest } from "../../model/contest";
import { StoreState } from "../../model/storeState";
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";
import ContestTableRow from "./ContestTableRow";

interface Props {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emptyText: { padding: theme.spacing(2) },
  })
);

const ContestList = (props: Props & PropsFromRedux & RouteComponentProps) => {
  const { setTitle, reloadContests } = props;

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const classes = useStyles();

  useEffect(() => {
    setTitle("Contests");
  }, [setTitle]);

  const refreshContests = useCallback(() => {
    setRefreshing(true);
    reloadContests().finally(() => setRefreshing(false));
  }, [reloadContests]);

  useEffect(() => {
    if (props.contests === undefined) {
      refreshContests();
    }
  }, [props.contests, refreshContests]);

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
      <Table>
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
            <ContestTableRow key={contest.id} contest={contest} />
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

const mapStateToProps = (state: StoreState) => ({
  contests: state.contests,
});

const mapDispatchToProps = {
  reloadContests,
  setTitle,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(ContestList));
