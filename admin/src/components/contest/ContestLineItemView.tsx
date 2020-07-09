import React from "react";
import { Contest } from "../../model/contest";
import { TableCell } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import { getLocationMap, getSeriesMap } from "../../selectors/selector";
import { CompLocation } from "../../model/compLocation";
import { Series } from "src/model/series";
import moment from "moment";

interface Props {
  contest?: Contest;
  locationMap: Map<number, CompLocation>;
  seriesMap: Map<number, Series>;
}

const ContestLineItemView = (props: Props & RouteComponentProps) => {
  const getLocationName = (id?: number) => {
    if (id) {
      return props.locationMap.get(id)?.name;
    } else {
      return undefined;
    }
  };

  const getSeriesName = (id?: number) => {
    if (id) {
      return props.seriesMap.get(id)?.name;
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
      <TableCell>{getLocationName(props.contest?.locationId)}</TableCell>
      <TableCell>{getSeriesName(props.contest?.seriesId)}</TableCell>
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
    </TableRow>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    locationMap: getLocationMap(state),
    seriesMap: getSeriesMap(state),
  };
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ContestLineItemView));
