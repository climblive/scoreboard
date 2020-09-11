import React, { useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import TextField from "@material-ui/core/TextField";
import {
  FormControl,
  Select,
  MenuItem,
  StyledComponentProps,
  Grid,
  InputLabel,
} from "@material-ui/core";
import { Problem } from "../../model/problem";
import { Color } from "../../model/color";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { saveProblem, loadCompClasses } from "../../actions/asyncActions";
import { OrderedMap } from "immutable";
import { ProgressButton } from "../ProgressButton";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { deleteProblem } from "../../actions/asyncActions";
import CancelIcon from "@material-ui/icons/Cancel";
import { Button } from "@material-ui/core";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";

interface Props {
  problem?: Problem;
  colors?: OrderedMap<number, Color>;
  cancellable?: boolean;
  removable?: boolean;
  onDone?: () => void;
  saveProblem?: (problem: Problem) => Promise<Problem>;
  getColorName?: (problem: Problem) => string;
  getProblemStyle?: (colorId: number) => object;
  deleteProblem?: (problem: Problem) => Promise<void>;
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

const ProblemEdit = (props: Props & StyledComponentProps) => {
  let [deleteRequested, setDeleteRequested] = useState<boolean>(false);
  const [problem, setProblem] = useState<Problem>({
    ...props.problem!,
  });
  let [saving, setSaving] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);

  const classes = useStyles();
  const theme = useTheme();

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name = e.target.value;
    setProblem({ ...problem, name: name != "" ? name : undefined });
  };

  const onPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProblem({ ...problem, points: parseInt(e.target.value) || 0 });
  };

  const onFlashBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let flashBonus = parseInt(e.target.value) || undefined;
    setProblem({ ...problem, flashBonus: parseInt(e.target.value) || 0 });
  };

  const onColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProblem({ ...problem, colorId: parseInt(e.target.value) });
  };

  const onDeleteConfirmed = (result: boolean) => {
    setDeleteRequested(false);

    if (result) {
      setDeleting(true);
      props
        .deleteProblem?.(props.problem!)
        .catch((error) => setDeleting(false));
    }
  };

  const onSave = () => {
    setSaving(true);
    props
      .saveProblem?.(problem)
      .then((problem) => {
        setSaving(false);
        props.onDone?.();
      })
      .catch((error) => setSaving(false));
  };

  return (
    <div className={classes.form}>
      <FormControl>
        <InputLabel shrink htmlFor="compClass-select">
          Color
        </InputLabel>
        <Select value={problem.colorId ?? ""} onChange={onColorChange}>
          {props.colors?.map((color: Color) => (
            <MenuItem key={color.id} value={color.id}>
              <Grid container direction="row" alignItems="center">
                <Grid style={{ marginRight: theme.spacing(1) }}>
                  <div
                    style={props.getProblemStyle?.(color.id!)}
                    className={classes.colorBox}
                  ></div>
                </Grid>
                <Grid>{color.name}</Grid>
              </Grid>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField label="Name" value={problem.name} onChange={onNameChange} />
      <TextField
        label="Points"
        value={problem.points == undefined ? "" : problem.points}
        onChange={onPointsChange}
      />
      <TextField
        label="Flash bonus"
        value={problem.flashBonus == undefined ? "" : problem.flashBonus}
        onChange={onFlashBonusChange}
      />
      <div className={classes.buttons}>
        <ProgressButton
          variant="contained"
          color="secondary"
          loading={saving}
          onClick={onSave}
          disabled={deleting}
          startIcon={<SaveIcon />}
        >
          {problem.id == undefined ? "Create" : "Save"}
        </ProgressButton>
        {props.removable && (
          <ProgressButton
            variant="contained"
            color="secondary"
            title="Delete"
            loading={deleting}
            disabled={saving}
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

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    colors: state.colors,
  };
}

const mapDispatchToProps = {
  saveProblem,
  deleteProblem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemEdit);
