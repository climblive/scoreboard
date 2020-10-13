import { Paper, TableCell } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DoneIcon from "@material-ui/icons/Done";
import { OrderedMap } from "immutable";
import moment from "moment";
import React from "react";
import { CompClass } from "src/model/compClass";
import { ContenderData } from "src/model/contenderData";
import { Tick } from "src/model/tick";

interface Props {
  ticks: Tick[];
  compClasses?: OrderedMap<number, CompClass>;
  contenders?: OrderedMap<number, ContenderData>;
}

const ProblemTickList = (props: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Contender</TableCell>
            <Hidden smDown>
              <TableCell>Class</TableCell>
            </Hidden>
            <TableCell>Time</TableCell>
            <TableCell>Flash</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.ticks.map((tick) => {
            let contender = props.contenders?.get(tick.contenderId);
            let compClass = props.compClasses?.get(contender?.compClassId!);
            return (
              <TableRow key={tick.id}>
                <TableCell component="th" scope="row">
                  {contender?.name}
                </TableCell>
                <Hidden smDown>
                  <TableCell>{compClass?.name}</TableCell>
                </Hidden>
                <TableCell>{moment(tick.timestamp).format("HH:mm")}</TableCell>
                <TableCell>{tick.flash && <DoneIcon />}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProblemTickList;
