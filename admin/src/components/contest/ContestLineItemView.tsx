import React from "react";
import { Contest } from "../../model/contest";
import { TableCell, Hidden } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import { Series } from "src/model/series";
import moment from "moment";
import { OrderedMap } from "immutable";

interface Props {
  contest?: Contest;
  series?: OrderedMap<number, Series>;
}

const ContestLineItemView = (props: Props & RouteComponentProps) => {
  const getSeriesName = (id?: number) => {
    if (id) {
      return props.series?.get(id)?.name;
    } else {
      return undefined;
    }
  };

  return (
    <TableRow
      key={props.contest?.id}
      style={{ cursor: "pointer" }}
      hover
      onClick={() => props.history.push("/contests/" + props.contest?.id)}
    >
      <TableCell component="th" scope="row">
        {props.contest?.name}
      </TableCell>
      <Hidden smDown>
        <TableCell>
          {props.contest?.timeBegin
            ? moment(props.contest?.timeBegin).format("YYYY-MM-DD HH:mm")
            : undefined}
        </TableCell>
        <TableCell>
          {props.contest?.timeEnd
            ? moment(props.contest?.timeEnd).format("YYYY-MM-DD HH:mm")
            : undefined}
        </TableCell>
        <TableCell>{getSeriesName(props.contest?.seriesId)}</TableCell>
      </Hidden>
    </TableRow>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    series: state.series,
  };
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ContestLineItemView));
