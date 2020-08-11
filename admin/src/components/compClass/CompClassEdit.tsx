import React, { useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import TableRow from "@material-ui/core/TableRow";
import { TableCell } from "@material-ui/core";
import { CompClass } from "../../model/compClass";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { saveCompClass } from "../../actions/asyncActions";
import { CircularProgress } from "@material-ui/core";
import moment from "moment";
import { DateTimePicker } from "@material-ui/pickers";

interface Props {
  contestId?: number;
  compClass?: CompClass;
  onDone?: () => void;
  saveCompClass?: (compClass: CompClass) => Promise<CompClass>;
}

const CompClassEdit = (props: Props) => {
  const [compClass, setCompClass] = useState<CompClass>({
    ...props.compClass!,
  });
  let [saving, setSaving] = useState<boolean>(false);

  const format = "YYYY-MM-DD HH:mm";

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompClass({ ...compClass, name: e.target.value });
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompClass({ ...compClass, description: e.target.value });
  };

  const onTimeBeginChange = (newTimeBegin: any) => {
    let oldTimeBegin = moment(compClass.timeBegin);
    let millisDiff = newTimeBegin.diff(oldTimeBegin);

    let newTimeEnd = moment(compClass.timeEnd);
    newTimeEnd.add(millisDiff, "ms");

    setCompClass({
      ...compClass,
      timeBegin: newTimeBegin,
      timeEnd: newTimeEnd.format("YYYY-MM-DDTHH:mm:ssZ"),
    });
  };

  const onTimeEndChange = (e: any) => {
    let newTimeEnd = e.toDate();
    setCompClass({
      ...compClass,
      timeEnd: newTimeEnd,
    });
  };

  const onSave = () => {
    setSaving(true);
    props
      .saveCompClass?.(compClass)
      .then((compClass) => {
        setSaving(false);
        props.onDone?.();
      })
      .catch((error) => setSaving(false));
  };

  let timeBegin = Date.parse(compClass.timeBegin);
  let timeEnd = Date.parse(compClass.timeEnd);

  return (
    <TableRow key={compClass.id} style={{ cursor: "pointer" }}>
      <TableCell component="th" scope="row">
        <TextField style={{}} value={compClass.name} onChange={onNameChange} />
      </TableCell>
      <TableCell>
        <TextField
          style={{}}
          value={compClass.description}
          onChange={onDescriptionChange}
        />
      </TableCell>
      <TableCell>
        <DateTimePicker
          ampm={false}
          format={format}
          value={timeBegin}
          onChange={onTimeBeginChange}
        />
      </TableCell>
      <TableCell>
        <DateTimePicker
          ampm={false}
          format={format}
          value={timeEnd}
          onChange={onTimeEndChange}
        />
      </TableCell>
      <TableCell align="right">
        <IconButton
          color="inherit"
          aria-label="Menu"
          title={compClass.id == undefined ? "Create" : "Save"}
          onClick={onSave}
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} /> : <SaveIcon />}
        </IconButton>
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
  saveCompClass,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompClassEdit);
