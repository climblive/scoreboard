import { Grid, InputLabel, Paper, TableCell } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import SaveIcon from "@material-ui/icons/SaveAlt";
import Pagination from "@material-ui/lab/Pagination";
import { saveAs } from "file-saver";
import { OrderedMap } from "immutable";
import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
import { ContenderScoringInfo } from "src/model/contenderScoringInfo";
import { StoreState } from "src/model/storeState";
import { Tick } from "src/model/tick";
import { Api } from "src/utils/Api";
import { setErrorMessage } from "../../actions/actions";
import {
  createContenders,
  loadContenders,
  loadTicks,
} from "../../actions/asyncActions";
import { SortBy } from "../../constants/sortBy";
import { CompClass } from "../../model/compClass";
import { ContenderData } from "../../model/contenderData";
import { Contest } from "../../model/contest";
import { Problem } from "../../model/problem";
import { calculateContenderScoringInfo } from "../../selectors/selector";
import ProgressIconButton from "../ProgressIconButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import ContenderView from "./ContenderView";

const CONTENDERS_PER_PAGE = 10;

const breakpoints = new Map<number, string>()
  .set(1, "smDown")
  .set(2, "xsDown")
  .set(3, "smDown");

enum StaticFilter {
  All = "All",
  Registered = "Registered",
  Unregistered = "Unregistered",
}

interface Props {
  contestId?: number;
  contest?: Contest;
  finalEnabled?: boolean;
  contenders?: OrderedMap<number, ContenderData>;
  compClasses?: OrderedMap<number, CompClass>;
  problems?: OrderedMap<number, Problem>;
  ticks?: OrderedMap<number, Tick>;

  loadContenders?: (contestId: number) => Promise<void>;
  createContenders?: (contestId: number, nContenders: number) => Promise<void>;
  setErrorMessage?: (message: string) => void;
  loadTicks?: (contestId: number) => Promise<void>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paginationControl: {
      margin: theme.spacing(2, 0, 1, 0),
    },
    toolbar: {
      display: "flex",
      alignItems: "right",
      margin: theme.spacing(2, 0),
    },
    emptyText: { padding: theme.spacing(2) },
  })
);

const ContenderList = (props: Props) => {
  const classes = useStyles();
  const theme = useTheme();

  const [numberOfNewContenders, setNumberOfNewContenders] = useState<string>();
  const [showAddContendersPopup, setShowAddContendersPopup] = useState<boolean>(
    false
  );

  const [contenderFilter, setContenderFilter] = useState<string>(
    StaticFilter[StaticFilter.All]
  );

  const [selectedContenders, setSelectedContenders] = useState<number[]>([]);
  const [contenderSortBy, setContenderSortBy] = useState<string>(
    SortBy.BY_NAME
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = React.useState(1);

  const scoringByContender = useMemo(() => {
    if (props.contest === undefined) {
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

    contenders = contenders?.filter((contender: ContenderData) => {
      switch (contenderFilter) {
        case StaticFilter.All:
          return true;
        case StaticFilter.Registered:
          return contender.compClassId != null;
        case StaticFilter.Unregistered:
          return contender.compClassId == null;
        default:
          return (
            contender.compClassId !== undefined &&
            selectedContenders.includes(contender.compClassId)
          );
      }
    });

    const getScore = (
      contender: ContenderData
    ): ContenderScoringInfo | undefined => {
      return contender.id ? scoringByContender?.get(contender.id) : undefined;
    };

    if (contenderSortBy === SortBy.BY_NUMBER_OF_TICKS) {
      contenders?.sort(
        (a, b) =>
          (getScore(b)?.ticks?.length ?? 0) - (getScore(a)?.ticks?.length ?? 0)
      );
    } else if (contenderSortBy === SortBy.BY_TOTAL_POINTS) {
      contenders?.sort(
        (a, b) =>
          (getScore(b)?.totalScore ?? 0) - (getScore(a)?.totalScore ?? 0)
      );
    } else if (contenderSortBy === SortBy.BY_QUALIFYING_POINTS) {
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
  }, [
    props.contenders,
    selectedContenders,
    contenderFilter,
    contenderSortBy,
    scoringByContender,
  ]);

  const numPages = Math.ceil(
    (contendersSortedAndFiltered?.length ?? 0) / CONTENDERS_PER_PAGE
  );

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
  };

  const onNewContendersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfNewContenders(e.target.value);
  };

  const addContendersConfirmed = () => {
    let number: number = 0;
    if (numberOfNewContenders !== undefined) {
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

  const onContenderFilterCompClassChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    setContenderFilter(e.target.value as string);

    if (!((e.target.value as string) in StaticFilter)) {
      const filterCompClass = props.compClasses?.get(
        parseInt(e.target.value as string)
      );
      setSelectedContenders([filterCompClass?.id!]);
    }

    setPage(1);
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

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const headings = [
    <TableCell
      style={{ cursor: "pointer" }}
      onClick={() => setContenderSortBy(SortBy.BY_NAME)}
    >
      Name
    </TableCell>,
    <TableCell>Class</TableCell>,
    <TableCell
      style={{ cursor: "pointer" }}
      onClick={() => setContenderSortBy(SortBy.BY_TOTAL_POINTS)}
    >
      Total score
    </TableCell>,
    <TableCell
      style={{ cursor: "pointer" }}
      onClick={() => setContenderSortBy(SortBy.BY_NUMBER_OF_TICKS)}
    >
      # Ticks
    </TableCell>,
    <TableCell style={{ minWidth: 110 }}>Regcode</TableCell>,
  ];

  return (
    <>
      <div className={classes.toolbar}>
        {(props.compClasses?.size ?? 0) > 0 && (
          <FormControl
            style={{
              width: "100%",
              marginLeft: theme.spacing(1),
            }}
          >
            <InputLabel shrink htmlFor="compClass-select">
              Class
            </InputLabel>
            <Select
              id="compClass-select"
              value={contenderFilter}
              onChange={onContenderFilterCompClassChange}
            >
              {[
                StaticFilter.All,
                StaticFilter.Registered,
                StaticFilter.Unregistered,
              ].map((filter) => (
                <MenuItem
                  key={StaticFilter[filter]}
                  value={StaticFilter[filter]}
                >
                  <em>{StaticFilter[filter]}</em>
                </MenuItem>
              ))}
              {props.compClasses?.toArray()?.map((compClass: CompClass) => (
                <MenuItem key={compClass.id} value={compClass.id}>
                  {compClass.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <ProgressIconButton
          color="inherit"
          aria-label="Menu"
          title="Refresh"
          disabled={refreshing}
          onClick={refreshContenders}
          loading={refreshing}
        >
          <RefreshIcon />
        </ProgressIconButton>
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
      </div>
      <div>
        <Paper>
          <Table>
            <ResponsiveTableHead cells={headings} breakpoints={breakpoints} />
            <TableBody>
              {contendersSortedAndFiltered
                ?.slice(
                  (page - 1) * CONTENDERS_PER_PAGE,
                  page * CONTENDERS_PER_PAGE
                )
                ?.map((contender) => (
                  <ContenderView
                    key={contender.id}
                    contender={contender}
                    scoring={scoringByContender?.get(contender.id!)}
                    compClasses={props.compClasses}
                    problems={props.problems}
                    breakpoints={breakpoints}
                  />
                ))}
            </TableBody>
          </Table>
          {(props.contenders?.size ?? 0) === 0 && (
            <div className={classes.emptyText}>
              Use the plus button to create registration codes for your
              contenders.
            </div>
          )}
        </Paper>
        {numPages > 1 && (
          <div className={classes.paginationControl}>
            <Grid container justify="center">
              <Pagination
                count={numPages}
                page={page}
                size="small"
                onChange={handlePageChange}
                showLastButton
              />
            </Grid>
          </div>
        )}
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
  createContenders,
  loadTicks,
  setErrorMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContenderList);
