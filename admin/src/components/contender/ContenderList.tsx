import {
  Grid,
  InputLabel,
  Paper,
  TableCell,
  TablePagination,
  TableSortLabel,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import SaveIcon from "@material-ui/icons/SaveAlt";
import { saveAs } from "file-saver";
import React, { useMemo, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ContenderScoringInfo } from "src/model/contenderScoringInfo";
import { StoreState } from "src/model/storeState";
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
import { calculateContenderScoringInfo } from "../../selectors/selector";
import ProgressIconButton from "../ProgressIconButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import ContenderView from "./ContenderView";

const DEFAULT_CONTENDERS_PER_PAGE = 10;

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
  contestId: number;
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
    createContendersInput: { width: 250 },
    filterSelector: {
      width: "100%",
      marginLeft: theme.spacing(1),
    },
  })
);

const ContenderList = (props: Props & PropsFromRedux) => {
  const classes = useStyles();

  const [numberOfNewContenders, setNumberOfNewContenders] = useState<string>();
  const [showAddContendersPopup, setShowAddContendersPopup] =
    useState<boolean>(false);

  const [contenderFilter, setContenderFilter] = useState<string>(
    StaticFilter[StaticFilter.All]
  );

  const [filter, setFilter] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [contenderSortBy, setContenderSortBy] = useState<string>(
    SortBy.BY_TOTAL_POINTS
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = React.useState(0);
  const [contendersPerPage, setContendersPerPage] = React.useState(
    DEFAULT_CONTENDERS_PER_PAGE
  );

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
            filter.includes(contender.compClassId)
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
          (getScore(a)?.ticks?.length ?? 0) - (getScore(b)?.ticks?.length ?? 0)
      );
    } else if (contenderSortBy === SortBy.BY_TOTAL_POINTS) {
      contenders?.sort(
        (a, b) =>
          (getScore(a)?.totalScore ?? 0) - (getScore(b)?.totalScore ?? 0)
      );
    } else if (contenderSortBy === SortBy.BY_QUALIFYING_POINTS) {
      contenders?.sort(
        (a, b) =>
          (getScore(a)?.qualifyingScore ?? 0) -
          (getScore(b)?.qualifyingScore ?? 0)
      );
    } else {
      contenders?.sort((a, b) => {
        let aName = a.name ? a.name.toLocaleUpperCase() : "ööööööööööö";
        let bName = b.name ? b.name.toLocaleUpperCase() : "ööööööööööö";
        return aName.localeCompare(bName);
      });
    }

    if (sortOrder === "desc") {
      contenders?.reverse();
    }

    return contenders;
  }, [
    props.contenders,
    filter,
    contenderFilter,
    contenderSortBy,
    sortOrder,
    scoringByContender,
  ]);

  const MAX_CONTENDER_COUNT = 500;

  const refreshContenders = () => {
    setRefreshing(true);
    Promise.all([
      props.loadContenders(props.contestId),
      props.loadTicks(props.contestId),
    ]).finally(() => setRefreshing(false));
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

    if (isNaN(number) || number === 0) {
      return;
    }

    setRefreshing(true);
    props
      .createContenders?.(props.contestId, number)
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
      setFilter([filterCompClass?.id!]);
    }

    setPage(0);
  };

  function exportResults(): any {
    Api.exportContest(props.contestId)
      .then((response) => {
        saveAs(response, "contest.xls");
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  }

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContendersPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const setSortOptions = (sortBy: SortBy) => {
    if (sortBy === contenderSortBy) {
      setSortOrder((order) => (order === "desc" ? "asc" : "desc"));
    } else {
      setContenderSortBy(sortBy);
      setSortOrder("asc");
    }
  };

  const headings = [
    <TableCell>
      <TableSortLabel
        active={contenderSortBy === SortBy.BY_NAME}
        direction={sortOrder}
        onClick={() => setSortOptions(SortBy.BY_NAME)}
      >
        Name
      </TableSortLabel>
    </TableCell>,
    <TableCell>Class</TableCell>,
    <TableCell>
      <TableSortLabel
        active={contenderSortBy === SortBy.BY_TOTAL_POINTS}
        direction={sortOrder}
        onClick={() => setSortOptions(SortBy.BY_TOTAL_POINTS)}
      >
        Total score
      </TableSortLabel>
    </TableCell>,
    <TableCell>
      <TableSortLabel
        active={contenderSortBy === SortBy.BY_QUALIFYING_POINTS}
        direction={sortOrder}
        onClick={() => setSortOptions(SortBy.BY_QUALIFYING_POINTS)}
      >
        Qualifying score
      </TableSortLabel>
    </TableCell>,
    <TableCell>Regcode</TableCell>,
  ];

  return (
    <>
      <div className={classes.toolbar}>
        {(props.compClasses?.size ?? 0) > 0 && (
          <FormControl className={classes.filterSelector}>
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
                  page * contendersPerPage,
                  (page + 1) * contendersPerPage
                )
                ?.map((contender) => (
                  <ContenderView
                    key={contender.id}
                    contender={contender}
                    scoring={scoringByContender?.get(contender.id!)}
                    compClasses={props.compClasses}
                    problems={props.problems}
                    breakpoints={breakpoints}
                    finalEnabled={props.contest?.finalEnabled ?? false}
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
        <div className={classes.paginationControl}>
          <Grid container justify="center">
            <TablePagination
              component="div"
              count={contendersSortedAndFiltered?.length ?? 0}
              page={page}
              onChangePage={handleChangePage}
              rowsPerPage={contendersPerPage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              labelRowsPerPage=""
            />
          </Grid>
        </div>
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
          Before a contest starts, you have to create activation codes enough
          for all contenders.
          <p>
            You can create a maximum of {MAX_CONTENDER_COUNT} activation codes
            per contest. Currently you have {props.contenders?.size ?? 0}{" "}
            registration codes.
          </p>
          <TextField
            className={classes.createContendersInput}
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

const mapStateToProps = (state: StoreState, props: Props) => ({
  contenders: state.contendersByContest.get(props.contestId),
  compClasses: state.compClassesByContest.get(props.contestId),
  problems: state.problemsByContest.get(props.contestId),
  ticks: state.ticksByContest.get(props.contestId),
  contest: state.contests?.get(props.contestId),
});

const mapDispatchToProps = {
  loadContenders,
  createContenders,
  loadTicks,
  setErrorMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ContenderList);
