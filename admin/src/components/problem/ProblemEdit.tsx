import React, { useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import TableRow from "@material-ui/core/TableRow";
import {
  TableCell,
  FormControl,
  Select,
  MenuItem,
  StyledComponentProps,
} from "@material-ui/core";
import { Problem } from "../../model/problem";
import { Color } from "../../model/color";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { saveProblem } from "../../actions/asyncActions";
import { OrderedMap } from "immutable";
import ProgressIconButton from "../ProgressIconButton";

interface Props {
  problem?: Problem;
  colors?: OrderedMap<number, Color>;
  allowCancel?: boolean;
  onDone?: () => void;
  saveProblem?: (problem: Problem) => Promise<Problem>;
  getColorName?: (problem: Problem) => string;
  getProblemStyle?: (problem: Problem) => object;
}

const ProblemEdit = (props: Props & StyledComponentProps) => {
  const [problem, setProblem] = useState<Problem>({
    ...props.problem!,
  });
  let [saving, setSaving] = useState<boolean>(false);

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
    <li style={props.getProblemStyle?.(problem)}>
      <div style={{ width: 20, fontSize: 16 }}>{problem.number}</div>
      <FormControl
        style={{
          width: 100,
          textAlign: "left",
          marginLeft: 15,
          marginRight: "auto",
          fontSize: 16,
        }}
      >
        <Select
          style={{ color: "inherit" }}
          value={problem.colorId ?? ""}
          onChange={onColorChange}
        >
          {props.colors?.map((color: Color) => (
            <MenuItem key={color.id} value={color.id}>
              {color.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginRight: 15,
        }}
      >
        <div style={{ fontSize: 10, textAlign: "left" }}>Name</div>
        <TextField
          className="textfield-inherited"
          style={{
            textAlign: "right",
            width: 200,
            fontSize: 28,
            paddingTop: 0,
            color: "inherit",
          }}
          value={problem.name}
          onChange={onNameChange}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginRight: 15,
        }}
      >
        <div style={{ fontSize: 10, textAlign: "right" }}>Points</div>
        <TextField
          className="textfield-inherited"
          style={{
            textAlign: "right",
            width: 60,
            fontSize: 28,
            paddingTop: 0,
            color: "inherit",
          }}
          value={problem.points == undefined ? "" : problem.points}
          onChange={onPointsChange}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginRight: 15,
        }}
      >
        <div style={{ fontSize: 10, textAlign: "right" }}>Flash bonus</div>
        <TextField
          className="textfield-inherited"
          style={{
            textAlign: "right",
            width: 60,
            fontSize: 28,
            paddingTop: 0,
            color: "inherit",
          }}
          value={problem.flashBonus == undefined ? "" : problem.flashBonus}
          onChange={onFlashBonusChange}
        />
      </div>
      <div style={{ width: 48 }}></div>
      <ProgressIconButton
        className={props.classes?.menuButton}
        color="inherit"
        aria-label="Menu"
        title={problem.id == undefined ? "Create" : "Save"}
        loading={saving}
        onClick={onSave}
      >
        <SaveIcon />
      </ProgressIconButton>
      <IconButton
        className={props.classes?.menuButton}
        color="inherit"
        aria-label="Menu"
        title="Cancel"
        disabled={saving || !props.allowCancel}
        onClick={props.onDone}
      >
        <CancelIcon />
      </IconButton>
    </li>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    colors: state.colors,
  };
}

const mapDispatchToProps = {
  saveProblem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemEdit);
