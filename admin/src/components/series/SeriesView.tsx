import { TableCell, Typography } from "@material-ui/core";
import React from "react";
import { Series } from "src/model/series";
import ResponsiveTableRow from "../ResponsiveTableRow";
import SeriesEdit from "./SeriesEdit";

interface Props {
  series: Series;
  breakpoints?: Map<number, string>;
}

const SeriesView = (props: Props) => {
  const cells = [
    <TableCell component="th" scope="row">
      {props.series.name}
    </TableCell>,
  ];

  return (
    <ResponsiveTableRow cells={cells} breakpoints={props.breakpoints}>
      <Typography color="textSecondary" display="block" variant="caption">
        Info
      </Typography>
      <SeriesEdit series={props.series} removable />
    </ResponsiveTableRow>
  );
};

export default SeriesView;
