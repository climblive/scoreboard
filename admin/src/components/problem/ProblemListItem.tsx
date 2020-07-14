import React, { useState } from "react";
import { Problem } from "src/model/problem";
import ProblemView from "./ProblemView";
import ProblemEdit from "./ProblemEdit";

interface Props {
  problem?: Problem;
  allowEdit?: boolean;
  allowCancel?: boolean;
  onCreateDone?: () => void;
  getColorName?: (problem: Problem) => string;
  getProblemStyle?: (problem: Problem) => object;
  onBeginCreate?: (problemNumber: number) => void;
}

const ProblemListItem = (props: Props) => {
  let [editing, setEditing] = useState<boolean>(
    props.onCreateDone != undefined
  );

  return editing ? (
    <ProblemEdit
      allowCancel={props.allowCancel}
      getColorName={props.getColorName}
      getProblemStyle={props.getProblemStyle}
      problem={props.problem}
      onDone={() => {
        setEditing(false);
        props.onCreateDone?.();
      }}
    />
  ) : (
    <ProblemView
      allowEdit={props.allowEdit}
      getColorName={props.getColorName}
      getProblemStyle={props.getProblemStyle}
      problem={props.problem}
      onBeginEdit={() => setEditing(true)}
      onBeginCreate={props.onBeginCreate}
    />
  );
};

export default ProblemListItem;
