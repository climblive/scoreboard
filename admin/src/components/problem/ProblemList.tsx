import React, { useState, useEffect, Fragment } from "react";
import {
  StyledComponentProps,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
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
import {
  getColorMap,
  getProblemsForContestSorted,
  getTicksByProblem,
  getCompClassesForContest,
} from "../../selectors/selector";
import * as Chroma from "chroma-js";
import { Tick } from "src/model/tick";
import { getSelectedOrganizer } from "src/selectors/selector";
import { CompClass } from "src/model/compClass";

const styles = {
  menuButton: {
    marginLeft: 0,
    marginRight: 0,
  },
};

interface Props {
  contestId?: number;
  problems?: Problem[];
  selectedOrganizer?: Organizer;
  colors?: Color[];
  colorMap: Map<number, Color>;
  ticksByProblem?: Map<number | undefined, Tick[]>;
  compClasses?: CompClass[];

  loadProblems?: (contestId: number) => Promise<void>;
  loadColors?: () => Promise<void>;
  setTitle?: (title: string) => void;
}

const ProblemList = (props: Props & StyledComponentProps) => {
  const [insertAfterNumber, setInsertAfterNumber] = useState<
    number | undefined
  >(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filterCompClassId, setFilterCompClassId] = useState<
    number | undefined
  >(props.compClasses?.[0]?.id);

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
      ? props.colorMap.get(problem.colorId)?.name ?? "UNDEFINED"
      : "UNDEFINED";
  };

  const getProblemStyle = (problem: Problem, opacity: number = 1) => {
    let color = problem.colorId
      ? props.colorMap.get(problem.colorId)
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
      marginBottom: 5,
      color: textColor,
      borderRadius: 5,
      alignItems: "center",
      opacity,
      background: background,
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

  let allowEdit = (props.ticksByProblem?.size ?? 0) === 0;

  return (
    <Paper style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          flexBasis: 0,
          overflowY: "auto",
          flexGrow: 1,
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Refresh"
          onClick={refreshProblems}
        >
          {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
        <ul style={{ padding: 10, margin: 0 }}></ul>
        {!refreshing &&
          (props.problems?.length ?? 0) === 0 &&
          makeCreateView(1, false)}
        {props.problems?.map((problem) => {
          return (
            <Fragment key={problem.id!}>
              <span
                style={{ opacity: insertAfterNumber != undefined ? 0.1 : 1 }}
              >
                <ProblemListItem
                  getColorName={getColorName}
                  getProblemStyle={getProblemStyle}
                  allowEdit={allowEdit}
                  allowCancel={true}
                  onBeginCreate={beginCreate}
                  problem={problem}
                />
              </span>
              {problem.number == insertAfterNumber &&
                makeCreateView(
                  problem.number + 1,
                  (props.problems?.length ?? 0) > 0
                )}
            </Fragment>
          );
        })}
      </div>
    </Paper>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    problems: getProblemsForContestSorted(state, props.contestId),
    colors: state.colors,
    colorMap: getColorMap(state),
    selectedOrganizer: getSelectedOrganizer(state),
    ticksByProblem: getTicksByProblem(state),
    compClasses: getCompClassesForContest(state, props.contestId),
  };
}

const mapDispatchToProps = {
  loadProblems,
  loadColors: reloadColors,
  setTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ProblemList));
