import { Hidden, TableCell } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Contest } from "../../model/contest";
import { StoreState } from "../../model/storeState";

interface Props {
  contest: Contest;
}

const ContestLineItemView = (
  props: Props & PropsFromRedux & RouteComponentProps
) => {
  const getSeriesName = (id?: number) => {
    if (id) {
      return props.series?.get(id)?.name;
    } else {
      return undefined;
    }
  };

  return (
    <TableRow
      key={props.contest.id}
      style={{ cursor: "pointer" }}
      hover
      onClick={() => props.history.push("/contests/" + props.contest.id)}
    >
      <TableCell component="th" scope="row">
        {props.contest.name}
      </TableCell>
      <Hidden smDown>
        <TableCell>
          {props.contest.timeBegin
            ? moment(props.contest.timeBegin).format("YYYY-MM-DD HH:mm")
            : undefined}
        </TableCell>
        <TableCell>
          {props.contest.timeEnd
            ? moment(props.contest.timeEnd).format("YYYY-MM-DD HH:mm")
            : undefined}
        </TableCell>
        <TableCell>{getSeriesName(props.contest.seriesId)}</TableCell>
      </Hidden>
    </TableRow>
  );
};

const mapStateToProps = (state: StoreState) => ({
  series: state.series,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(ContestLineItemView));
