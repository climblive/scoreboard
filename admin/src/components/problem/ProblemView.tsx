import { Divider, TableCell, Typography, useTheme } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { OrderedMap } from "immutable";
import React, { CSSProperties } from "react";
import { Color } from "src/model/color";
import { CompClass } from "src/model/compClass";
import { ContenderData } from "src/model/contenderData";
import { Problem } from "src/model/problem";
import { Tick } from "src/model/tick";
import ResponsiveTableRow from "../ResponsiveTableRow";
import ProblemEdit from "./ProblemEdit";
import ProblemTickList from "./ProblemTickList";

interface Props {
  problem: Problem;
  ticks?: Tick[];
  compClasses?: OrderedMap<number, CompClass>;
  contenders?: OrderedMap<number, ContenderData>;
  editable?: boolean;
  getProblemStyle: (color?: Color) => CSSProperties;
  breakpoints?: Map<number, string>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorBox: {
      padding: theme.spacing(1, 2),
    },
    collapsableBody: {
      "& > *": {
        margin: theme.spacing(1, 0),
      },
      minWidth: 296,
      maxWidth: 600,
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      flexBasis: 0,
    },
  })
);

const ProblemView = (props: Props) => {
  const classes = useStyles();
  const theme = useTheme();

  const cells = [
    <TableCell component="th" scope="row">
      {props.problem.number}
    </TableCell>,
    <TableCell>
      <div
        style={props.getProblemStyle(props.problem.color)}
        className={classes.colorBox}
      >
        {props.problem.name ?? props.problem.color?.name}
      </div>
    </TableCell>,
    <TableCell>{props.problem.points}</TableCell>,
    <TableCell>{props.problem.flashBonus}</TableCell>,
  ];

  return (
    <ResponsiveTableRow cells={cells} breakpoints={props.breakpoints}>
      <div className={classes.collapsableBody}>
        <Typography color="textSecondary" display="block" variant="caption">
          Info
        </Typography>

        <ProblemEdit
          problem={props.problem}
          getProblemStyle={props.getProblemStyle}
          removable
          editable={props.editable}
          orderable
        />

        <Divider />

        {props.ticks && (
          <>
            <Typography color="textSecondary" display="block" variant="caption">
              Ticks
            </Typography>

            <div style={{ padding: theme.spacing(1, 0) }}>
              <ProblemTickList
                ticks={props.ticks}
                compClasses={props.compClasses}
                contenders={props.contenders}
              />
            </div>
          </>
        )}
      </div>
    </ResponsiveTableRow>
  );
};

export default ProblemView;
