import React, { useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import TableRow from "@material-ui/core/TableRow";
import { TableCell } from "@material-ui/core";
import { Series } from "../../model/series";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { saveSeries } from "../../actions/asyncActions";
import ProgressIconButton from "../ProgressIconButton";

interface Props {
  series?: Series;
  onDone?: () => void;
  saveSeries?: (series: Series) => Promise<Series>;
}

const SeriesEdit = (props: Props) => {
  const [series, setSeries] = useState<Series>({
    ...props.series!,
  });
  let [saving, setSaving] = useState<boolean>(false);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeries({ ...series, name: e.target.value });
  };

  const onSave = () => {
    setSaving(true);
    props
      .saveSeries?.(series)
      .then((series) => {
        setSaving(false);
        props.onDone?.();
      })
      .catch((error) => setSaving(false));
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <TextField style={{}} value={series.name} onChange={onNameChange} />
      </TableCell>
      <TableCell align="right">
        <ProgressIconButton
          color="inherit"
          aria-label="Menu"
          title={series.id == undefined ? "Create" : "Save"}
          onClick={onSave}
          loading={saving}
        >
          <SaveIcon />
        </ProgressIconButton>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Cancel"
          disabled={saving}
          onClick={() => props.onDone?.()}
        >
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {
  saveSeries,
};

export default connect(mapStateToProps, mapDispatchToProps)(SeriesEdit);
