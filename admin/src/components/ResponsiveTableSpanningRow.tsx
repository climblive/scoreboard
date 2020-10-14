import { TableCell } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import React from "react";

interface Props {
  children?: React.ReactNode;
  colSpan: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: { padding: theme.spacing(0, 2) },
  })
);

const ResponsiveTableSpanningRow = (props: Props) => {
  const classes = useStyles();

  return (
    <TableRow selected>
      <TableCell padding="none" colSpan={props.colSpan}>
        <div className={classes.content}>{props.children}</div>
      </TableCell>
    </TableRow>
  );
};

export default ResponsiveTableSpanningRow;
