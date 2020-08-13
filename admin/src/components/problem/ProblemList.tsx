import React, { useState, useEffect, Fragment, useMemo } from "react";
import { StyledComponentProps } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import { loadProblems, reloadColors } from "../../actions/asyncActions";
import { setTitle } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import { Problem } from "../../model/problem";
import ProblemListItem from "./ProblemListItem";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Organizer } from "src/model/organizer";
import { Color } from "../../model/color";
import * as Chroma from "chroma-js";
import { Tick } from "../../model/tick";
import { ContenderData } from "../../model/contenderData";
import { CompClass } from "../../model/compClass";
import {
  getSelectedOrganizer,
  groupTicksByProblem,
} from "src/selectors/selector";
import Grid from "@material-ui/core/Grid";
import { OrderedMap } from "immutable";

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
  setTitle?: (title: string) => void;
}

const ProblemList = (props: Props & StyledComponentProps) => {
  const [insertAfterNumber, setInsertAfterNumber] = useState<
    number | undefined
  >(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const problemsSorted = useMemo(() => {
    return props.problems?.toArray()?.sort((p1, p2) => p1.number - p2.number);
  }, [props.problems]);

  const ticksByProblem = useMemo(() => {
    let ticks = props.ticks?.toArray();
    return ticks != undefined ? groupTicksByProblem(ticks) : undefined;
  }, [props.ticks]);

  const createDone = () => {
    setInsertAfterNumber(undefined);
  };

  const beginCreate = (problemNumber: number) => {
    setInsertAfterNumber(problemNumber);
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

  const getProblemStyle = (problem: Problem, opacity: number = 1) => {
    let color = problem.colorId
      ? props.colors?.get(problem.colorId)
      : undefined;
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
    const chromaInst = Chroma(rgbColor);
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
      display: "flex",
      border: borderWidth + "px solid " + borderColor,
      padding: "2px 10px",
      color: textColor,
      borderRadius: 5,
      alignItems: "center",
      opacity,
      background: background,
      margin: 0,
    };
  };

  const makeCreateView = (number: number, allowCancel: boolean) => {
    return (
      <ProblemListItem
        getColorName={getColorName}
        getProblemStyle={getProblemStyle}
        allowEdit={true}
        allowCancel={allowCancel}
        onCreateDone={createDone}
        problem={{
          name: undefined,
          number,
          contestId: props.contestId!,
        }}
      />
    );
  };

  let allowEdit = (ticksByProblem?.size ?? 0) === 0;

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="Menu"
        title="Refresh"
        onClick={refreshProblems}
      >
        {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
      </IconButton>
      <Grid container direction="column">
        {!refreshing &&
          (props.problems?.size ?? 0) === 0 &&
          makeCreateView(1, false)}
        {problemsSorted?.map((problem: Problem) => {
          return (
            <Fragment key={problem.id!}>
              <span
                style={{
                  padding: 5,
                  opacity: insertAfterNumber != undefined ? 0.1 : 1,
                }}
              >
                <ProblemListItem
                  getColorName={getColorName}
                  getProblemStyle={getProblemStyle}
                  allowEdit={allowEdit}
                  allowCancel={true}
                  onBeginCreate={beginCreate}
                  problem={problem}
                  contenders={props.contenders}
                  compClasses={props.compClasses}
                  ticks={ticksByProblem?.get(problem.id!)}
                />
              </span>
              {problem.number == insertAfterNumber &&
                makeCreateView(
                  problem.number + 1,
                  (props.problems?.size ?? 0) > 0
                )}
            </Fragment>
          );
        })}
      </Grid>
    </>
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
  setTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemList);
