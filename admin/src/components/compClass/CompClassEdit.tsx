import React, { useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { CompClass } from "../../model/compClass";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { saveCompClass, deleteCompClass } from "../../actions/asyncActions";
import moment from "moment";
import { DateTimePicker } from "@material-ui/pickers";
import { ProgressButton } from "../ProgressButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

interface Props {
  compClass?: CompClass;
  onDone?: () => void;
  saveCompClass?: (compClass: CompClass) => Promise<CompClass>;
  deleteCompClass?: (compClass: CompClass) => Promise<void>;
  removable?: boolean;
  cancellable?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      "& > *": {
        margin: theme.spacing(1, 0),
      },
      minWidth: 304,
      maxWidth: 600,
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      flexBasis: 0,
    },
    buttons: {
      margin: theme.spacing(2, 0),
      "& > *": {
        marginRight: theme.spacing(1),
      },
    },
  })
);

const CompClassEdit = (props: Props) => {
  const [compClass, setCompClass] = useState<CompClass>({
    ...props.compClass!,
  });
  let [saving, setSaving] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);

  const classes = useStyles();

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
        props.onDone?.();
      })
      .finally(() => setSaving(false));
  };

  const onDelete = () => {
    setDeleting(true);
    props.deleteCompClass?.(compClass).finally(() => setDeleting(false));
  };

  let timeBegin = Date.parse(compClass.timeBegin);
  let timeEnd = Date.parse(compClass.timeEnd);

  return (
    <div className={classes.form}>
      <TextField
        label="Name"
        style={{}}
        value={compClass.name}
        onChange={onNameChange}
      />
      <TextField
        label="Description"
        style={{}}
        value={compClass.description}
        onChange={onDescriptionChange}
      />
      <DateTimePicker
        label="Start time"
        ampm={false}
        format={format}
        value={timeBegin}
        onChange={onTimeBeginChange}
      />
      <DateTimePicker
        label="End time"
        ampm={false}
        format={format}
        value={timeEnd}
        onChange={onTimeEndChange}
      />
      <div className={classes.buttons}>
        <ProgressButton
          color="secondary"
          variant="contained"
          onClick={onSave}
          disabled={deleting}
          loading={saving}
          startIcon={<SaveIcon />}
        >
          {compClass.id == undefined ? "Create" : "Save"}
        </ProgressButton>
        {props.removable && (
          <ProgressButton
            color="secondary"
            variant="contained"
            disabled={saving}
            loading={deleting}
            onClick={onDelete}
            startIcon={<DeleteForeverIcon />}
          >
            Delete
          </ProgressButton>
        )}
        {props.cancellable && (
          <Button
            color="secondary"
            variant="contained"
            disabled={saving}
            onClick={props.onDone}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {
  saveCompClass,
  deleteCompClass,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompClassEdit);
