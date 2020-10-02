import { TableCell } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { CompClass } from "src/model/compClass";
import ResponsiveTableRow from "../ResponsiveTableRow";
import CompClassEdit from "./CompClassEdit";

interface Props {
  compClass?: CompClass;
  breakpoints?: Map<number, string>;
}

const CompClassView = (props: Props) => {
  const format = "YYYY-MM-DD HH:mm";

  const cells = [
    <TableCell component="th" scope="row">
      {props.compClass?.name}
    </TableCell>,
    <TableCell>{moment(props.compClass?.timeBegin).format(format)}</TableCell>,
    <TableCell>{moment(props.compClass?.timeEnd).format(format)}</TableCell>,
  ];

  return (
    <ResponsiveTableRow cells={cells} breakpoints={props.breakpoints}>
      <CompClassEdit compClass={props.compClass} removable />
    </ResponsiveTableRow>
  );
};

export default CompClassView;
