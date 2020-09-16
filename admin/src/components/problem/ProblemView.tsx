import React from "react";
import { Problem } from "src/model/problem";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { Tick } from "src/model/tick";
import { CompClass } from "src/model/compClass";
import { ContenderData } from "src/model/contenderData";
import { OrderedMap } from "immutable";
import { Button, TableCell, useTheme } from "@material-ui/core";
import ResponsiveTableRow from "../ResponsiveTableRow";
import ProblemEdit from "./ProblemEdit";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Divider, Typography } from "@material-ui/core";
import ProblemTickList from "./ProblemTickList";

interface Props {
  problem?: Problem;
  ticks?: Tick[];
  compClasses?: OrderedMap<number, CompClass>;
  contenders?: OrderedMap<number, ContenderData>;
  editable?: boolean;
  onBeginEdit?: () => void;
  getColorName?: (problem: Problem) => string;
  getProblemStyle?: (colorId: number) => object;
  onBeginCreate?: (problemNumber: number) => void;
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
      minWidth: 304,
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
      {props.problem?.number}
    </TableCell>,
    <TableCell>
      <div
        style={props.getProblemStyle?.(props.problem?.colorId!)}
        className={classes.colorBox}
      >
        {props.problem?.name ?? props.getColorName?.(props.problem!)}
      </div>
    </TableCell>,
    <TableCell>{props.problem?.points}</TableCell>,
    <TableCell>{props.problem?.flashBonus}</TableCell>,
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
        />

        <Divider />

        <Typography color="textSecondary" display="block" variant="caption">
          Ticks
        </Typography>

        <div style={{ padding: theme.spacing(1, 0) }}>
          <ProblemTickList
            problem={props.problem}
            ticks={props.ticks}
            compClasses={props.compClasses}
            contenders={props.contenders}
          />
        </div>
      </div>
    </ResponsiveTableRow>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemView);
