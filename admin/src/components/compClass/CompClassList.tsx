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
import { loadCompClasses } from "../../actions/asyncActions";
import { setTitle } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { CompClass } from "../../model/compClass";
import CompClassListItem from "./CompClassListItem";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Organizer } from "src/model/organizer";
import moment from "moment";
import { getSelectedOrganizer } from "../../selectors/selector";
import { OrderedMap } from "immutable";

interface Props {
  contestId?: number;
  compClasses?: OrderedMap<number, CompClass>;
  selectedOrganizer?: Organizer;

  loadCompClasses?: (contestId: number) => Promise<void>;
  setTitle?: (title: string) => void;
}

const CompClassList = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onCreateDone = () => {
    setShowCreate(false);
  };

  const refreshCompClasses = () => {
    setRefreshing(true);
    props
      .loadCompClasses?.(props.contestId!)
      .finally(() => setRefreshing(false));
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Start time</TableCell>
            <TableCell>End time</TableCell>
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
                onClick={refreshCompClasses}
              >
                {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showCreate && (
            <CompClassListItem
              onCreateDone={onCreateDone}
              compClass={{
                name: "",
                description: "",
                contestId: props.contestId!,
                timeBegin: moment().format("YYYY-MM-DDTHH:mm:ssZ"),
                timeEnd: moment().format("YYYY-MM-DDTHH:mm:ssZ"),
              }}
            />
          )}
          {props.compClasses?.toArray()?.map((compClass: CompClass) => (
            <CompClassListItem key={compClass.id!} compClass={compClass} />
          ))}
        </TableBody>
      </Table>
      {(props.compClasses?.size ?? 0) == 0 && (
        <div className={"emptyText"}>
          <div>You have no contest classes.</div>
          <div>
            Please create at least one contest class by clicking the plus button
            above.
          </div>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    selectedOrganizer: getSelectedOrganizer(state),
    compClasses: state.compClassesByContest.get(props.contestId),
  };
}

const mapDispatchToProps = {
  loadCompClasses,
  setTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CompClassList));
