import { Button, IconButton } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SaveIcon from "@material-ui/icons/Save";
import { DateTimePicker } from "@material-ui/pickers";
import moment from "moment";
import React, { useState } from "react";
import { ColorResult, TwitterPicker } from "react-color";
import { connect, ConnectedProps } from "react-redux";
import { deleteCompClass, saveCompClass } from "../../actions/asyncActions";
import { CompClass } from "../../model/compClass";
import ColorSquare from "../ColorSquare";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { ProgressButton } from "../ProgressButton";

interface Props {
  compClass: CompClass;
  onDone?: () => void;
  removable?: boolean;
  cancellable?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      "& > *": {
        margin: theme.spacing(1, 0),
      },
      minWidth: 296,
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
    colorSquare: {
      margin: theme.spacing(1.5, 1, 1.5, 0),
    },
  })
);

const CompClassEdit = (props: Props & PropsFromRedux) => {
  const [compClass, setCompClass] = useState<CompClass>({
    ...props.compClass,
  });
  let [saving, setSaving] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);
  let [deleteRequested, setDeleteRequested] = useState<boolean>(false);
  let [colorPickerVisible, setColorPickerVisible] = useState<boolean>(false);

  const classes = useStyles();

  const format = "YYYY-MM-DD HH:mm";

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompClass({ ...compClass, name: e.target.value });
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompClass({ ...compClass, description: e.target.value });
  };

  const onColorChange = (
    color: ColorResult,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCompClass({ ...compClass, color: color.hex });
    setColorPickerVisible(false);
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
      .saveCompClass(compClass)
      .then((compClass) => {
        props.onDone?.();
      })
      .finally(() => setSaving(false));
  };

  const confirmDelete = (result: boolean) => {
    setDeleteRequested(false);

    if (result) {
      setDeleting(true);
      props.deleteCompClass(compClass).finally(() => setDeleting(false));
    }
  };

  const clearColor = (e: React.MouseEvent<HTMLElement>) => {
    setColorPickerVisible(false);
    setCompClass({ ...compClass, color: undefined });
    e.stopPropagation();
  };

  let timeBegin = Date.parse(compClass.timeBegin);
  let timeEnd = Date.parse(compClass.timeEnd);

  return (
    <>
      <div className={classes.form}>
        <TextField
          label="Name"
          required
          value={compClass.name}
          onChange={onNameChange}
        />
        <TextField
          label="Description"
          value={compClass.description}
          onChange={onDescriptionChange}
        />
        <TextField
          label="Color"
          value={compClass.color ?? ""}
          onClick={() => setColorPickerVisible(true)}
          InputProps={{
            startAdornment: compClass.color && (
              <ColorSquare
                color={compClass.color}
                className={classes.colorSquare}
              />
            ),
            endAdornment: compClass.color !== undefined && (
              <IconButton onClick={clearColor}>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
        {colorPickerVisible && (
          <TwitterPicker
            onChange={onColorChange}
            colors={[
              "#f44336",
              "#e91e63",
              "#9c27b0",
              "#673ab7",
              "#3f51b5",
              "#2196f3",
              "#03a9f4",
              "#00bcd4",
              "#009688",
              "#4caf50",
              "#8bc34a",
              "#cddc39",
              "#ffeb3b",
              "#ffc107",
              "#ff5722",
              "#795548",
              "#607d8b",
            ]}
          />
        )}
        <DateTimePicker
          label="Start time"
          required
          ampm={false}
          format={format}
          value={timeBegin}
          onChange={onTimeBeginChange}
        />
        <DateTimePicker
          label="End time"
          required
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
            {compClass.id === undefined ? "Create" : "Save"}
          </ProgressButton>
          {props.removable && (
            <ProgressButton
              color="secondary"
              variant="contained"
              disabled={saving}
              loading={deleting}
              onClick={() => setDeleteRequested(true)}
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
      <ConfirmationDialog
        open={deleteRequested}
        title={`Delete comp class`}
        message={"Do you wish to delete the selected comp class?"}
        onClose={confirmDelete}
      />
    </>
  );
};

const mapDispatchToProps = {
  saveCompClass,
  deleteCompClass,
};

const connector = connect(undefined, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CompClassEdit);
