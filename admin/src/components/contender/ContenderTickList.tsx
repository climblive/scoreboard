import React from "react";
import { Paper, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DoneIcon from "@material-ui/icons/Done";
import Hidden from "@material-ui/core/Hidden";
import { Problem } from "../../model/problem";
import { Color } from "../../model/color";
import { OrderedMap } from "immutable";
import moment from "moment";
import { ContenderScoringInfo } from "src/model/contenderScoringInfo";

interface Props {
  scoring: ContenderScoringInfo;
  problems?: OrderedMap<number, Problem>;
  colors?: OrderedMap<number, Color>;
}

const ContenderTickList = (props: Props) => {
  const theme = useTheme();

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Problem</TableCell>
            <Hidden smDown>
              <TableCell>Color</TableCell>
            </Hidden>
            <TableCell align="right">Points</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Flash</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.scoring?.ticks
            ?.sort((t1, t2) => t1.id! - t2.id!)
            ?.map((tick) => {
              let problem = props.problems?.get(tick.problemId);
              let color = props.colors?.get(problem?.colorId!);
              let points = problem!.points!;
              if (tick.flash && problem!.flashBonus) {
                points += problem!.flashBonus;
              }
              return (
                <TableRow key={tick.id}>
                  <TableCell component="th" scope="row">
                    {problem!.number}
                  </TableCell>
                  <Hidden smDown>
                    <TableCell>{color!.name}</TableCell>
                  </Hidden>
                  <TableCell align="right">{points}</TableCell>
                  <TableCell>
                    {moment(tick.timestamp).format("HH:mm")}
                  </TableCell>
                  <TableCell>{tick.flash && <DoneIcon />}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContenderTickList;
