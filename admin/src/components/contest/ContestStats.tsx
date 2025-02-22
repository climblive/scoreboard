import { Paper } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as Chroma from "chroma-js";
import React from "react";
import { Bar } from "react-chartjs-2";
import { connect, ConnectedProps } from "react-redux";
import { StoreState } from "../../model/storeState";

interface Props {
  contestId: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      margin: theme.spacing(2),
    },
  })
);

const ContestStats = (props: Props & PropsFromRedux) => {
  const classes = useStyles();

  const problems = props.problems
    ?.toArray()
    ?.sort((p1, p2) => p1.number - p2.number);
  const ticks = props.ticks?.toArray();
  const ticksPerProblem = problems?.map(
    (problem) => ticks?.filter((tick) => tick.problemId === problem.id).length
  );
  const colors = problems?.map((problem) => problem?.holdColorPrimary);

  const data = {
    labels: problems?.map((problem) => problem.number),
    datasets: [
      {
        label: "Ticks",
        backgroundColor: colors,
        borderColor: colors?.map((color) =>
          Chroma.hex(color ?? "#ffffff")
            .darken()
            .hex()
        ),
        borderWidth: 1,
        hoverBackgroundColor: colors?.map((color) =>
          Chroma.hex(color ?? "#ffffff")
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

const mapStateToProps = (state: StoreState, props: Props) => ({
  problems: state.problemsByContest.get(props.contestId),
  ticks: state.ticksByContest.get(props.contestId),
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ContestStats);
