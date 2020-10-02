import { Hidden, TableCell } from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { Fragment } from "react";

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

          if (breakpoint === undefined) {
            return <Fragment key={index}>{cell}</Fragment>;
          } else {
            const props = { [breakpoint]: true };

            return (
              <Hidden key={index} {...props}>
                {cell}
              </Hidden>
            );
          }
        })}
        <TableCell align="right">{props.toolbar}</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ResponsiveTableHead;
