import { Paper, StyledComponentProps } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as Chroma from "chroma-js";
import { OrderedMap } from "immutable";
import React from "react";
import { Bar } from "react-chartjs-2";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Color } from "../../model/color";
import { Problem } from "../../model/problem";
import { StoreState } from "../../model/storeState";
import { Tick } from "../../model/tick";

interface Props {
  contestId?: number;
  problems?: OrderedMap<number, Problem>;
  colors?: OrderedMap<number, Color>;
  ticks?: OrderedMap<number, Tick>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      margin: theme.spacing(2),
    },
  })
);

const ContestStats = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
  const classes = useStyles();

  const problems = props.problems
    ?.toArray()
    ?.sort((p1, p2) => p1.number - p2.number);
  const ticks = props.ticks?.toArray();
  const ticksPerProblem = problems?.map(
    (problem) => ticks?.filter((tick) => tick.problemId === problem.id).length
  );
  const colors = problems?.map(
    (problem) => props.colors?.get(problem?.colorId)?.rgbPrimary
  );

  const data = {
    labels: problems?.map((problem) => problem?.name ?? problem.number),
    datasets: [
      {
        label: "Ticks",
        backgroundColor: colors,
        borderColor: colors?.map((color) =>
          Chroma(color ?? "#ffffff")
            .darken()
            .hex()
        ),
        borderWidth: 1,
        hoverBackgroundColor: colors?.map((color) =>
          Chroma(color ?? "#ffffff")
            .brighten()
            .hex()
        ),
        hoverBorderColor: colors,
        data: ticksPerProblem,
      },
    ],
  };

  return (
    <Paper>
      <div className={classes.content}>
        <Bar
          data={data}
          width={100}
          height={50}
          options={{
            maintainAspectRatio: true,
          }}
        />
      </div>
    </Paper>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    problems: state.problemsByContest.get(props.contestId),
    colors: state.colors,
    ticks: state.ticksByContest.get(props.contestId),
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ContestStats);
