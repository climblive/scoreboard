import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { TableCell, Hidden } from "@material-ui/core";

interface Props {
  cells?: React.ReactNode[];
  toolbar?: React.ReactNode;
  breakpoints?: Map<number, string>;
}

const ResponsiveTableHead = (props: Props) => {
  return (
    <TableHead>
      <TableRow>
        {props.cells?.map((cell, index) => {
          const breakpoint = props.breakpoints?.get(index);

          if (breakpoint == undefined) {
            return cell;
          } else {
            const props = { [breakpoint]: true };

            return <Hidden {...props}>{cell}</Hidden>;
          }
        })}
        <TableCell align="right">{props.toolbar}</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ResponsiveTableHead;
