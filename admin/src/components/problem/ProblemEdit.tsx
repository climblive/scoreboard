import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import SaveIcon from "@material-ui/icons/Save";
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { deleteProblem, saveProblem } from "../../actions/asyncActions";
import { Color } from "../../model/color";
import { Problem } from "../../model/problem";
import { StoreState } from "../../model/storeState";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { ProgressButton } from "../ProgressButton";

export interface Props {
  problem: Problem;
  editable?: boolean;
  cancellable?: boolean;
  removable?: boolean;
  orderable?: boolean;
  onDone?: () => void;
  getProblemStyle: (colorId: number) => object;
}

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
  })
);

const ProblemEdit = (props: Props & PropsFromRedux) => {
  let [deleteRequested, setDeleteRequested] = useState<boolean>(false);
  const [problem, setProblem] = useState<Problem>({
    ...props.problem,
  });
  let [saving, setSaving] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);

  const classes = useStyles();
  const theme = useTheme();

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

  const onPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProblem({ ...problem, points: parseInt(e.target.value) || 0 });
  };

  const onFlashBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let flashBonus = parseInt(e.target.value) || undefined;
    setProblem({ ...problem, flashBonus });
  };

  const onColorChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setProblem({ ...problem, colorId: parseInt(e.target.value as string) });
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
      <FormControl required disabled={!props.editable}>
        <InputLabel shrink htmlFor="compClass-select">
          Hold color
        </InputLabel>
        <Select value={problem.colorId ?? ""} onChange={onColorChange}>
          {props.colors?.toArray()?.map((color: Color) => (
            <MenuItem key={color.id} value={color.id}>
              <Grid container direction="row" alignItems="center">
                <Grid style={{ marginRight: theme.spacing(1) }}>
                  <div
                    style={props.getProblemStyle(color.id!)}
                    className={classes.colorBox}
                  ></div>
                </Grid>
                <Grid>{color.name}</Grid>
              </Grid>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Name"
        disabled={!props.editable}
        value={problem.name}
        onChange={onNameChange}
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

const mapStateToProps = (state: StoreState) => ({
  colors: state.colors,
});

const mapDispatchToProps = {
  saveProblem,
  deleteProblem,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ProblemEdit);
