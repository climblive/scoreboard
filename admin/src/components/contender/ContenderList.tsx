import React, { useState, useMemo } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { InputLabel, TableCell, Hidden } from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import SaveIcon from "@material-ui/icons/SaveAlt";
import ClearIcon from "@material-ui/icons/Clear";
import RefreshIcon from "@material-ui/icons/Refresh";
import { ContenderData } from "../../model/contenderData";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { CompClass } from "../../model/compClass";
import { Contest } from "../../model/contest";
import { Problem } from "../../model/problem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { SortBy } from "../../constants/sortBy";
import { calculateContenderScoringInfo } from "../../selectors/selector";
import { connect } from "react-redux";
import {
  loadContenders,
  resetContenders,
  createContenders,
  loadTicks,
} from "../../actions/asyncActions";
import { setErrorMessage } from "../../actions/actions";
import { StoreState } from "src/model/storeState";
import { Api } from "src/utils/Api";
import { Tick } from "src/model/tick";
import ContenderView from "./ContenderView";
import { ContenderScoringInfo } from "src/model/contenderScoringInfo";
import { OrderedMap } from "immutable";

interface Props {
  contestId?: number;
  contest?: Contest;
  finalEnabled?: boolean;
  contenders?: OrderedMap<number, ContenderData>;
  compClasses?: OrderedMap<number, CompClass>;
  problems?: OrderedMap<number, Problem>;
  ticks?: OrderedMap<number, Tick>;

  loadContenders?: (contestId: number) => Promise<void>;
  resetContenders?: (contestId: number) => Promise<void>;
  createContenders?: (contestId: number, nContenders: number) => Promise<void>;
  setErrorMessage?: (message: string) => void;
  loadTicks?: (contestId: number) => Promise<void>;
}

const ContenderList = (props: Props) => {
  const [numberOfNewContenders, setNumberOfNewContenders] = useState<string>();
  const [showAddContendersPopup, setShowAddContendersPopup] = useState<boolean>(
    false
  );
  const [showResetConfirmationPopup, setShowResetConfirmationPopup] = useState<
    boolean
  >(false);

  const [contenderFilterCompClassId, setContenderFilterCompClassId] = useState<
    number | undefined
  >(undefined);
  const [contenderSortBy, setContenderSortBy] = useState<string>(
    SortBy.BY_NAME
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const scoringByContender = useMemo(() => {
    if (props.contest == undefined) {
      return undefined;
    }

    return calculateContenderScoringInfo(
      props.contenders?.toArray() ?? [],
      props.ticks?.toArray() ?? [],
      props.problems?.toArray() ?? [],
      props.contest
    );
  }, [props.contenders, props.ticks, props.problems, props.contest]);

  const contendersSortedAndFiltered = useMemo(() => {
    let contenders = props.contenders?.toArray();

    if (contenderFilterCompClassId != undefined) {
      contenders = contenders?.filter(
        (contender: ContenderData) =>
          contender.compClassId === contenderFilterCompClassId
      );
    }

    const getScore = (
      contender: ContenderData
    ): ContenderScoringInfo | undefined => {
      return contender.id ? scoringByContender?.get(contender.id) : undefined;
    };

    if (contenderSortBy == SortBy.BY_NUMBER_OF_TICKS) {
      contenders?.sort(
        (a, b) =>
          (getScore(b)?.ticks?.length ?? 0) - (getScore(a)?.ticks?.length ?? 0)
      );
    } else if (contenderSortBy == SortBy.BY_TOTAL_POINTS) {
      contenders?.sort(
        (a, b) =>
          (getScore(b)?.totalScore ?? 0) - (getScore(a)?.totalScore ?? 0)
      );
    } else if (contenderSortBy == SortBy.BY_QUALIFYING_POINTS) {
      contenders?.sort(
        (a, b) =>
          (getScore(b)?.qualifyingScore ?? 0) -
          (getScore(a)?.qualifyingScore ?? 0)
      );
    } else {
      contenders?.sort((a, b) => {
        let aName = a.name ? a.name.toLocaleUpperCase() : "ööööööööööö";
        let bName = b.name ? b.name.toLocaleUpperCase() : "ööööööööööö";
        return aName.localeCompare(bName);
      });
    }

    return contenders;
  }, [props.contenders, contenderFilterCompClassId, contenderSortBy]);

  const MAX_CONTENDER_COUNT = 500;

  const refreshContenders = () => {
    setRefreshing(true);
    props
      .loadContenders?.(props.contestId!)
      .finally(() => setRefreshing(false));
  };

  const startAddContenders = () => {
    setShowAddContendersPopup(true);
  };

  const closePopups = () => {
    setShowAddContendersPopup(false);
    setShowResetConfirmationPopup(false);
  };

  const onNewContendersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfNewContenders(e.target.value);
  };

  const addContendersConfirmed = () => {
    let number: number = 0;
    if (numberOfNewContenders != undefined) {
      number = parseInt(numberOfNewContenders);
    }

    if (number === Number.NaN || number === 0) {
      return;
    }

    setRefreshing(true);
    props
      .createContenders?.(props.contestId!, number)
      .finally(() => setRefreshing(false));
    setShowAddContendersPopup(false);
  };

  const resetAllContenders = () => {
    setShowResetConfirmationPopup(true);
  };

  const resetContendersConfirmed = (confirmed: boolean) => {
    setShowResetConfirmationPopup(false);
    if (confirmed) {
      props.resetContenders?.(props.contestId!);
    }
  };

  const onContenderFilterCompClassChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const filterCompClass =
      e.target.value == "All"
        ? undefined
        : props.compClasses?.get(parseInt(e.target.value));
    setContenderFilterCompClassId(filterCompClass?.id);
  };

  function exportResults(): any {
    Api.exportContest(props.contestId!)
      .then((response) => {
        saveAs(response, "contest.xls");
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  }

  return (
    <>
      <div style={{ display: "flex", marginTop: 14, alignItems: "center" }}>
        {(props.compClasses?.size ?? 0) > 0 && (
          <FormControl style={{ minWidth: 200, marginRight: 10 }}>
            <InputLabel shrink htmlFor="compClass-select">
              Contest class
            </InputLabel>
            <Select
              id="compClass-select"
              value={
                contenderFilterCompClassId == undefined
                  ? "All"
                  : contenderFilterCompClassId
              }
              onChange={onContenderFilterCompClassChange}
            >
              <MenuItem value="All">
                <em>All</em>
              </MenuItem>
              {props.compClasses?.toArray()?.map((compClass: CompClass) => (
                <MenuItem key={compClass.id} value={compClass.id}>
                  {compClass.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Refresh"
          disabled={refreshing}
          onClick={refreshContenders}
        >
          {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Add contenders"
          onClick={startAddContenders}
        >
          <AddIcon />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Export results"
          onClick={exportResults}
        >
          <SaveIcon />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Reset all contenders"
          onClick={resetAllContenders}
        >
          <ClearIcon />
        </IconButton>
      </div>
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                style={{ width: "100%", cursor: "pointer" }}
                onClick={() => setContenderSortBy(SortBy.BY_NAME)}
              >
                Name
              </TableCell>
              <TableCell style={{ minWidth: 110 }}>Class</TableCell>
              <Hidden smDown>
                <TableCell
                  style={{ minWidth: 110, cursor: "pointer" }}
                  onClick={() => setContenderSortBy(SortBy.BY_TOTAL_POINTS)}
                >
                  Total score
                </TableCell>
                {props.finalEnabled && (
                  <>
                    <TableCell
                      style={{ minWidth: 110, cursor: "pointer" }}
                      onClick={() =>
                        setContenderSortBy(SortBy.BY_QUALIFYING_POINTS)
                      }
                    >
                      Qualifying score
                    </TableCell>
                    <TableCell style={{ minWidth: 100 }}></TableCell>
                  </>
                )}
                <TableCell
                  style={{ minWidth: 110, cursor: "pointer" }}
                  onClick={() => setContenderSortBy(SortBy.BY_NUMBER_OF_TICKS)}
                >
                  # Ticks
                </TableCell>
              </Hidden>
              <TableCell style={{ minWidth: 110 }}>Regcode</TableCell>
              <Hidden smDown>
                <TableCell />
              </Hidden>
            </TableRow>
          </TableHead>
          <TableBody>
            {contendersSortedAndFiltered?.map((contender) => (
              <ContenderView
                key={contender.id}
                contender={contender}
                scoring={scoringByContender?.get(contender.id!)}
                compClasses={props.compClasses}
                problems={props.problems}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog
        open={showAddContendersPopup}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="addcontender-dialog-title"
      >
        <DialogTitle id="addcontender-dialog-title">
          Create contenders
        </DialogTitle>
        <DialogContent>
          <div>
            Before a contest starts, you have to create activation codes enough
            for all contenders.
          </div>
          <div style={{ marginTop: 5 }}>
            Currently you have {props.contenders?.size ?? 0} registration codes.
          </div>
          <div style={{ marginTop: 5, marginBottom: 20 }}>
            You can create a maximum of {MAX_CONTENDER_COUNT} activation codes
            per contest.
          </div>
          <TextField
            style={{ width: 250 }}
            label="Number of contenders to create"
            value={numberOfNewContenders}
            onChange={onNewContendersChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopups} color="primary">
            Cancel
          </Button>
          <Button onClick={addContendersConfirmed} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog
        open={showResetConfirmationPopup}
        title="Reset all contenders"
        message="Do you really want to reset all contenders? All ticks and data will be lost."
        onClose={resetContendersConfirmed}
      />
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    contenders: state.contendersByContest.get(props.contestId),
    compClasses: state.compClassesByContest.get(props.contestId),
    problems: state.problemsByContest.get(props.contestId),
    ticks: state.ticksByContest.get(props.contestId),
    contest: state.contests?.get(props.contestId),
  };
}

const mapDispatchToProps = {
  loadContenders,
  resetContenders,
  createContenders,
  loadTicks,
  setErrorMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContenderList);
