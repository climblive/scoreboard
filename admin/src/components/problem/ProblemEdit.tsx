import { Button, IconButton } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import SaveIcon from "@material-ui/icons/Save";
import React, { CSSProperties, useState } from "react";
import { ColorResult, TwitterPicker } from "react-color";
import { ConnectedProps, connect } from "react-redux";
import { deleteProblem, saveProblem } from "../../actions/asyncActions";
import { Problem } from "../../model/problem";
import { StoreState } from "../../model/storeState";
import ColorSquare from "../ColorSquare";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { ProgressButton } from "../ProgressButton";

export interface Props {
  problem: Problem;
  editable?: boolean;
  cancellable?: boolean;
  removable?: boolean;
  orderable?: boolean;
  onDone?: () => void;
  getProblemStyle: (rgbPrimary: string, rgbSecondary?: string) => CSSProperties;
}

export const problemColors = [
  { hex: "#F44336", name: "Red" },
  { hex: "#4CAF50", name: "Green" },
  { hex: "#1790D2", name: "Blue" },
  { hex: "#E410EB", name: "Purple" },
  { hex: "#FFEB3B", name: "Yellow" },
  { hex: "#050505", name: "Black" },
  { hex: "#FF9800", name: "Orange" },
  { hex: "#F628A5", name: "Pink" },
  { hex: "#FAFAFA", name: "White" },
  { hex: "#654321", name: "Brown" },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorBox: {
      padding: theme.spacing(1, 0, 1, 1),
      height: 24,
      width: 24,
    },
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

const ProblemEdit = (props: Props & PropsFromRedux) => {
  let [deleteRequested, setDeleteRequested] = useState<boolean>(false);
  const [problem, setProblem] = useState<Problem>({
    ...props.problem,
  });
  let [saving, setSaving] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);
  const [activeColorPicker, setActiveColorPicker] = useState<
    "primary" | "secondary"
  >();

  const classes = useStyles();

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProblem({ ...problem, number: parseInt(e.target.value) || 0 });
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name: string | undefined = e.target.value;
    if (name.length === 0) {
      name = undefined;
    }
    setProblem({ ...problem, name: name !== "" ? name : undefined });
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let description: string | undefined = e.target.value;
    if (description.length === 0) {
      description = undefined;
    }
    setProblem({ ...problem, description });
  };

  const onPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProblem({ ...problem, points: parseInt(e.target.value) || 0 });
  };

  const onFlashBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let flashBonus = parseInt(e.target.value) || undefined;
    setProblem({ ...problem, flashBonus });
  };

  const onHoldColorPrimaryChange = (color: ColorResult) => {
    const colorName = problemColors.find(
      ({ hex }) => hex.toLowerCase() === color.hex.toLowerCase()
    )?.name;

    const hasColorName = problemColors.some(
      ({ name }) => name === problem.name
    );

    let name = problem.name;
    if (name === undefined || hasColorName) {
      name = colorName;
    }

    setProblem({ ...problem, name, holdColorPrimary: color.hex });
    setActiveColorPicker(undefined);
  };

  const onHoldColorSecondaryChange = (color: ColorResult) => {
    setProblem({ ...problem, holdColorSecondary: color.hex });
    setActiveColorPicker(undefined);
  };

  const clearHoldColorSecondary = (e: React.MouseEvent<HTMLElement>) => {
    setActiveColorPicker(undefined);
    setProblem({ ...problem, holdColorSecondary: undefined });
    e.stopPropagation();
  };

  const onDeleteConfirmed = (result: boolean) => {
    setDeleteRequested(false);

    if (result) {
      setDeleting(true);
      props.deleteProblem(props.problem).catch((error) => setDeleting(false));
    }
  };

  const onSave = () => {
    setSaving(true);
    props
      .saveProblem(problem)
      .then((problem) => {
        setSaving(false);
        props.onDone?.();
      })
      .catch((error) => setSaving(false));
  };

  return (
    <div className={classes.form}>
      <TextField
        label="Number"
        type="number"
        required
        value={problem.number}
        onChange={onNumberChange}
        disabled={!props.editable || !props.orderable}
      />
      <TextField
        label="Primary hold color"
        value={problem.holdColorPrimary}
        disabled={!props.editable}
        required
        onClick={() => setActiveColorPicker("primary")}
        InputProps={{
          startAdornment: (
            <ColorSquare
              color={problem.holdColorPrimary}
              className={classes.colorSquare}
            />
          ),
        }}
      />
      {activeColorPicker === "primary" && (
        <TwitterPicker
          onChange={onHoldColorPrimaryChange}
          colors={problemColors.map(({ hex }) => hex)}
        />
      )}
      <TextField
        label="Secondary hold color"
        value={problem.holdColorSecondary}
        required
        disabled={!props.editable}
        onClick={() => setActiveColorPicker("secondary")}
        InputProps={{
          startAdornment: (
            <ColorSquare
              color={problem.holdColorSecondary}
              className={classes.colorSquare}
            />
          ),
          endAdornment: problem.holdColorSecondary !== undefined && (
            <IconButton
              onClick={clearHoldColorSecondary}
              disabled={!props.editable}
            >
              <ClearIcon />
            </IconButton>
          ),
        }}
      />
      {activeColorPicker === "secondary" && (
        <TwitterPicker
          onChange={onHoldColorSecondaryChange}
          colors={problemColors.map(({ hex }) => hex)}
        />
      )}
      <TextField
        label="Name"
        disabled={!props.editable}
        value={problem.name}
        onChange={onNameChange}
      />
      <TextField
        label="Description"
        disabled={!props.editable}
        value={problem.description}
        onChange={onDescriptionChange}
      />
      <TextField
        label="Points"
        type="number"
        required
        disabled={!props.editable}
        value={problem.points}
        onChange={onPointsChange}
      />
      <TextField
        label="Flash bonus"
        type="number"
        required
        disabled={!props.editable}
        value={problem.flashBonus}
        onChange={onFlashBonusChange}
      />
      <div className={classes.buttons}>
        <ProgressButton
          variant="contained"
          color="secondary"
          loading={saving}
          onClick={onSave}
          disabled={!props?.editable || deleting}
          startIcon={<SaveIcon />}
        >
          {problem.id === undefined ? "Create" : "Save"}
        </ProgressButton>
        {props.removable && (
          <ProgressButton
            variant="contained"
            color="secondary"
            title="Delete"
            loading={deleting}
            disabled={!props?.editable || saving}
            onClick={() => setDeleteRequested(true)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </ProgressButton>
        )}
        {props.cancellable && (
          <Button
            color="secondary"
            variant="contained"
            disabled={saving || deleting}
            onClick={props.onDone}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
        )}
      </div>
      <ConfirmationDialog
        open={deleteRequested}
        title={"Delete problem"}
        message={"Do you wish to delete the selected problem?"}
        onClose={onDeleteConfirmed}
      />
    </div>
  );
};

const mapStateToProps = (state: StoreState) => ({});

const mapDispatchToProps = {
  saveProblem,
  deleteProblem,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ProblemEdit);
