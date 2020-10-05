import { IconButton, Paper, TableCell, TableRow } from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import * as Chroma from "chroma-js";
import { OrderedMap } from "immutable";
import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
import { Organizer } from "src/model/organizer";
import {
  getSelectedOrganizer,
  groupTicksByProblem,
} from "src/selectors/selector";
import { loadProblems, reloadColors } from "../../actions/asyncActions";
import { Color } from "../../model/color";
import { CompClass } from "../../model/compClass";
import { ContenderData } from "../../model/contenderData";
import { Problem } from "../../model/problem";
import { StoreState } from "../../model/storeState";
import { Tick } from "../../model/tick";
import ProgressIconButton from "../ProgressIconButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import ProblemEdit from "./ProblemEdit";
import ProblemView from "./ProblemView";

interface Props {
  contestId?: number;
  problems?: OrderedMap<number, Problem>;
  selectedOrganizer?: Organizer;
  colors?: OrderedMap<number, Color>;
  ticks?: OrderedMap<number, Tick>;
  contenders?: OrderedMap<number, ContenderData>;
  compClasses?: OrderedMap<number, CompClass>;
  loadProblems?: (contestId: number) => Promise<void>;
  loadColors?: () => Promise<void>;
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

const breakpoints = new Map<number, string>().set(2, "smDown").set(3, "smDown");

const ProblemList = (props: Props) => {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const problemsSorted = useMemo(() => {
    return props.problems?.toArray()?.sort((p1, p2) => p1.number - p2.number);
  }, [props.problems]);

  const ticksByProblem = useMemo(() => {
    let ticks = props.ticks?.toArray();
    return ticks !== undefined ? groupTicksByProblem(ticks) : undefined;
  }, [props.ticks]);

  const theme = useTheme();
  const classes = useStyles();

  const createDone = () => {
    setShowCreate(false);
  };

  const beginCreate = () => {
    setShowCreate(true);
  };

  const refreshProblems = () => {
    setRefreshing(true);
    props.loadProblems?.(props.contestId!).finally(() => setRefreshing(false));
  };

  const getColorName = (problem: Problem): string => {
    return problem.colorId
      ? props.colors?.get(problem.colorId)?.name ?? "UNDEFINED"
      : "UNDEFINED";
  };

  const getProblemStyle = (colorId: number, opacity: number = 1) => {
    let color = colorId ? props.colors?.get(colorId) : undefined;
    if (!color) {
      color = {
        id: undefined,
        organizerId: 0,
        name: "None",
        rgbPrimary: "888",
        shared: false,
      };
    }
    let rgbColor = color.rgbPrimary;
    if (rgbColor.charAt(0) !== "#") {
      rgbColor = "#" + rgbColor;
    }
    const chromaInst = Chroma.hex(rgbColor);
    const luminance = chromaInst.luminance();
    let borderColor = chromaInst.darken(1).hex();
    let textColor = luminance < 0.5 ? "#FFF" : "#333";
    let borderWidth = luminance < 0.5 ? 0 : 1;
    let background = rgbColor;
    if (color.rgbSecondary) {
      let rgbSecondary = color.rgbSecondary;
      if (rgbSecondary.charAt(0) !== "#") {
        rgbSecondary = "#" + rgbSecondary;
      }
      background =
        "repeating-linear-gradient(-30deg," +
        rgbColor +
        "," +
        rgbSecondary +
        " 15px," +
        rgbColor +
        " 30px)";
    }
    return {
      border: borderWidth + "px solid " + borderColor,
      color: textColor,
      borderRadius: 5,
      alignItems: "center",
      opacity,
      background: background,
      margin: 0,
    };
  };

  const nextNumber = () => {
    if (problemsSorted === undefined || problemsSorted.length === 0) {
      return 1;
    } else {
      const max = problemsSorted?.[problemsSorted?.length - 1].number ?? 0;
      return max + 1;
    }
  };

  let editable = (ticksByProblem?.size ?? 0) === 0;

  const headings = [
    <TableCell>Nº</TableCell>,
    <TableCell>Name</TableCell>,
    <TableCell>Points</TableCell>,
    <TableCell>Flash bonus</TableCell>,
  ];

  const toolbar = (
    <div className={classes.toolbar}>
      <IconButton
        color="inherit"
        title="Add"
        onClick={beginCreate}
        disabled={!editable || showCreate}
      >
        <AddCircleOutline />
      </IconButton>
      <ProgressIconButton
        color="inherit"
        title="Refresh"
        onClick={refreshProblems}
        loading={refreshing}
      >
        <RefreshIcon />
      </ProgressIconButton>
    </div>
  );

  let rows =
    problemsSorted?.map((problem: Problem) => {
      return (
        <ProblemView
          key={problem.id!}
          getColorName={getColorName}
          getProblemStyle={getProblemStyle}
          problem={problem}
          contenders={props.contenders}
          compClasses={props.compClasses}
          ticks={ticksByProblem?.get(problem.id!)}
          breakpoints={breakpoints}
          editable={editable}
        />
      );
    }) ?? [];

  if (showCreate) {
    const component = (
      <TableRow key="new" selected>
        <TableCell padding="none" colSpan={5}>
          <div style={{ padding: theme.spacing(0, 2) }}>
            <ProblemEdit
              getColorName={getColorName}
              getProblemStyle={getProblemStyle}
              cancellable
              editable
              onDone={createDone}
              orderable
              problem={{
                name: undefined,
                number: nextNumber(),
                colorId: props.colors?.toArray()?.[0]?.id,
                contestId: props.contestId!,
                points: 1,
              }}
            />
          </div>
        </TableCell>
      </TableRow>
    );
    rows = [component, ...rows];
  }

  return (
    <Paper>
      <Table>
        <ResponsiveTableHead
          cells={headings}
          breakpoints={breakpoints}
          toolbar={toolbar}
        />
        <TableBody>{rows}</TableBody>
      </Table>
      {!showCreate && (props.problems?.size ?? 0) === 0 && (
        <div className={classes.emptyText}>
          Use the plus button to add your first boulder problem.
        </div>
      )}
    </Paper>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    problems: state.problemsByContest.get(props.contestId),
    ticks: state.ticksByContest.get(props.contestId),
    contenders: state.contendersByContest.get(props.contestId),
    compClasses: state.compClassesByContest.get(props.contestId),
    colors: state.colors,
    selectedOrganizer: getSelectedOrganizer(state),
  };
}

const mapDispatchToProps = {
  loadProblems,
  loadColors: reloadColors,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemList);
