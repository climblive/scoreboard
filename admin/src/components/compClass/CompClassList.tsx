import { Paper, TableCell } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import moment from "moment";
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { loadCompClasses } from "../../actions/asyncActions";
import { CompClass } from "../../model/compClass";
import { StoreState } from "../../model/storeState";
import { getSelectedOrganizer } from "../../selectors/selector";
import ProgressIconButton from "../ProgressIconButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import ResponsiveTableSpanningRow from "../ResponsiveTableSpanningRow";
import CompClassEdit from "./CompClassEdit";
import CompClassView from "./CompClassView";

interface Props {
  contestId: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      "& > *": {
        padding: theme.spacing(0, 0, 0, 1),
      },
    },
    emptyText: { padding: theme.spacing(2) },
  })
);

const breakpoints = new Map<number, string>().set(1, "smDown").set(2, "smDown");

const CompClassList = (props: Props & PropsFromRedux) => {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const classes = useStyles();

  const onCreateDone = () => {
    setShowCreate(false);
  };

  const refreshCompClasses = () => {
    setRefreshing(true);
    props.loadCompClasses(props.contestId).finally(() => setRefreshing(false));
  };

  const headings = [
    <TableCell>Name</TableCell>,
    <TableCell>Start time</TableCell>,
    <TableCell>End time</TableCell>,
  ];

  const toolbar = (
    <div className={classes.toolbar}>
      <IconButton
        color="inherit"
        aria-label="Menu"
        title="Add"
        disabled={showCreate}
        onClick={() => setShowCreate(true)}
      >
        <AddIcon />
      </IconButton>
      <ProgressIconButton
        color="inherit"
        aria-label="Menu"
        title="Refresh"
        onClick={refreshCompClasses}
        loading={refreshing}
      >
        <RefreshIcon />
      </ProgressIconButton>
    </div>
  );

  return (
    <Paper>
      <Table>
        <ResponsiveTableHead
          cells={headings}
          breakpoints={breakpoints}
          toolbar={toolbar}
        />
        <TableBody>
          {showCreate && (
            <ResponsiveTableSpanningRow colSpan={4}>
              <CompClassEdit
                cancellable
                onDone={onCreateDone}
                compClass={{
                  name: "",
                  description: "",
                  contestId: props.contestId,
                  timeBegin: moment()
                    .add(2, "hour")
                    .startOf("hour")
                    .format("YYYY-MM-DDTHH:mm:ssZ"),
                  timeEnd: moment()
                    .add(5, "hour")
                    .startOf("hour")
                    .format("YYYY-MM-DDTHH:mm:ssZ"),
                }}
              />
            </ResponsiveTableSpanningRow>
          )}
          {props.compClasses?.toArray()?.map((compClass: CompClass) => (
            <CompClassView
              key={compClass.id!}
              compClass={compClass}
              breakpoints={breakpoints}
            />
          ))}
        </TableBody>
      </Table>
      {!showCreate && (props.compClasses?.size ?? 0) === 0 && (
        <div className={classes.emptyText}>
          Use the plus button to setup your first competition class.
        </div>
      )}
    </Paper>
  );
};

const mapStateToProps = (state: StoreState, props: Props) => ({
  selectedOrganizer: getSelectedOrganizer(state),
  compClasses: state.compClassesByContest.get(props.contestId),
});

const mapDispatchToProps = {
  loadCompClasses,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CompClassList);
