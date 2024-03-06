import { IconButton, Paper, TableCell } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import * as Chroma from "chroma-js";
import React, { CSSProperties, useMemo, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { groupTicksByProblem } from "src/selectors/selector";
import { loadProblems } from "../../actions/asyncActions";
import { Problem } from "../../model/problem";
import { StoreState } from "../../model/storeState";
import ProgressIconButton from "../ProgressIconButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import ResponsiveTableSpanningRow from "../ResponsiveTableSpanningRow";
import ProblemEdit, { problemColors } from "./ProblemEdit";
import ProblemView from "./ProblemView";

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

const breakpoints = new Map<number, string>().set(2, "smDown").set(3, "smDown");

const ProblemList = (props: Props & PropsFromRedux) => {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const problemsSorted = useMemo(() => {
    return props.problems?.toArray()?.sort((p1, p2) => p1.number - p2.number);
  }, [props.problems]);

  const ticksByProblem = useMemo(() => {
    let ticks = props.ticks?.toArray();
    return ticks !== undefined ? groupTicksByProblem(ticks) : undefined;
  }, [props.ticks]);

  const classes = useStyles();

  const createDone = () => {
    setShowCreate(false);
  };

  const beginCreate = () => {
    setShowCreate(true);
  };

  const refreshProblems = () => {
    setRefreshing(true);
    props.loadProblems(props.contestId).finally(() => setRefreshing(false));
  };

  const getProblemStyle = (
    rgbPrimary: string,
    rgbSecondary?: string,
    opacity: number = 1
  ): CSSProperties => {
    let rgbColor = rgbPrimary;
    if (rgbColor.charAt(0) !== "#") {
      rgbColor = "#" + rgbColor;
    }
    const chromaInst = Chroma.hex(rgbColor);
    const luminance = chromaInst.luminance();
    let borderColor = chromaInst.darken(1).hex();
    let textColor = luminance < 0.5 ? "#FFF" : "#333";
    let borderWidth = luminance < 0.5 ? 0 : 1;
    let background = rgbColor;
    if (rgbSecondary) {
      if (rgbSecondary.charAt(0) !== "#") {
        rgbSecondary = "#" + rgbSecondary;
      }
      background =
        "linear-gradient(135deg," +
        rgbColor +
        "," +
        rgbColor +
        " 50%," +
        rgbSecondary +
        " 50%," +
        rgbSecondary +
        " 50%)";
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
      <ResponsiveTableSpanningRow colSpan={5}>
        <ProblemEdit
          getProblemStyle={getProblemStyle}
          cancellable
          editable
          onDone={createDone}
          orderable
          problem={{
            name: problemColors[0].name,
            number: nextNumber(),
            holdColorPrimary: problemColors[0].hex,
            contestId: props.contestId,
            points: 1,
          }}
        />
      </ResponsiveTableSpanningRow>
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

const mapStateToProps = (state: StoreState, props: Props) => ({
  problems: state.problemsByContest.get(props.contestId),
  ticks: state.ticksByContest.get(props.contestId),
  contenders: state.contendersByContest.get(props.contestId),
  compClasses: state.compClassesByContest.get(props.contestId),
});

const mapDispatchToProps = {
  loadProblems,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ProblemList);
