import React, { useState } from "react";
import { Series } from "src/model/series";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { deleteSeries } from "../../actions/asyncActions";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import TableRow from "@material-ui/core/TableRow";
import { TableCell } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { CircularProgress } from "@material-ui/core";

interface Props {
  series?: Series;
  deleteSeries?: (series: Series) => Promise<void>;
  onClickEdit?: (series: Series) => void;
}

const SeriesView = (props: Props) => {
  let [deleting, setDeleting] = useState<boolean>(false);

  const onDelete = () => {
    setDeleting(true);
    props
      .deleteSeries?.(props.series!)
      .then(() => setDeleting(false))
      .catch((error) => setDeleting(false));
  };

  return (
    <TableRow key={props.series?.id}>
      <TableCell component="th" scope="row">
        {props.series?.name}
      </TableCell>
      <TableCell className={"icon-cell"}>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Edit"
          disabled={deleting}
          onClick={() => props.onClickEdit?.(props.series!)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Delete"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? <CircularProgress size={24} /> : <DeleteIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {
  deleteSeries,
};

export default connect(mapStateToProps, mapDispatchToProps)(SeriesView);
