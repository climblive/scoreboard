import React, { Fragment, useState } from "react";
import TableRow from "@material-ui/core/TableRow";
import { TableCell, Hidden, Collapse } from "@material-ui/core";
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

interface Props {
  children?: React.ReactNode;
  cells?: React.ReactNode[];
  breakpoints?: Map<number, string>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableRow: {
      cursor: "pointer",
      "& > *": {
        border: 0,
      },
    },
  })
);

const ResponsiveTableRow = (props: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const classes = useStyles();
  const theme = useTheme();

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <TableRow
        selected={expanded}
        className={classes.tableRow}
        hover
        onClick={() => {
          toggleExpanded();
        }}
      >
        {props.cells?.map((cell, index) => {
          const breakpoint = props.breakpoints?.get(index);

          if (breakpoint == undefined) {
            return <Fragment key={index}>{cell}</Fragment>;
          } else {
            const props = { [breakpoint]: true };

            return expanded ? (
              <Hidden key={index} {...props}>
                <TableCell colSpan={1} />
              </Hidden>
            ) : (
              <Hidden key={index} {...props}>
                {cell}
              </Hidden>
            );
          }
        })}
        <TableCell align="right">
          {expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </TableCell>
      </TableRow>

      <TableRow selected={expanded}>
        <TableCell padding="none" colSpan={(props.cells?.length ?? 0) + 1}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div style={{ padding: theme.spacing(0, 2) }}>{props.children}</div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ResponsiveTableRow;
