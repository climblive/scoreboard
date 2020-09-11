import React, { useState, useMemo } from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import { loadProblems, reloadColors } from "../../actions/asyncActions";
import { Problem } from "../../model/problem";
import ProblemView from "./ProblemView";
import ProblemEdit from "./ProblemEdit";
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
import { OrderedMap } from "immutable";
import ProgressIconButton from "../ProgressIconButton";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import ResponsiveTableHead from "../ResponsiveTableHead";
import { useTheme } from "@material-ui/core/styles";

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

const breakpoints = new Map<number, string>().set(2, "smDown").set(3, "smDown");

const ProblemList = (props: Props) => {
  const [insertAfterNumber, setInsertAfterNumber] = useState<
    number | undefined
  >(undefined);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const problemsSorted = useMemo(() => {
    return props.problems?.toArray()?.sort((p1, p2) => p1.number - p2.number);
  }, [props.problems]);

  const ticksByProblem = useMemo(() => {
    let ticks = props.ticks?.toArray();
    return ticks != undefined ? groupTicksByProblem(ticks) : undefined;
  }, [props.ticks]);

  const theme = useTheme();

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
      border: borderWidth + "px solid " + borderColor,
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
      <TableRow selected>
        <TableCell padding="none" colSpan={5}>
          <div style={{ padding: theme.spacing(0, 2) }}>
            <ProblemEdit
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
          </div>
        </TableCell>
      </TableRow>
    );
  };

  let allowEdit = (ticksByProblem?.size ?? 0) === 0;

  const headings = [
    <TableCell>Number</TableCell>,
    <TableCell>Name</TableCell>,
    <TableCell>Points</TableCell>,
    <TableCell>Flash bonus</TableCell>,
  ];

  const toolbar = (
    <>
      <ProgressIconButton
        color="inherit"
        title="Refresh"
        onClick={refreshProblems}
        loading={refreshing}
      >
        <RefreshIcon />
      </ProgressIconButton>
    </>
  );

  return (
    <>
      <Table>
        <ResponsiveTableHead
          cells={headings}
          breakpoints={breakpoints}
          toolbar={toolbar}
        />
        <TableBody>
          {showCreate && makeCreateView(1, true)}
          {problemsSorted?.map((problem: Problem) => {
            return (
              <ProblemView
                key={problem.id!}
                getColorName={getColorName}
                getProblemStyle={getProblemStyle}
                allowEdit={allowEdit}
                onBeginCreate={beginCreate}
                problem={problem}
                contenders={props.contenders}
                compClasses={props.compClasses}
                ticks={ticksByProblem?.get(problem.id!)}
                breakpoints={breakpoints}
              />
            );
          })}
          {!refreshing &&
            (props.problems?.size ?? 0) === 0 &&
            makeCreateView(1, false)}
        </TableBody>
      </Table>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemList);
